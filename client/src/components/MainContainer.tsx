import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as api from '../api';
import dispatchCombinedAction from '../redux/actions/dispatchCombinedAction';
import { Response } from '../types/Response';
import { ResponseStatus } from '../enums/ResponseStatus';
import { AppState } from '../types/AppState';
import { Action } from '../redux/Action';
import { ActionType } from '../redux/ActionType';
import styles from './MainContainer.module.css';
import MainHeader from './MainHeader/MainHeader';
import SideBar from './SideBar/SideBar';
import TilsList from './TilsList/TilsList';
import { Til } from '../types/Til';
import getTypeFromObject from '../helpers/getTypeFromObject';



type Props = {};
type State = {
    tils: Array<Til>;
};

class MainContainer extends Component<Props, State> {

    state = {
        tils: []
    };

    // addTil = async () => {
    //     this.setState({
    //         header: '',
    //         text: '',
    //         user: ''
    //     });
    //     await api.addTil({ header: this.state.header, text: this.state.text, user: this.state.user });
    // };

    async componentDidMount() {
        //const response: Response = await api.addTil(this.props.clientDetails.clientId, { clientId, clientName });
        const response: Response = await api.getTils();
        this.setState({ tils: getTypeFromObject<Array<Til>>(response.payload) });
        //console.log(response.payload);
    }

    render() {
        return (
            <div className={styles.container}>
                <MainHeader />
                <SideBar />
                <TilsList tils={this.state.tils} />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);


