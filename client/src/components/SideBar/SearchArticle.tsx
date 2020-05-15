import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import styles from './SideBar.module.css';
import SideBarItem from './SideBarItem';
import { AppState } from '../../types/AppState';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import setIsSearchFormVisible from '../../redux/actions/setIsSearchFormVisible';


const IMG = require('./../../assets/images/search.png');
const IMG_HOVER = require('./../../assets/images/search_over.png');

type Props = {
    isSearchFormVisible: boolean;
    setIsSearchFormVisible: (isSearchFormVisible: boolean) => void;
};
type State = {

    redirect: string;
    searchTerm: string;
};

class SearchArticle extends Component<Props, State> {
    state = {

        redirect: null,
        searchTerm: ''
    };

    toggleSearchFormVisibility = () => {
        this.props.setIsSearchFormVisible(!this.props.isSearchFormVisible);
    };

    onKeyDown = e => {
        if (e.keyCode == 13) {
            this.buttonSearchClick();
        }
    };

    buttonSearchClick = () => {
        if (!this.state.searchTerm) return;
        this.props.setIsSearchFormVisible(false);
        this.setState({
            searchTerm: '',
            redirect: `/posts?searchTerm=${this.state.searchTerm}`
        });
    };

    render() {
        return (
            <div className={styles.searchContainer}>
                <SideBarItem
                    img={this.props.isSearchFormVisible ? IMG_HOVER : IMG}
                    imgHover={IMG_HOVER}
                    onClick={this.toggleSearchFormVisibility} />
                {this.props.isSearchFormVisible && (
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




const mapStateToProps = (state: AppState) => ({
    isSearchFormVisible: state.isSearchFormVisible
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    setIsSearchFormVisible: (isSearchFormVisible: boolean) => dispatch(setIsSearchFormVisible(isSearchFormVisible))
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchArticle);