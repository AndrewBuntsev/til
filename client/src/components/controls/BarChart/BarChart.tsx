import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from './BarChart.module.css';
import Bar from './Bar';



type Props = {
    data: Map<string, number>;
};
type State = {
    redirect: string;
};

const MAX_HEIGHT_PERCENT = 100;

export default class BarChart extends Component<Props, State> {

    state = {
        redirect: null
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const { data } = this.props;
        if (!data) return null;


        const values = Array.from(data.values());
        const maxValue = Math.max(...values);
        const minValue = Math.min(...values);
        const maxHeight = maxValue - minValue;
        const minHeightPercent = Math.floor(MAX_HEIGHT_PERCENT / maxHeight);

        const bars = Array.from(data.entries()).map((barData, index) =>
            <Bar
                key={barData[0]}
                _key={barData[0]}
                value={barData[1]}
                height={barData[1] * minHeightPercent}
                onClick={() => this.setState({ redirect: `/posts?date=${barData[0]}` })}
                className={index % 2 == 0 ? styles.even : styles.odd} />);

        return (
            <div className={styles.container}>
                <h3>Last 30 days</h3>
                <div className={styles.barsContainer}>
                    {bars}
                </div>
            </div>
        );
    }
}



