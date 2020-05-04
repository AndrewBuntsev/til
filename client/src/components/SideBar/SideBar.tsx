import React, { Component } from 'react';

import styles from './SideBar.module.css';
import SearchArticle from './SearchArticle';
import AddArticle from './AddArticle';
import SideBarItem from './SideBarItem';


type Props = {};
type State = {};

export default class SideBar extends Component<Props, State> {

    render() {
        return (
            <div className={styles.container}>
                <AddArticle />
                <SearchArticle />
                <SideBarItem img={require('./../../assets/images/question.png')} imgHover={require('./../../assets/images/question_over.png')} onClick={() => { }} />
                <SideBarItem img={require('./../../assets/images/chart.png')} imgHover={require('./../../assets/images/chart_over.png')} onClick={() => { }} />
                <SideBarItem img={require('./../../assets/images/twitter.png')} imgHover={require('./../../assets/images/twitter_over.png')} onClick={() => { }} />
                <SideBarItem img={require('./../../assets/images/dice.png')} imgHover={require('./../../assets/images/dice_over.png')} onClick={() => { }} />
            </div>
        );
    }
}



