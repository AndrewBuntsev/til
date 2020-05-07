import React, { Component } from 'react';
import styles from './Modal.module.css';



type Props = {
    children: any;
};
type State = {};

export default class Modal extends Component<Props, State> {
    render() {
        return (
            <div className={styles.background} >
                <div className={styles.container} onClick={e => e.stopPropagation()}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}



