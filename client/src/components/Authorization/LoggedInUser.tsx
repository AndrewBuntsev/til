import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { AppState } from '../../types/AppState';
import setUser from '../../redux/actions/setUser';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import * as api from '../../api';
import { clearCookies } from '../../helpers/cookiesHelper';
import styles from './Authorization.module.css';
import setIsUserMenuVisible from '../../redux/actions/setIsUserMenuVisible';
import { Action } from '../../redux/Action';
import dispatchCombinedAction from '../../redux/actions/dispatchCombinedAction';
import { ApiResponse } from '../../types/ApiResponse';
import { ResponseStatus } from '../../enums/ResponseStatus';




type Props = {
    user: User;
    setUser(user: User): void;
    isUserMenuVisible: boolean;
    setIsUserMenuVisible: (isUserMenuVisible: boolean) => void;
    dispatchCombinedAction(actions: Array<Action>): Action;
};
type State = {
    redirect: string,
    twUrl?: string;
    liUrl?: string;
    fbUrl?: string;
    wUrl?: string;
    isDirty: boolean;
};

class LoggedInUser extends Component<Props, State> {
    state = {
        redirect: null,
        twUrl: this.props.user.twUrl ?? '',
        liUrl: this.props.user.liUrl ?? '',
        fbUrl: this.props.user.fbUrl ?? '',
        wUrl: this.props.user.wUrl ?? '',
        isDirty: false
    };

    logOut = () => {
        clearCookies();
        this.props.dispatchCombinedAction([setIsUserMenuVisible(false), setUser(null)])
    };

    save = async () => {
        const resp: ApiResponse = await api.updateUser(this.state.twUrl, this.state.liUrl, this.state.fbUrl, this.state.wUrl);
        if (resp.status == ResponseStatus.SUCCESS) {
            const updatedUser: User = JSON.parse(JSON.stringify(this.props.user));
            updatedUser.twUrl = this.state.twUrl;
            updatedUser.liUrl = this.state.liUrl;
            updatedUser.fbUrl = this.state.fbUrl;
            updatedUser.wUrl = this.state.wUrl;
            this.props.setUser(updatedUser);
            this.setState({ isDirty: false });
        }
        else {
            console.error(resp);
        }
    };

    showMyPosts = () => {
        this.hidePopup();
        this.setState({ redirect: `/posts?author=${this.props.user.id}` });
    };

    showLikedPosts = () => {
        this.hidePopup();
        this.setState({ redirect: `/posts?likedBy=${this.props.user.id}` });
    };


    showPopup = () => this.props.setIsUserMenuVisible(true);

    hidePopup = () => {
        this.props.setIsUserMenuVisible(false);
        this.setState({
            twUrl: this.props.user.twUrl ?? '',
            liUrl: this.props.user.liUrl ?? '',
            fbUrl: this.props.user.fbUrl ?? '',
            wUrl: this.props.user.wUrl ?? '',
            isDirty: false
        });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        const user: User = this.props.user;

        return (
            <div>
                <div className={styles.tooltipContainer}>
                    <img src={user.pictureUrl} className={styles.picture} onClick={this.showPopup} />
                    {this.props.isUserMenuVisible && (
                        <div className={styles.tooltip}>
                            <img
                                className={styles.closeButton}
                                src={require('./../../assets/images/x-mark-16.png')}
                                onClick={this.hidePopup} />
                            <span className={styles.name}>{user.name}</span>
                            <span className={styles.loggedin}>Logged via {user.ghId ? 'GitHub' : user.liId ? 'LinkedId' : '???'}</span>

                            {/* Twitter */}
                            <div className={styles.userSettingsInputContainer}>
                                <img className={styles.userSettingsIcon} src={require('./../../assets/images/twitter-16-white.png')} />
                                <input
                                    type='text'
                                    className={styles.userSettingsInput}
                                    value={this.state.twUrl}
                                    placeholder='Twitter URL...'
                                    onChange={e => this.setState({ twUrl: e.target.value, isDirty: true })} />
                            </div>

                            {/* LinkedIn */}
                            <div className={styles.userSettingsInputContainer}>
                                <img className={styles.userSettingsIcon} src={require('./../../assets/images/linkedin-16-white.png')} />
                                <input
                                    type='text'
                                    className={styles.userSettingsInput}
                                    value={this.state.liUrl}
                                    placeholder='LinkedIn URL...'
                                    onChange={e => this.setState({ liUrl: e.target.value, isDirty: true })} />
                            </div>

                            {/* FaceBook */}
                            <div className={styles.userSettingsInputContainer}>
                                <img className={styles.userSettingsIcon} src={require('./../../assets/images/facebook-16-white.png')} />
                                <input
                                    type='text'
                                    className={styles.userSettingsInput}
                                    value={this.state.fbUrl}
                                    placeholder='Facebook URL...'
                                    onChange={e => this.setState({ fbUrl: e.target.value, isDirty: true })} />
                            </div>

                            {/* Website */}
                            <div className={styles.userSettingsInputContainer}>
                                <img className={styles.userSettingsIcon} src={require('./../../assets/images/website-16-white.png')} />
                                <input
                                    type='text'
                                    className={styles.userSettingsInput}
                                    value={this.state.wUrl}
                                    placeholder='Personal website URL...'
                                    onChange={e => this.setState({ wUrl: e.target.value, isDirty: true })} />
                            </div>

                            {/* My Posts */}
                            <span className={styles.userSettingsLink} onClick={this.showMyPosts}>My Posts</span>

                            {/* ❤ Posts */}
                            <span className={styles.userSettingsLink} onClick={this.showLikedPosts}>My ❤ Posts</span>


                            <div className={styles.bottomPanelContainer}>
                                {this.state.isDirty && <span className={styles.save} onClick={this.save}>Update</span>}
                                <span className={styles.logout} onClick={this.logOut}>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    user: state.user,
    isUserMenuVisible: state.isUserMenuVisible
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setUser: (user: User) => dispatch(setUser(user)),
    setIsUserMenuVisible: (isUserMenuVisible: boolean) => dispatch(setIsUserMenuVisible(isUserMenuVisible)),
    dispatchCombinedAction: (actions: Array<Action>) => dispatch(dispatchCombinedAction(actions))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInUser);
