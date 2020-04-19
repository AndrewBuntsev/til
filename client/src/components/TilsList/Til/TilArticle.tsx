import React, { Component } from 'react';
import styles from './TilArticle.module.css';
import { Til } from '../../../types/Til';



type Props = {
    til: Til
};
type State = {};

export default class TilArticle extends Component<Props, State> {

    state = {};


    render() {
        return (
            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.header}>
                        <a>
                            {this.props.til.header}
                        </a>
                    </h1>

                    <p>{this.props.til.text}</p>
                </div>
                <aside className={styles.aside}></aside>
            </div>
        );
    }
}



