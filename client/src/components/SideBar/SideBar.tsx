import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import styles from './SideBar.module.css';
import SearchArticle from './SearchArticle';
import AddArticle from './AddArticle';
import SideBarItem from './SideBarItem';
import { User } from '../../types/User';
import { AppState } from '../../types/AppState';
import { getId } from '../../helpers/getId';
import { TWITTER_LINK } from '../../const/settings';
import About from './About';


type Props = {
    user: User;
};
type State = {
    redirect: string;
};

class SideBar extends Component<Props, State> {

    state = {
        redirect: ''
    };

    onTwitterClick = () => {
        window.open(TWITTER_LINK, '_blank', 'noopener noreferrer');
    };

    onDiceClick = () => {
        this.setState({ redirect: `/posts?random=1&pid=${getId()}` });
    };

    onChartClick = () => {
        this.setState({ redirect: '/statistics' });
    };

    render() {
        return (
            <div className={styles.container}>
                {<AddArticle />}
                <SearchArticle />
                <About />
                <SideBarItem img={require('./../../assets/images/chart.png')} imgHover={require('./../../assets/images/chart_over.png')} onClick={this.onChartClick} />
                <SideBarItem
                    img={require('./../../assets/images/twitter.png')}
                    imgHover={require('./../../assets/images/twitter_over.png')}
                    onClick={this.onTwitterClick} />
                <SideBarItem
                    img={require('./../../assets/images/dice.png')}
                    imgHover={require('./../../assets/images/dice_over.png')}
                    onClick={this.onDiceClick} />

                {this.state.redirect && <Redirect to={this.state.redirect} />}
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    user: state.user
});


export default connect(mapStateToProps)(SideBar);



