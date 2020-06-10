import React, { Component } from 'react';
import styles from './Statistics.module.css';
import StatisticsGridRow from './StatisticsGridRow';


type Props = {
    title: string;
    data: Array<{ title: string, data: string, link: string }>;
};

export default class StatisticsGrid extends Component<Props> {
    render() {

        return (
            <div className={styles.statisticsGrid}>
                <h3>{this.props.title}</h3>
                <div>
                    {this.props.data.map((row, index) => <StatisticsGridRow title={row.title} data={row.data} key={index} link={row.link} />)}
                </div>
            </div>
        );
    }
}

