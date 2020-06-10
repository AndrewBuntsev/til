import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './Statistics.module.css';


type Props = {
    title: string;
    data: string;
    link: string;
};


export default class StatisticsGridRow extends Component<Props> {
    render() {

        return (
            <NavLink to={this.props.link} className={styles.statisticsGridRow}>
                <span className={styles.statisticsGridRowTitle}>{this.props.title}</span>
                <span className={styles.statisticsGridRowData}><small>{this.props.data}</small></span>
            </NavLink>
        );
    }
}

