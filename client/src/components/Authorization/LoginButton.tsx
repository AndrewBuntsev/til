import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Authorization.module.css';

type Props = {};
type State = {};

export default class LoginButton extends Component<Props, State> {
    render() {
        return (
            <div className={styles.login}>
                <NavLink to="/login" className={styles.login}>
                    LOGIN
                </NavLink>
            </div>
        );
    }
}

