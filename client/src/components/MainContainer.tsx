import React, { Component } from 'react';

import * as api from '../api';
import { ApiResponse } from '../types/ApiResponse';
import SideBar from './SideBar/SideBar';
import TilsList from './TilsList/TilsList';
import { Til } from '../types/Til';
import getTypeFromObject from '../helpers/getTypeFromObject';
import Authorization from './Authorization/Authorization';



type Props = {
    location: any;
};
type State = {
    tils: Array<Til>;
};

export default class MainContainer extends Component<Props, State> {
    state = {
        tils: []
    };

    async componentDidMount() {
        const response: ApiResponse = await api.getTils();
        this.setState({ tils: getTypeFromObject<Array<Til>>(response.payload) });
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



