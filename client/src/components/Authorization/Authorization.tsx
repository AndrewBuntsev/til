import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import styles from './Authorization.module.css';
import { AppState } from '../../types/AppState';
import setUser from '../../redux/actions/setUser';
import { User } from '../../types/User';
import { getFBUserId, setFBUserId, setGHUserId, setGHAccessToken, getGHUserId, getGHAccessToken, getFBAccessToken, setFBAccessToken } from '../../helpers/cookiesHelper';
import * as api from '../../api';
import { ApiResponse } from '../../types/ApiResponse';
import { ResponseStatus } from '../../enums/ResponseStatus';
import getTypeFromObject from '../../helpers/getTypeFromObject';
import Login from './Login';
import { FB_APP_ID, FB_API_VERSION } from '../../const/settings';
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
        this.initFacebook();
        this.checkFBStatus()
        this.initGitHub();
    }

    initFacebook = () => {
        let that = this;
        // load FB API
        //TODO: move to separate file, use event bus
        window['fbAsyncInit'] = function () {
            window['FB'].init({
                appId: FB_APP_ID.toString(),
                cookie: true,
                xfbml: true,
                version: FB_API_VERSION
            });

            window['FB'].AppEvents.logPageView();

            that.checkFBStatus();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) { return; }
            js = d.createElement(s); js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    };

    checkFBStatus = () => {
        if (!window['FB']) return;

        const that = this;

        window['FB'].getLoginStatus(async function (response) {
            if (response.status == 'connected' && getFBUserId() == response.authResponse.userID) {
                //update access_token
                setFBAccessToken(response.authResponse.accessToken);

                const resp: ApiResponse = await api.getUser({ fbId: response.authResponse.userID });
                if (resp.status == ResponseStatus.SUCCESS) {
                    let user: User = getTypeFromObject<User>(resp.payload);
                    const fbUserRes: ApiResponse = await api.getFBUser(getFBUserId(), getFBAccessToken());
                    if (fbUserRes.status == ResponseStatus.SUCCESS && fbUserRes.payload) {
                        user.name = fbUserRes.payload['name'];
                        user.pictureUrl = fbUserRes.payload['avatar_url'];
                    }

                    that.props.setUser(user);
                }
            }
        });
    };

    initGitHub = async () => {

        //TODO: move up
        //Check if the user has already logged in with GitHub
        const ghId = getGHUserId();
        const access_token = getGHAccessToken();
        if (ghId && access_token) {
            const resp: ApiResponse = await api.getGHUserByAccessToken(access_token);
            if (resp.status == ResponseStatus.SUCCESS && resp.payload && resp.payload['id'] == ghId) {
                const resp1: ApiResponse = await api.getUser({ ghId: ghId });
                let user: User;
                if (resp1.status == ResponseStatus.SUCCESS && resp1.payload) {
                    user = getTypeFromObject<User>(resp1.payload);
                    user.name = resp.payload['name'];
                    user.pictureUrl = resp.payload['avatar_url'];
                    this.props.setUser(user);
                    return;
                }
            }
        }


        const code = (new URLSearchParams(window.location.search)).get('code');
        if (code) {
            //Process GitHub request code
            const resp1: ApiResponse = await api.getGHUserByRequestCode(code);
            const ghUser: any = resp1.payload;
            if (ghUser) {
                //Add gh user
                const resp: ApiResponse = await api.getUser({ ghId: ghUser.id });
                let user: User;
                if (resp.status == ResponseStatus.SUCCESS) {
                    if (resp.payload) {
                        user = getTypeFromObject<User>(resp.payload);
                    } else {
                        const addUserResp: ApiResponse = await api.addUser({ ghId: ghUser.id.toString() });
                        if (addUserResp.status == ResponseStatus.SUCCESS) {
                            if (addUserResp.payload) {
                                user = getTypeFromObject<User>(addUserResp.payload);
                            }
                        }
                    }
                }

                user.name = ghUser.name;
                user.pictureUrl = ghUser.avatar_url;
                this.props.setUser(user);
                setFBUserId('');
                setFBAccessToken('');
                setGHUserId(ghUser.id);
                setGHAccessToken(ghUser.access_token);
                //this.setState({ redirect: '/' });
            }
            return;
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


