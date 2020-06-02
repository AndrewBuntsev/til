import React, { Component } from 'react';
import styles from './Statistics.module.css';


type Props = {
    title: string;
    data: string;
};


export default class StatisticsGridRow extends Component<Props> {
    render() {

        return (
            <div className={styles.statisticsGridRow}>
                <span className={styles.statisticsGridRowTitle}>{this.props.title}</span>
                <span className={styles.statisticsGridRowData}><small>{this.props.data}</small></span>
            </div>
        );
    }
}

