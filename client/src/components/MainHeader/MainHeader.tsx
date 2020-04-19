import React, { Component } from 'react';

import styles from './MainHeader.module.css';


type Props = {};
type State = {};

export default class MainHeader extends Component<Props, State> {
    render() {
        return (
            <div className={styles.container}>
                <a className={styles.header} href='/'>Today I Learned</a>
            </div>
        );
    }
}



