import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import styles from './SideBar.module.css';
import SideBarItem from './SideBarItem';


type Props = {};
type State = {};

export default class SearchArticle extends Component<Props, State> {


    render() {
        return (
            <SideBarItem img={require('./../../assets/images/search.png')} imgHover={require('./../../assets/images/search_over.png')} onClick={() => { }} />
        );
    }
}



