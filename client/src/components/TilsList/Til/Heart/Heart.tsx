import React, { Component } from 'react';

import * as api from './../../../../api';
import styles from './Heart.module.css';
import { ApiResponse } from '../../../../types/ApiResponse';
import { ResponseStatus } from '../../../../enums/ResponseStatus';
import { AppState } from '../../../../types/AppState';
import { Dispatch } from 'redux';
import { User } from '../../../../types/User';
import setUser from '../../../../redux/actions/setUser';
import { connect } from 'react-redux';
import { Til } from '../../../../types/Til';
import ConfirmDialog from '../../../controls/Modal/ConfirmDialog/ConfirmDialog';
import { getId } from '../../../../helpers/getId';


type Props = {
    user: User;
    setUser(user: User): void;
    til: Til;
};
type State = {
    likes: number;
    isCannotLikeMessageBoxVisible: boolean;
};

class Heart extends Component<Props, State> {

    state = {
        likes: this.props.til.likes ?? 0,
        isCannotLikeMessageBoxVisible: false
    };

    shouldComponentUpdate(nextProps: Props, nextState: State) {
        return nextState.likes != this.state.likes
            || nextState.isCannotLikeMessageBoxVisible != this.state.isCannotLikeMessageBoxVisible
            || (nextProps.user && !this.props.user)
            || (this.props.user && !nextProps.user)
            || (nextProps.user
                && this.props.user
                && nextProps.user.likedTils != this.props.user.likedTils
                && ((this.includesThisTil(nextProps.user.likedTils) && !this.includesThisTil(this.props.user.likedTils)) || (!this.includesThisTil(nextProps.user.likedTils) && this.includesThisTil(this.props.user.likedTils))));
    }

    isLiked = () => this.props.user && this.includesThisTil(this.props.user.likedTils);

    includesThisTil = (likedTils: string) => likedTils && likedTils.includes(`${this.props.til.id},`);

    onClick = async () => {

        if (!this.props.user) {
            this.setState({ isCannotLikeMessageBoxVisible: true });
            return;
        }

        if (this.isLiked()) {
            const response: ApiResponse = await api.unlikeTil(this.props.til.id);
            if (response.status == ResponseStatus.SUCCESS) {
                this.setState(state => ({
                    likes: state.likes - 1
                }));
                const updatedUser: User = JSON.parse(JSON.stringify(this.props.user));
                updatedUser.likedTils = this.props.user.likedTils.replace(`${this.props.til.id},`, '');
                this.props.setUser(updatedUser);
            } else {
                console.error(response);
            }
        } else {
            const response: ApiResponse = await api.likeTil(this.props.til.id);
            if (response.status == ResponseStatus.SUCCESS) {
                this.setState(state => ({
                    likes: state.likes + 1
                }));
                const updatedUser: User = JSON.parse(JSON.stringify(this.props.user));
                updatedUser.likedTils = (this.props.user.likedTils ?? '') + `${this.props.til.id},`;
                this.props.setUser(updatedUser);
            } else {
                console.error(response);
            }
        }
    };


    render() {
        return (
            <div className={styles.container} onClick={this.onClick}>
                <div className={this.isLiked() ? styles.likedHeart : styles.unlikedHeart} />
                <span className={'number ' + (this.isLiked() ? styles.likedNumber : styles.unlikedNumber)}>{this.state.likes}</span>

                {/* Show cannot like notification popup */}
                {this.state.isCannotLikeMessageBoxVisible &&
                    <ConfirmDialog
                        title='Not signed in'
                        message='Please Sign In to add articles and leave likes.'
                        yesText='OK'
                        yesClick={() => this.setState({ isCannotLikeMessageBoxVisible: false })}
                        noButtonHidden={true} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(Heart);


