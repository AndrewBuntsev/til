import React, { Component } from 'react';

import { AppState } from '../../types/AppState';
import setUser from '../../redux/actions/setUser';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import { connect } from 'react-redux';
import { clearCookies } from '../../helpers/cookiesHelper';
import styles from './Authorization.module.css';
import setIsUserMenuVisible from '../../redux/actions/setIsUserMenuVisible';
import { Action } from '../../redux/Action';
import dispatchCombinedAction from '../../redux/actions/dispatchCombinedAction';




type Props = {
    user: User;
    isUserMenuVisible: boolean;
    setIsUserMenuVisible: (isUserMenuVisible: boolean) => void;
    dispatchCombinedAction(actions: Array<Action>): Action;
};
type State = {};

class LoggedInUser extends Component<Props, State> {
    logOut = () => {
        clearCookies();
        this.props.dispatchCombinedAction([setIsUserMenuVisible(false), setUser(null)])
    };

    showPopup = () => this.props.setIsUserMenuVisible(true);
    hidePopup = () => this.props.setIsUserMenuVisible(false);

    render() {
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
                            <span className={styles.logout} onClick={this.logOut}>Logout</span>
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
    setIsUserMenuVisible: (isUserMenuVisible: boolean) => dispatch(setIsUserMenuVisible(isUserMenuVisible)),
    dispatchCombinedAction: (actions: Array<Action>) => dispatch(dispatchCombinedAction(actions))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInUser);
