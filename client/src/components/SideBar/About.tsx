import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from './SideBar.module.css';
import SideBarItem from './SideBarItem';
import { TWITTER_LINK, GITHUB_LINK } from '../../const/settings';
import { AppState } from '../../types/AppState';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import setIsAboutPopupVisible from '../../redux/actions/setIsAboutPopupVisible';


const IMG = require('./../../assets/images/question.png');
const IMG_HOVER = require('./../../assets/images/question_over.png');
const IMG_TWITTER_DARK = require('./../../assets/images/twitter-32-dark.png');
const IMG_TWITTER_BLUE = require('./../../assets/images/twitter-32-blue.png');
const IMG_GITHUB_DARK = require('./../../assets/images/github-32-dark.png');
const IMG_GITHUB_BLUE = require('./../../assets/images/github-32-blue.png');

type Props = {
    isAboutPopupVisible: boolean;
    setIsAboutPopupVisible: (isSearchFormVisible: boolean) => void;
};
type State = {
    redirect: string;
};

class About extends Component<Props, State> {
    state = {
        redirect: null
    };

    togglePopupVisibility = () => {
        this.props.setIsAboutPopupVisible(!this.props.isAboutPopupVisible);
    };

    onKeyDown = e => {
        if (e.key == 'Escape') {
            this.props.setIsAboutPopupVisible(false);
        }
    };

    twitterImgRef = React.createRef<HTMLImageElement>();
    onTwitterLinkImgMouseOver = (e) => {
        this.twitterImgRef.current.src = IMG_TWITTER_BLUE;
    };
    onTwitterLinkImgMouseOut = (e) => {
        this.twitterImgRef.current.src = IMG_TWITTER_DARK;
    };

    githubImgRef = React.createRef<HTMLImageElement>();
    onGithubLinkImgMouseOver = (e) => {
        this.githubImgRef.current.src = IMG_GITHUB_BLUE;
    };
    onGithubLinkImgMouseOut = (e) => {
        this.githubImgRef.current.src = IMG_GITHUB_DARK;
    };



    render() {
        return (
            <div className={styles.aboutContainer}>
                <SideBarItem
                    img={this.props.isAboutPopupVisible ? IMG_HOVER : IMG}
                    imgHover={IMG_HOVER}
                    onClick={this.togglePopupVisibility} />
                {this.props.isAboutPopupVisible && (
                    <div className={styles.aboutPopup}>
                        <div className={styles.aboutText}>
                            Today I Learned is an open-source project that exists to catalogue the sharing & accumulation of knowledge as it happens day-to-day.
                            Posts have a 200-word limit, and posting is open to anyone who is interested to share their learning process.
                            We hope you enjoy learning along with us.
                        </div>
                        <div className={styles.aboutLinksPanel}>
                            <a href={TWITTER_LINK} target='_blank' rel='noopener noreferrer' className={styles.linkContainer}>
                                <img ref={this.twitterImgRef} src={IMG_TWITTER_DARK} onMouseOver={this.onTwitterLinkImgMouseOver} onMouseOut={this.onTwitterLinkImgMouseOut} />
                                <span className={styles.aboutLinkText} onMouseOver={this.onTwitterLinkImgMouseOver} onMouseOut={this.onTwitterLinkImgMouseOut}>/TodayIL38903307</span>
                            </a>
                            <a href={GITHUB_LINK} target='_blank' rel='noopener noreferrer' className={styles.linkContainer}>
                                <img ref={this.githubImgRef} src={IMG_GITHUB_DARK} onMouseOver={this.onGithubLinkImgMouseOver} onMouseOut={this.onGithubLinkImgMouseOut} />
                                <span className={styles.aboutLinkText} onMouseOver={this.onGithubLinkImgMouseOver} onMouseOut={this.onGithubLinkImgMouseOut}>/AndrewBuntsev/til</span>
                            </a>
                        </div>
                    </div>
                )}

                {this.state.redirect && <Redirect to={this.state.redirect} />}
            </div>
        );
    }
}



const mapStateToProps = (state: AppState) => ({
    isAboutPopupVisible: state.isAboutPopupVisible
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setIsAboutPopupVisible: (isAboutPopupVisible: boolean) => dispatch(setIsAboutPopupVisible(isAboutPopupVisible))
});

export default connect(mapStateToProps, mapDispatchToProps)(About);