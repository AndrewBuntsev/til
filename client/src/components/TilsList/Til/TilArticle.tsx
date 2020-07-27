import React, { Component } from 'react';
import { Redirect, NavLink } from 'react-router-dom';

import styles from './TilArticle.module.css';
import { Til } from '../../../types/Til';
import Button from '../../controls/Button/Button';
import { AppState } from '../../../types/AppState';
import { connect } from 'react-redux';
import { User } from '../../../types/User';
import Heart from './Heart/Heart';
import { THIS_URL } from '../../../const/settings';



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


    componentDidUpdate(prevProps: Props, prevState: State) {
        if (prevState.isRaw && !this.state.isRaw) {
            document.querySelectorAll('pre code').forEach((block) => {
                window['hljs'].highlightBlock(block);
            });
        }

        if (!prevState.isRaw && this.state.isRaw) {
            this.rawTextRef.current.style.height = this.rawTextRef.current.scrollHeight + 'px';
        }
    }

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        const shouldUpdate = nextState.redirect != this.state.redirect
            || nextState.isRaw != this.state.isRaw
            || JSON.stringify(nextProps.til) != JSON.stringify(this.props.til)
            || (nextProps.user && !this.props.user)
            || (this.props.user && !nextProps.user)
            || (nextProps.user
                && this.props.user
                && nextProps.user.likedTils != this.props.user.likedTils
                && ((this.includesThisTil(nextProps.user.likedTils) && !this.includesThisTil(this.props.user.likedTils)) || (!this.includesThisTil(nextProps.user.likedTils) && this.includesThisTil(this.props.user.likedTils))));

        return shouldUpdate;
    }

    includesThisTil = (likedTils: string) => likedTils && likedTils.includes(`,${this.props.til.id},`);

    onEditClick = () => {
        this.setState({ redirect: `/editArticle?articleId=${this.props.til.id}` });
    };

    onRawClick = () => {
        this.setState(state => ({ isRaw: !state.isRaw }))
    };


    rawTextRef = React.createRef<HTMLTextAreaElement>();

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        const foundTitleMatch = this.props.til.text.match(/(?<=<h2>)(.|\n)*?(?=<\/h2>)/i);
        const title = foundTitleMatch && foundTitleMatch[0] ? foundTitleMatch[0] : this.props.til.text.substring(0, 25);

        return (
            <div className={styles.container}>

                {this.state.isRaw ?
                    <textarea
                        ref={this.rawTextRef}
                        value={this.props.til.text.replace(/&nbsp;/g, ' ')}
                        readOnly={true} />

                    : <div className={styles.content} dangerouslySetInnerHTML={{ __html: this.props.til.text }} />}

                <div className={styles.buttons}>
                    <a href={`https://twitter.com/intent/tweet?hashtags=${this.props.til.tag}&ref_src=twsrc%5Etfw&related=twitterapi%2Ctwitter&text=${title}&url=${THIS_URL}/posts?id=${this.props.til.id}&via=TodayIL38903307`} target='_blank'>
                        <Button icon={require('./../../../assets/images/twitter-16-white.png')} title='Tweet' />
                    </a>
                    {this.props.user
                        && this.props.user.id == this.props.til.userId
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
                    <NavLink to={`/posts?id=${this.props.til.id}`} className={`${styles.asideItem} ${styles.asideItemPermalink}`}>permalink</NavLink>
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