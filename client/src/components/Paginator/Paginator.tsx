import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';

import styles from './Paginator.module.css';


type Props = {
    page: number;
};
type State = {
    redirect: string;
};

export default class Paginator extends Component<Props, State> {

    state = {
        redirect: null,
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className={styles.container}>
                {this.props.page > 1 &&
                    <NavLink to={`/posts?page=${this.props.page - 1}`} className={styles.button}>newer tils</NavLink>}

                <NavLink to={`/posts?page=${this.props.page + 1}`} className={styles.button}>older tils</NavLink>
            </div>
        );
    }
}

