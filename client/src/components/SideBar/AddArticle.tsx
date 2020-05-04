import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from './SideBar.module.css';
import SideBarItem from './SideBarItem';


type Props = {};
type State = {
    redirect: string;
};

export default class AddArticle extends Component<Props, State> {

    state = { redirect: '' };

    onClick = () => {
        this.setState({ redirect: '/editArticle' });
    };

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        return (
            <div>
                <SideBarItem img={require('./../../assets/images/add.png')} imgHover={require('./../../assets/images/add_over.png')} onClick={this.onClick} />
            </div>
        );
    }
}



