import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './SideBar.module.css';




type Props = {};
type State = {};

export default class SideBar extends Component<Props, State> {

    state = {
        // header: '',
        // text: '',
        // user: ''
    };


    render() {
        return (
            <div className={styles.container}>
                <NavLink to="/addArticle" activeClassName={styles.header}>
                    +
                </NavLink>
            </div>
        );
    }
}



