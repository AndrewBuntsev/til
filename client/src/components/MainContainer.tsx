import React, { Component } from 'react';

import * as api from '../api';
import { ApiResponse } from '../types/ApiResponse';
import SideBar from './SideBar/SideBar';
import TilsList from './TilsList/TilsList';
import { Til } from '../types/Til';
import getTypeFromObject from '../helpers/getTypeFromObject';
import Authorization from './Authorization/Authorization';
import { ResponseStatus } from '../enums/ResponseStatus';
import styles from './MainContainer.module.css';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import setIsAboutPopupVisible from '../redux/actions/setIsAboutPopupVisible';
import setIsSearchFormVisible from '../redux/actions/setIsSearchFormVisible';
import setIsUserMenuVisible from '../redux/actions/setIsUserMenuVisible';
import { Action } from '../redux/Action';
import dispatchCombinedAction from '../redux/actions/dispatchCombinedAction';



type Props = {
    location: object;
    dispatchCombinedAction(actions: Array<Action>): Action;
};
type State = {
    tils: Array<Til>;
    queryString: string;
};

class MainContainer extends Component<Props, State> {
    state = {
        tils: [],
        queryString: null
    };


    async componentDidMount() {
        console.log('componentDidMount');
        // Don't remove - triggers componentDidUpdate
        this.setState({ queryString: null });
    }

    async componentDidUpdate() {
        const queryString = this.props.location['search'];
        if (queryString != this.state.queryString) {
            const params = new URLSearchParams(queryString);
            const response: ApiResponse = await api.getTils({
                _id: params.get('id') ?? '',
                author: params.get('author') ?? '',
                date: params.get('date') ?? '',
                tag: params.get('tag') ?? '',
                searchTerm: params.get('searchTerm') ?? '',
                random: params.get('random') ?? ''
            });

            console.log(response);
            if (response.status == ResponseStatus.SUCCESS && response.payload) {
                this.setState({
                    tils: getTypeFromObject<Array<Til>>(response.payload),
                    queryString: queryString
                });
            } else {
                console.error(response);
            }
        }
    }

    onClick = () => {
        this.props.dispatchCombinedAction([
            setIsAboutPopupVisible(false),
            setIsSearchFormVisible(false),
            setIsUserMenuVisible(false)]);
    };

    render() {
        let keyword = null;
        const params = new URLSearchParams(this.state.queryString);

        if (params.get('author')) {
            keyword = `by ${params.get('author')}`;
        } else if (params.get('date')) {
            keyword = `on ${params.get('date')}`;
        } else if (params.get('tag')) {
            keyword = `about #${params.get('tag')}`;
        } else if (params.get('searchTerm')) {
            keyword = `about ${params.get('searchTerm')}`;
        }


        return (
            <div>
                <SideBar />
                <Authorization />
                <div className={styles.container} onClick={this.onClick}>
                    {keyword && <h2 className={styles.searchResultsHeader}>{`${this.state.tils.length} post${this.state.tils.length != 1 ? 's' : ''} ${keyword}`}</h2>}
                    <TilsList tils={this.state.tils} />
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => ({
    dispatchCombinedAction: (actions: Array<Action>) => dispatch(dispatchCombinedAction(actions))
});

export default connect(null, mapDispatchToProps)(MainContainer);



