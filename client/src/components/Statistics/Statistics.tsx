import React, { Component } from 'react';

import styles from './Statistics.module.css';
import { ApiResponse } from '../../types/ApiResponse';
import * as api from './../../api';
import { ResponseStatus } from '../../enums/ResponseStatus';
import getTypeFromObject from '../../helpers/getTypeFromObject';
import StatisticsGrid from './StatisticsGrid';
import SideBar from '../SideBar/SideBar';
import BarChart from '../controls/BarChart/BarChart';
import Authorization from '../Authorization/Authorization';

type TilSummary = {
    id: string;
    title: string;
    tag: string;
    likes: number;
};

type TagSummary = {
    tag: string;
    tilsCount: number;
};

type AuthorSummary = {
    userId: string;
    userName: string;
    tilsCount: number;
};

type DateSummary = {
    date: string;
    tilsCount: number;
};

type Props = {};

type State = {
    tilsTotal: number;
    topTils: Array<TilSummary>;
    dates: Array<DateSummary>;
    tags: Array<TagSummary>;
    authors: Array<AuthorSummary>;
};

export default class Statistics extends Component<Props, State> {

    async componentDidMount() {
        const resp: ApiResponse = await api.getStatistics();
        if (resp.status == ResponseStatus.SUCCESS && resp.payload) {
            console.log(resp.payload)
            const topTils: Array<TilSummary> = getTypeFromObject<Array<TilSummary>>(resp.payload['topTils']);

            const dates: Array<DateSummary> = getTypeFromObject<Array<DateSummary>>(resp.payload['dates']);

            const tags: Array<TagSummary> = getTypeFromObject<Array<TagSummary>>(resp.payload['tags']);

            const authors: Array<AuthorSummary> = getTypeFromObject<Array<AuthorSummary>>(resp.payload['authors']);

            const tilsTotal: number = tags.reduce((acc, el) => acc + el.tilsCount, 0);

            this.setState({
                tilsTotal,
                topTils: topTils.map(t => ({ id: t.id, title: t.title, tag: t.tag.toLowerCase(), likes: t.likes })),
                dates,
                tags,
                authors
            });

        } else {
            console.error(resp);
        }
    }


    render() {

        return (
            <div className={styles.container}>

                <Authorization />
                <SideBar />

                <div className={styles.wrapper}>
                    <h1>Statistics</h1>

                    {this.state
                        && this.state.dates
                        && <BarChart data={new Map(this.state.dates.map(d => [d.date, d.tilsCount]))} />}

                    {this.state
                        && this.state.topTils
                        && <StatisticsGrid
                            data={this.state.topTils.map(til => ({ title: til.title, data: `#${til.tag} \u00A0•\u00A0 ${til.likes} likes`, link: `/posts?id=${til.id}` }))}
                            title={'Most liked posts'} />}

                    {this.state
                        && this.state.tags
                        && this.state.authors
                        && <div className={styles.columnsContainer}>
                            <StatisticsGrid
                                data={this.state.tags.map(tag => ({ title: `#${tag.tag}`, data: `#${tag.tilsCount} posts`, link: `/posts?tag=${tag.tag.toUpperCase()}` }))}
                                title={`${this.state.tilsTotal} posts in ${this.state.tags.length} channels`} />

                            <StatisticsGrid
                                data={this.state.authors.map(author => ({ title: author.userName, data: `#${author.tilsCount} posts`, link: `/posts?author=${author.userId}` }))}
                                title={`${this.state.authors.length} authors`} />
                        </div>}
                </div>

            </div>
        );
    }
}

