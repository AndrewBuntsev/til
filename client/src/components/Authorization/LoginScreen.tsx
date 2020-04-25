import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import MainHeader from '../MainHeader/MainHeader';
import styles from './LoginScreen.module.css';
import { AppState } from '../../types/AppState';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import setUser from '../../redux/actions/setUser';
import { connect } from 'react-redux';
import { ApiResponse } from '../../types/ApiResponse';
import * as api from './../../api';
import { ResponseStatus } from '../../enums/ResponseStatus';
import getTypeFromObject from '../../helpers/getTypeFromObject';
import { setFBUserId, setGHUserId, setGHAccessToken, setFBAccessToken } from '../../helpers/cookiesHelper';
import { GH_APP_ID } from '../../const/settings';





type Props = {
    user: User;
    setUser(user: User): void;
};
type State = {
    redirect: string;
};

class LoginScreen extends Component<Props, State> {

    state = { redirect: null };

    loginWithFacebook = () => {
        const that = this;


        window['FB'].login(function (response) {
            const { userID, accessToken } = response.authResponse;
            if (userID && accessToken) {
                (async function () {
                    const resp: ApiResponse = await api.getUser({ fbId: userID });
                    let user: User;
                    if (resp.status == ResponseStatus.SUCCESS) {
                        if (resp.payload) {
                            user = getTypeFromObject<User>(resp.payload);
                        } else {
                            const addUserResp: ApiResponse = await api.addUser({ fbId: userID.toString() });
                            if (addUserResp.status == ResponseStatus.SUCCESS) {
                                if (addUserResp.payload) {
                                    user = getTypeFromObject<User>(addUserResp.payload);
                                }
                            }
                        }
                    }

                    const fbUserRes: ApiResponse = await api.getFBUser(userID, accessToken);
                    if (fbUserRes.status == ResponseStatus.SUCCESS && fbUserRes.payload) {
                        user.name = fbUserRes.payload['name'];
                        user.pictureUrl = fbUserRes.payload['avatar_url'];
                    }

                    that.props.setUser(user);
                    setFBUserId(userID);
                    setFBAccessToken(accessToken);
                    setGHUserId('');
                    setGHAccessToken('');
                    that.setState({ redirect: '/' });
                })();

            }
        });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        return (
            <div className={styles.container}>
                <MainHeader />
                <div className={styles.loginContainer}>
                    <img src={require('./../../assets/images/loginWithFacebook.png')} width={250} onClick={this.loginWithFacebook} />
                    <a href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${GH_APP_ID}`}>Login with GitHub</a>
                    <br />
                    <a href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86v6z3n8v3ybvo&redirect_uri=https%3A%2F%2Flocalhost:3000/liAuth&scope=r_liteprofile`}>Login with LinkedIn</a>
                </div>

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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
