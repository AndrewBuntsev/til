import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Authorization.module.css';
import { AppState } from '../../types/AppState';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import setUser from '../../redux/actions/setUser';
import { connect } from 'react-redux';




type Props = {
    user: User;
    setUser(user: User): void;
};
type State = {};

class Login extends Component<Props, State> {
    render() {
        return (
            <div className={styles.login}>
                <NavLink to="/login" activeClassName="active">
                    LOGIN
                </NavLink>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
