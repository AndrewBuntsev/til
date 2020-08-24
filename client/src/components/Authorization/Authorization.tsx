import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import styles from './Authorization.module.css';
import { AppState } from '../../types/AppState';
import setUser from '../../redux/actions/setUser';
import { User } from '../../types/User';
import { getGHUserId, getGHAccessToken, getLIUserId, getLIAccessToken, getCogUserId, getCogAccessToken, getCogRefreshToken } from '../../helpers/cookiesHelper';
import * as api from '../../api';
import { ApiResponse } from '../../types/ApiResponse';
import { ResponseStatus } from '../../enums/ResponseStatus';
import getTypeFromObject from '../../helpers/getTypeFromObject';
import Login from './LoginButton';
import LoggedInUser from './LoggedInUser';



type Props = {
    user: User;
    setUser(user: User): void;
};
type State = {
    redirect: string;
};

class Authorization extends Component<Props, State> {

    state = { redirect: null };

    componentDidMount() {
        this.initGitHub();
        this.initLinkedIn();
        this.initCognito();
    }



    initGitHub = async () => {

        //Check if the user has already logged in with GitHub
        const ghId = getGHUserId();
        const access_token = getGHAccessToken();

        if (ghId && access_token) {
            const resp: ApiResponse = await api.ghAuth({ access_token });
            if (resp.status == ResponseStatus.SUCCESS && resp.payload && resp.payload['ghId'] == ghId) {
                const user: User = getTypeFromObject<User>(resp.payload);
                this.props.setUser(user);
            }
        }
    };

    initLinkedIn = async () => {

        //Check if the user has already logged in with LinkedIn
        const liId = getLIUserId();
        const access_token = getLIAccessToken();

        if (liId && access_token) {
            const resp: ApiResponse = await api.liAuth({ access_token });
            if (resp.status == ResponseStatus.SUCCESS && resp.payload && resp.payload['liId'] == liId) {
                const user: User = getTypeFromObject<User>(resp.payload);
                this.props.setUser(user);
            }
        }
    };

    initCognito = async () => {

        //Check if the user has already logged in with Cognito
        const cogId = getCogUserId();
        const access_token = getCogAccessToken();
        const refresh_token = getCogRefreshToken();

        if (cogId && access_token && refresh_token) {
            const resp: ApiResponse = await api.cogAuth({ access_token, refresh_token });
            if (resp.status == ResponseStatus.SUCCESS && resp.payload && resp.payload['cogId'] == cogId) {
                const user: User = getTypeFromObject<User>(resp.payload);
                this.props.setUser(user);
            }
        }
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className={styles.container}>
                {this.props.user ? <LoggedInUser /> : <Login />}
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setUser: (user: User) => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Authorization);


