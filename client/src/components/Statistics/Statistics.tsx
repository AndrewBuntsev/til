import React, { Component } from 'react';

import styles from './Statistics.module.css';
import { ApiResponse } from '../../types/ApiResponse';
import * as api from './../../api';
import { ResponseStatus } from '../../enums/ResponseStatus';
import getTypeFromObject from '../../helpers/getTypeFromObject';
import StatisticsGrid from './StatisticsGrid';
import SideBar from '../SideBar/SideBar';

type TilSummary = {
    title: string;
    tag: string;
    likes: number;
};

type TagSummary = {
    _id: { tag: string };
    tilsCount: number;
};

type AuthorSummary = {
    _id: { userId: string, userName: string };
    tilsCount: number;
};

type Props = {};

type State = {
    tilsTotal: number;
    topTils: Array<TilSummary>;
    tags: Array<{ tag: string, tilsCount: number }>;
    authors: Array<{ authorId: string, authorName: string, tilsCount: number }>;
};

export default class Statistics extends Component<Props, State> {

    async componentDidMount() {
        const resp: ApiResponse = await api.getStatistics();
        if (resp.status == ResponseStatus.SUCCESS && resp.payload) {
            const topTils: Array<TilSummary> = getTypeFromObject<Array<TilSummary>>(resp.payload['topTils']);

            const tags: Array<TagSummary> = getTypeFromObject<Array<TagSummary>>(resp.payload['tags']);

            const authors: Array<AuthorSummary> = getTypeFromObject<Array<AuthorSummary>>(resp.payload['authors']);

            const tilsTotal: number = tags.reduce((acc, el) => acc + el.tilsCount, 0);

            this.setState({
                tilsTotal,
                topTils: topTils.map(t => ({ title: t.title, tag: t.tag.toLowerCase(), likes: t.likes })),
                tags: tags.map(t => ({ tag: t._id.tag.toLowerCase(), tilsCount: t.tilsCount })),
                authors: authors.map(a => ({ authorId: a._id.userId, authorName: a._id.userName, tilsCount: a.tilsCount }))
            });

            console.log(resp.payload);
        } else {
            console.error(resp);
        }
    }

    //TODO: make lines clickable

    render() {

        return (
            <div className={styles.container}>
                <h1>Statistics</h1>

                {this.state
                    && this.state.topTils
                    && <StatisticsGrid
                        data={this.state.topTils.map(til => ({ title: til.title, data: `#${til.tag} \u00A0•\u00A0 ${til.likes} likes` }))}
                        title={'Most liked posts'} />}

                {this.state
                    && this.state.tags
                    && <StatisticsGrid
                        data={this.state.tags.map(tag => ({ title: `#${tag.tag}`, data: `#${tag.tilsCount} posts` }))}
                        title={`${this.state.tilsTotal} posts in ${this.state.tags.length} channels`} />}

                {this.state
                    && this.state.authors
                    && <StatisticsGrid
                        data={this.state.authors.map(author => ({ title: author.authorName, data: `#${author.tilsCount} posts` }))}
                        title={`${this.state.authors.length} authors`} />}

                <SideBar />
            </div>
        );
    }
}

