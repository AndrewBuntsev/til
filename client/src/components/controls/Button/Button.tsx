import React, { Component } from 'react';
import styles from './Button.module.css';



type Props = {
    title: string;
    onClick(): void;
};
type State = {};

export default class Button extends Component<Props, State> {

    state = {};

    render() {
        return (
            <div className={styles.container} onClick={this.props.onClick}>
                <span className={styles.text}>{this.props.title}</span>
            </div>
        );
    }
}



