import React, { Component } from 'react';

import * as api from '../../api';
import { ApiResponse } from '../../types/ApiResponse';
import SideBar from '../SideBar/SideBar';
import TilsList from '../TilsList/TilsList';
import { Til } from '../../types/Til';
import getTypeFromObject from '../../helpers/getTypeFromObject';
import Authorization from '../Authorization/Authorization';
import { ResponseStatus } from '../../enums/ResponseStatus';
import styles from './MainContainer.module.css';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import setIsAboutPopupVisible from '../../redux/actions/setIsAboutPopupVisible';
import setIsSearchFormVisible from '../../redux/actions/setIsSearchFormVisible';
import setIsUserMenuVisible from '../../redux/actions/setIsUserMenuVisible';
import { Action } from '../../redux/Action';
import dispatchCombinedAction from '../../redux/actions/dispatchCombinedAction';
import { User } from '../../types/User';
import SearchResultsHeader from './SearchResultsHeader';



type Props = {
    location: object;
    dispatchCombinedAction(actions: Array<Action>): Action;
};
type State = {
    tils: Array<Til>;
    queryString: string;
    author?: User;
};

class MainContainer extends Component<Props, State> {
    state = {
        tils: [],
        author: null,
        queryString: null
    };


    async componentDidMount() {
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

            if (response.status == ResponseStatus.SUCCESS && response.payload) {
                let author: User = null;
                if (params.get('author')) {
                    const authorDataResponse: ApiResponse = await api.getUserData(params.get('author'));
                    if (authorDataResponse.status == ResponseStatus.SUCCESS && authorDataResponse.payload) {
                        author = getTypeFromObject<User>(authorDataResponse.payload)
                    }
                }
                this.setState({
                    tils: getTypeFromObject<Array<Til>>(response.payload),
                    queryString: queryString,
                    author: author
                });

                window.scrollTo(0, 0);
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
        const params = new URLSearchParams(this.state.queryString);

        return (
            <div>
                <SideBar />
                <Authorization />
                <div className={styles.container} onClick={this.onClick}>
                    <SearchResultsHeader
                        params={params}
                        author={this.state.author}
                        tilCount={this.state.tils.length} />
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



