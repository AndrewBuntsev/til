import React, { Component } from 'react';

import * as api from '../api';
import { ApiResponse } from '../types/ApiResponse';
import SideBar from './SideBar/SideBar';
import TilsList from './TilsList/TilsList';
import { Til } from '../types/Til';
import getTypeFromObject from '../helpers/getTypeFromObject';
import Authorization from './Authorization/Authorization';
import { ResponseStatus } from '../enums/ResponseStatus';



type Props = {
    location: any;
};
type State = {
    tils: Array<Til>;
    params: string;
};

export default class MainContainer extends Component<Props, State> {
    state = {
        tils: [],
        params: '[]'
    };

    async componentDidMount() {
        const params = new URLSearchParams(window.location.search);

        const response: ApiResponse = await api.getTils({
            _id: params.get('post') ?? '',
            author: params.get('author') ?? '',
            date: params.get('date') ?? ''
        });

        if (response.status == ResponseStatus.SUCCESS && response.payload) {
            this.setState({
                tils: getTypeFromObject<Array<Til>>(response.payload),
                params: JSON.stringify(Array.from(params.entries()))
            });
        }
    }



    render() {
        return (
            <div>
                <SideBar />
                <Authorization />
                <TilsList tils={this.state.tils} />
            </div>
        );
    }
}



