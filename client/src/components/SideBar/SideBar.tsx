import React, { Component } from 'react';

import styles from './SideBar.module.css';
import SearchArticle from './SearchArticle';
import AddArticle from './AddArticle';


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
                <AddArticle />
                <SearchArticle />
            </div>
        );
    }
}



