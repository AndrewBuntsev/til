import React, { Component } from 'react';
import styles from './LoggedInUser.module.css';
import { AppState } from '../../types/AppState';
import setUser from '../../redux/actions/setUser';
import { Dispatch } from 'redux';
import { User } from '../../types/User';
import { connect } from 'react-redux';
import { setFBUserId, setFBAccessToken, setGHUserId, setGHAccessToken } from '../../helpers/cookiesHelper';




type Props = {
    user: User;
    setUser(user: User): void;
};
type State = {};

class LoggedInUser extends Component<Props, State> {
    logOut = () => {
        setFBUserId('');
        setFBAccessToken('');
        setGHUserId('');
        setGHAccessToken('');
        this.props.setUser(null);
    };

    render() {
        const user: User = this.props.user;

        return (
            <div className={styles.container}>
                <div className={styles.nameContainer}>
                    <span>{user.name}</span>
                </div>

                <div className={styles.pictureContainer}>
                    <img src={user.pictureUrl} width={50} />
                </div>

                <div className={styles.loggedViaContainer}>
                    {user.fbId ? 'FB' : user.ghId ? 'GH' : '?'}
                </div>

                <button onClick={this.logOut}>Log out</button>
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
