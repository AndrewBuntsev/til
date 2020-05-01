import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from './TilArticle.module.css';
import { Til } from '../../../types/Til';
import Button from '../../controls/Button/Button';
import { AppState } from '../../../types/AppState';
import { connect } from 'react-redux';
import { User } from '../../../types/User';



type Props = {
    til: Til,
    user: User;
};
type State = {
    redirect: string;
};

class TilArticle extends Component<Props, State> {

    state = {
        redirect: null
    };

    componentDidMount() {
        window['hljs'].initHighlighting();
    }

    componentDidUpdate() {
        window['hljs'].initHighlighting();
    }

    onEditClick = () => {
        this.setState({ redirect: `/editArticle?articleId=${this.props.til._id}` });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className={styles.container}>

                <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.props.til.text }} />

                <div className={styles.buttons}>
                    <Button title='Tweet' onClick={() => { }} />
                    {this.props.user && this.props.user._id == this.props.til.userId && <Button title='Edit' onClick={this.onEditClick} />}
                </div>

                <div className={styles.signature}>

                </div>

                <aside className={styles.aside}></aside>
            </div>
        );
    }
}



const mapStateToProps = (state: AppState) => ({
    user: state.user
});


export default connect(mapStateToProps)(TilArticle);