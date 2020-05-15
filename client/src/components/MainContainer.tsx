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



type Props = {
    location: object;
    setIsSearchFormVisible: (isSearchFormVisible: boolean) => void;
    setIsAboutPopupVisible: (isSearchFormVisible: boolean) => void;
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
        this.setState({ queryString: '' });
    }

    async componentDidUpdate(prevProps: Props, prevState: State) {
        const queryString = this.props.location['search'];
        if (queryString != prevState.queryString) {
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
        this.props.setIsAboutPopupVisible(false);
        this.props.setIsSearchFormVisible(false);
    };

    render() {
        const searchTerm = (new URLSearchParams(this.state.queryString)).get('searchTerm');

        return (
            <div>
                <SideBar />
                <Authorization />
                <div className={styles.container} onClick={this.onClick}>
                    {searchTerm && <h2 className={styles.searchResultsHeader}>{`${this.state.tils.length} post${this.state.tils.length != 1 ? 's' : ''} about ${searchTerm}`}</h2>}
                    <TilsList tils={this.state.tils} />
                </div>
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => ({
    setIsSearchFormVisible: (isSearchFormVisible: boolean) => dispatch(setIsSearchFormVisible(isSearchFormVisible)),
    setIsAboutPopupVisible: (isAboutPopupVisible: boolean) => dispatch(setIsAboutPopupVisible(isAboutPopupVisible))
});

export default connect(null, mapDispatchToProps)(MainContainer);



