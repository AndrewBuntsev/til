import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './MainHeader.module.css';
import { TWITTER_LINK } from '../../const/settings';


type Props = {};
type State = {};

export default class MainHeader extends Component<Props, State> {
    render() {
        return (
            <div className={styles.container}>
                <div className={styles.subContainer}>
                    <NavLink to="/" activeClassName={styles.header}>
                        Today I Learned
                    </NavLink>
                    <a href={TWITTER_LINK}
                        title='Twitter'
                        target='_blank'
                        rel='noopener noreferrer'
                        className={styles.subHeaderContainer}>
                        <img src={require('./../../assets/images/twitter-16.png')} className={styles.twitterImage} />
                        <span
                            className={styles.twitterHeader}>
                            FOLLOW ON TWITTER
                        </span>
                    </a>

                </div>
            </div>
        );
    }
}



