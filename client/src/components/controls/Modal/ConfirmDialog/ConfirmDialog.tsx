import React, { Component } from 'react';
import styles from './ConfirmDialog.module.css';
import Button from '../../Button/Button';
import Modal from '../Modal';


type Props = {
    title?: string;
    message: string;
    yesText?: string;
    noText?: string;
    yesClick?(): void;
    noClick?(): void;
    closeClick?(): void;
};
type State = {};

export default class ConfirmDialog extends Component<Props, State> {

    state = {};

    render() {
        return (
            <Modal>
                <div className={styles.container}>
                    <div className={styles.headerSection}>
                        {this.props.title && <div className={styles.title}>{this.props.title}</div>}
                        <img className={styles.closeButton} src={require('./../../../../assets/images/x-mark-black-16.png')} onClick={this.props.closeClick ?? this.props.noClick} />
                    </div>

                    <div className={styles.message}>{this.props.message}</div>
                    <div className={styles.buttons}>
                        <Button title={this.props.yesText ?? 'YES'} icon={require('./../../../../assets/images/check-16.png')} onClick={this.props.yesClick} />
                        <Button title={this.props.noText ?? 'NO'} icon={require('./../../../../assets/images/x-mark-16.png')} onClick={this.props.noClick} />
                    </div>
                </div>
            </Modal>
        );
    }
}



