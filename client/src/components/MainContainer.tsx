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



type Props = {
    location: object;
};
type State = {
    tils: Array<Til>;
    queryString: string;
};

const getId = (() => { let i = 0; return () => i++; })();

export default class MainContainer extends Component<Props, State> {
    state = {
        tils: [],
        queryString: null
    };


    async componentDidMount() {
        this.setState({ queryString: '' });
        console.log('componentDidMount ' + getId());
    }

    async componentDidUpdate(prevProps: Props, prevState: State) {
        console.log('componentDidUpdate ' + getId());
        const queryString = this.props.location['search'];
        if (queryString != prevState.queryString) {
            const params = new URLSearchParams(queryString);
            const response: ApiResponse = await api.getTils({
                _id: params.get('post') ?? '',
                author: params.get('author') ?? '',
                date: params.get('date') ?? '',
                searchTerm: params.get('searchTerm') ?? ''
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

    render() {
        console.log('render ' + getId());

        const searchTerm = (new URLSearchParams(this.state.queryString)).get('searchTerm');

        return (
            <div>
                <SideBar />
                <Authorization />
                <div className={styles.container}>
                    {searchTerm && <h2 className={styles.searchResultsHeader}>{`${this.state.tils.length} post${this.state.tils.length != 1 ? 's' : ''} about ${searchTerm}`}</h2>}
                    <TilsList tils={this.state.tils} />
                </div>

            </div>
        );
    }
}



