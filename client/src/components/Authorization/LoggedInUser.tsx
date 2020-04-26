import React, { Component } from 'react';

import { AppState } from '../../types/AppState';
import setUser from '../../redux/actions/setUser';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import { connect } from 'react-redux';
import { clearCookies } from '../../helpers/cookiesHelper';
import styles from './Authorization.module.css';




type Props = {
    user: User;
    setUser(user: User): void;
};
type State = {};

class LoggedInUser extends Component<Props, State> {
    logOut = () => {
        clearCookies();
        this.props.setUser(null);
    };

    render() {
        const user: User = this.props.user;

        return (
            <div>
                <div className={styles.tooltip}>
                    <img src={user.pictureUrl} className={styles.picture} />
                    <div className={styles.tooltipText}>
                        <span className={styles.name}>{user.name}</span>
                        <span className={styles.loggedin}>Logged via {user.ghId ? 'GitHub' : user.liId ? 'LinkedId' : '???'}</span>
                        <span className={styles.logout} onClick={this.logOut}>Logout</span>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state: AppState) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setUser: (user: User) => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoggedInUser);
