import React, { Component } from 'react';

import styles from './SideBar.module.css';


type Props = {
    img: any;
    imgHover: any;
    onClick(): void;
};
type State = {};

export default class SideBarItem extends Component<Props, State> {

    onMouseOver = (e) => {
        e.target.src = this.props.imgHover;
    };

    onMouseOut = (e) => {
        e.target.src = this.props.img;
    };

    render() {
        return (
            <div className={styles.sideBarItemContainer} onClick={this.props.onClick}>
                <img src={this.props.img} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut} />
            </div>
        );
    }
}



