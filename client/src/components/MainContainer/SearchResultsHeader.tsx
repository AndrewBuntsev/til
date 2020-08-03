import React, { Component } from 'react';

import styles from './MainContainer.module.css';
import { User } from '../../types/User';


type Props = {
    params: URLSearchParams;
    author?: User;
    tilCount: number;
};

export default class SearchResultsHeader extends Component<Props> {
    render() {
        let keyword = null;
        const { params, author, tilCount } = this.props;
        let authorContacts = null;

        if (params.get('author') && author) {
            keyword = `by ${author.name}`;
            authorContacts = (
                <div className={styles.authorContactsPanel}>
                    {author.liUrl && <a href={author.liUrl}
                        title='LinkedIn'
                        target='_blank'
                        rel='noopener noreferrer'>
                        <img src={require('./../../assets/images/linkedin-32-blue.png')} />
                    </a>}
                    {author.fbUrl && <a href={author.fbUrl}
                        title='Facebook'
                        target='_blank'
                        rel='noopener noreferrer'>
                        <img src={require('./../../assets/images/facebook-32-blue.png')} />
                    </a>}
                    {author.wUrl && <a href={author.wUrl}
                        title='Personal Website'
                        target='_blank'
                        rel='noopener noreferrer'>
                        <img src={require('./../../assets/images/website-32-blue.png')} />
                    </a>}
                    {author.twUrl && <a href={author.twUrl}
                        title='Twitter'
                        target='_blank'
                        rel='noopener noreferrer'>
                        <img src={require('./../../assets/images/twitter-32-blue.png')} />
                    </a>}
                </div>
            );
        } else if (params.get('likedBy')) {
            keyword = ` I ❤`;
        } else if (params.get('date')) {
            keyword = `on ${params.get('date')}`;
        } else if (params.get('tag')) {
            keyword = `about #${params.get('tag')}`;
        } else if (params.get('searchTerm')) {
            keyword = `about ${params.get('searchTerm')}`;
        }


        return (
            <div className={styles.searchResultsHeaderContainer}>
                {keyword && <h2 className={styles.searchResultsHeader}>{`${tilCount} post${tilCount != 1 ? 's' : ''} ${keyword}`}</h2>}
                {authorContacts}
            </div>
        );
    }
}
