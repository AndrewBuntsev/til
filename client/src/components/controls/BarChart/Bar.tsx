import React, { Component } from 'react';
import styles from './BarChart.module.css';



type Props = {
    _key: string;
    value: number;
    height: number;
    className: string;
    onClick: () => void;
};
type State = {};



export default class Bar extends Component<Props, State> {

    state = {};

    render() {

        return (
            <div className={styles.barContainer} onClick={this.props.onClick}>
                <div className={styles.text}>{this.props._key}</div>
                <div className={styles.bar}>
                    <div className={this.props.className} style={{ height: `${this.props.height}%` }}></div>
                </div>
                <div className={styles.text}>{`${this.props.value} posts`}</div>
            </div>

        );
    }
}



