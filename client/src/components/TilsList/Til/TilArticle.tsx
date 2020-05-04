import React, { Component, PureComponent } from 'react';
import { Redirect, NavLink } from 'react-router-dom';

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

class TilArticle extends PureComponent<Props, State> {

    state = {
        redirect: null
    };

    componentDidMount() {
        document.querySelectorAll('pre code').forEach((block) => {
            window['hljs'].highlightBlock(block);
        });
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
                    <a href="https://twitter.com/intent/tweet?hashtags=git&original_referer=https%3A%2F%2Ftil.hashrocket.com%2Fposts%2F40xglnjqnt-git-checkout-in-patches-&ref_src=twsrc%5Etfw&text=Today%20I%20learned%3A%20Git%20Checkout%20in%20Patches%20&tw_p=tweetbutton&url=http%3A%2F%2Ftil.hashrocket.com%2Fposts%2F40xglnjqnt-git-checkout-in-patches-&via=jwworth">
                        <Button icon={require('./../../../assets/images/twitter-16-white.png')} title='Tweet' />
                    </a>
                    {this.props.user
                        && this.props.user._id == this.props.til.userId
                        && <Button icon={require('./../../../assets/images/edit-16-white.png')} title='Edit' onClick={this.onEditClick} />}
                </div>

                <div className={styles.signature}>
                    <NavLink to={`/authors?author=${this.props.til.userId}`} className={styles.userName}>{this.props.til.userName}</NavLink>
                    <NavLink to={`/dates?date=${this.props.til.date}`} className={styles.date}>
                        {this.props.til.date}
                    </NavLink>
                </div>

                <aside className={styles.aside}>
                    <NavLink to={`/posts?post=${this.props.til._id}`} className={styles.userName}>permalink</NavLink>
                </aside>
            </div>
        );
    }
}



const mapStateToProps = (state: AppState) => ({
    user: state.user
});


export default connect(mapStateToProps)(TilArticle);