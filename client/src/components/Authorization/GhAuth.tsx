import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';

import styles from './Authorization.module.css';
import setUser from '../../redux/actions/setUser';
import { User } from '../../types/User';
import { setGHUserId, setGHAccessToken, clearCookies } from '../../helpers/cookiesHelper';
import * as api from '../../api';
import { ApiResponse } from '../../types/ApiResponse';
import { ResponseStatus } from '../../enums/ResponseStatus';
import getTypeFromObject from '../../helpers/getTypeFromObject';



type Props = {
    setUser(user: User): void;
};
type State = {
    redirect: string;
};

class GhAuth extends Component<Props, State> {

    state = { redirect: null };

    async componentDidMount() {
        // get the request code from the query string
        const code = (new URLSearchParams(window.location.search)).get('code');

        if (!code) {
            console.error('GitHub Authorization failed because request code has not been provided')
            this.setState({ redirect: '/' });
        }

        // process GitHub request code
        const resp: ApiResponse = await api.ghAuth({ code });
        if (resp.status == ResponseStatus.SUCCESS && resp.payload) {
            const user: User = getTypeFromObject<User>(resp.payload);
            this.props.setUser(user);
            clearCookies();
            setGHUserId(user.ghId);
            setGHAccessToken(user['access_token']);
            this.setState({ redirect: '/' });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div className={styles.container}>
                Authorizing...
            </div>
        );
    }
}


const mapDispatchToProps = (dispatch: Dispatch) => ({
    setUser: (user: User) => dispatch(setUser(user))
});

export default connect(null, mapDispatchToProps)(GhAuth);


