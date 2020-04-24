import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './MainHeader.module.css';


type Props = {};
type State = {};

export default class MainHeader extends Component<Props, State> {
    render() {
        return (
            <div className={styles.container}>
                <NavLink to="/" activeClassName={styles.header}>
                    Today I Learned
                </NavLink>
            </div>
        );
    }
}



