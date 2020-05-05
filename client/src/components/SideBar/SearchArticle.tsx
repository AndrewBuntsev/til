import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from './SideBar.module.css';
import SideBarItem from './SideBarItem';


const IMG = require('./../../assets/images/search.png');
const IMG_HOVER = require('./../../assets/images/search_over.png');

type Props = {};
type State = {
    isSearchFormvisible: boolean;
    redirect: string;
    searchTerm: string;
};

export default class SearchArticle extends Component<Props, State> {
    state = {
        isSearchFormvisible: false,
        redirect: null,
        searchTerm: ''
    };

    toggleSearchFormVisibility = () => {
        this.setState(state => ({ isSearchFormvisible: !state.isSearchFormvisible }));
    };

    onKeyDown = e => {
        if (e.keyCode == 13) {
            this.buttonSearchClick();
        }
    };

    buttonSearchClick = () => {
        if (!this.state.searchTerm) return;
        this.setState({
            isSearchFormvisible: false,
            searchTerm: '',
            redirect: `/posts?searchTerm=${this.state.searchTerm}`
        });
    };

    render() {
        return (
            <div className={styles.searchContainer}>
                <SideBarItem
                    img={this.state.isSearchFormvisible ? IMG_HOVER : IMG}
                    imgHover={IMG_HOVER}
                    onClick={this.toggleSearchFormVisibility} />
                {this.state.isSearchFormvisible && (
                    <div className={styles.searchForm}>
                        <input
                            type='text'
                            value={this.state.searchTerm}
                            onChange={e => this.setState({ searchTerm: e.target.value })}
                            onKeyDown={this.onKeyDown}
                            autoFocus />
                        <button onClick={this.buttonSearchClick}>search</button>
                    </div>
                )}

                {this.state.redirect && <Redirect to={this.state.redirect} />}
            </div>
        );
    }
}



