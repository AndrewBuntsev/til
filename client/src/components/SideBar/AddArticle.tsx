import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './SideBar.module.css';


type Props = {};
type State = {};

export default class AddArticle extends Component<Props, State> {


    render() {
        return (
            <NavLink to="/editArticle">
                <div className={styles.addContainer} />
            </NavLink>

        );
    }
}



