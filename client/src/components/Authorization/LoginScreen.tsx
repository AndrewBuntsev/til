import React, { Component } from 'react';

import styles from './LoginScreen.module.css';
import { AppState } from '../../types/AppState';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import setUser from '../../redux/actions/setUser';
import { connect } from 'react-redux';
import { GH_APP_ID, THIS_URL } from '../../const/settings';


type Props = {
    user: User;
    setUser(user: User): void;
};
type State = {};

class LoginScreen extends Component<Props, State> {

    render() {
        return (
            <div className={styles.container}>
                <div className={styles.loginContainer}>
                    <a href={`https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=86v6z3n8v3ybvo&redirect_uri=${THIS_URL}/liAuth&scope=r_liteprofile`}>
                        <img src={require('./../../assets/images/liLogin.png')} />
                    </a>

                    <a href={`https://github.com/login/oauth/authorize?scope=user:email&client_id=${GH_APP_ID}`}>
                        <img src={require('./../../assets/images/ghLogin.png')} />
                    </a>
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
