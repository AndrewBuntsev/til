import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './TilArticle.module.css';
import { Til } from '../../../types/Til';
import Button from '../../controls/Button/Button';



type Props = {
    til: Til
};
type State = {};

export default class TilArticle extends Component<Props, State> {

    state = {};

    componentDidMount() {
        window['hljs'].initHighlighting();
    }

    componentDidUpdate() {
        window['hljs'].initHighlighting();
    }

    render() {
        return (
            <div className={styles.container}>

                <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.props.til.text }} />

                <div className={styles.buttons}>
                    <Button title='Tweet' onClick={() => { }} />
                    <NavLink to={`/editArticle?articleId=${this.props.til._id}`} className={styles.editButtonContainer}>
                        {/* TODO: rewrito redirect */}
                        <Button title='Edit' onClick={() => { }} />
                    </NavLink>

                </div>

                <div className={styles.signature}>

                </div>

                <aside className={styles.aside}></aside>
            </div>
        );
    }
}



