import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';

import styles from './TilArticle.module.css';
import { Til } from '../../../types/Til';
import Button from '../../controls/Button/Button';
import { AppState } from '../../../types/AppState';
import { connect } from 'react-redux';
import { User } from '../../../types/User';
import Heart from './Heart/Heart';



type Props = {
    til: Til;
    user: User;
};
type State = {
    redirect: string;
    isRaw: boolean;
};

class TilArticle extends Component<Props, State> {

    state = {
        redirect: null,
        isRaw: false
    };

    componentDidMount() {
        document.querySelectorAll('pre code').forEach((block) => {
            window['hljs'].highlightBlock(block);
        });
    }

    componentDidUpdate() {
        document.querySelectorAll('pre code').forEach((block) => {
            window['hljs'].highlightBlock(block);
        });
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return nextState.redirect != this.state.redirect
            || nextState.isRaw != this.state.isRaw
            || JSON.stringify(nextProps.til) != JSON.stringify(this.props.til)
            || (nextProps.user && !this.props.user)
            || (this.props.user && !nextProps.user)
            || (nextProps.user
                && this.props.user
                && nextProps.user.likedTils != this.props.user.likedTils
                && ((this.includesThisTil(nextProps.user.likedTils) && !this.includesThisTil(this.props.user.likedTils)) || (!this.includesThisTil(nextProps.user.likedTils) && this.includesThisTil(this.props.user.likedTils))));
    }

    includesThisTil = (likedTils: string) => likedTils && likedTils.includes(`${this.props.til._id},`);

    onEditClick = () => {
        this.setState({ redirect: `/editArticle?articleId=${this.props.til._id}` });
    };

    onRawClick = () => {
        this.setState(state => ({ isRaw: !state.isRaw }))
    };


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className={styles.container}>

                {this.state.isRaw ?
                    <div className={styles.content}>{this.props.til.text}</div>
                    : <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.props.til.text }} />}

                <div className={styles.buttons}>
                    <a href="https://twitter.com/intent/tweet?hashtags=git&original_referer=https%3A%2F%2Ftil.hashrocket.com%2Fposts%2F40xglnjqnt-git-checkout-in-patches-&ref_src=twsrc%5Etfw&text=Today%20I%20learned%3A%20Git%20Checkout%20in%20Patches%20&tw_p=tweetbutton&url=http%3A%2F%2Ftil.hashrocket.com%2Fposts%2F40xglnjqnt-git-checkout-in-patches-&via=jwworth">
                        <Button icon={require('./../../../assets/images/twitter-16-white.png')} title='Tweet' />
                    </a>
                    {this.props.user
                        && this.props.user._id == this.props.til.userId
                        && <Button icon={require('./../../../assets/images/edit-16-white.png')} title='Edit' onClick={this.onEditClick} />}
                </div>

                <div className={styles.signature}>
                    <NavLink to={`/posts?author=${this.props.til.userId}`} className={styles.userName}>{this.props.til.userName}</NavLink>
                    <NavLink to={`/posts?date=${this.props.til.date}`} className={styles.date}>
                        {this.props.til.date}
                    </NavLink>
                </div>


                <aside className={styles.aside}>
                    <NavLink to={`/posts?tag=${this.props.til.tag}`} className={`${styles.asideItem} ${styles.asideItemTag}`}>#{this.props.til.tag}</NavLink>
                    <NavLink to={`/posts?id=${this.props.til._id}`} className={`${styles.asideItem} ${styles.asideItemPermalink}`}>permalink</NavLink>
                    <span onClick={this.onRawClick} className={`${styles.asideItem} ${styles.asideItemRaw}`}>Raw</span>
                    <div className={`${styles.asideItem} ${styles.asideItemLikes}`}>
                        <Heart til={this.props.til} />
                    </div>
                </aside>
            </div>
        );
    }
}



const mapStateToProps = (state: AppState) => ({
    user: state.user
});


export default connect(mapStateToProps)(TilArticle);