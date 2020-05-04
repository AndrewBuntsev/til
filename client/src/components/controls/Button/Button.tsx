import React, { Component } from 'react';
import styles from './Button.module.css';



type Props = {
    icon?: any;
    title: string;
    onClick?(): void;
};
type State = {};

export default class Button extends Component<Props, State> {

    state = {};

    render() {
        return (
            <div className={styles.container} onClick={this.props.onClick}>
                <img src={this.props.icon} />
                <span className={styles.text}>{this.props.title}</span>
            </div>
        );
    }
}



