import React, { Component } from 'react';
import styles from './TilsList.module.css';
import { Til } from '../../types/Til';
import TilArticle from './Til/TilArticle';



type Props = {
    tils: Array<Til>
};
type State = {};

export default class TilsList extends Component<Props, State> {

    state = {};




    render() {
        const tils = this.props.tils.map(til =>
            <div className={styles.tilContainer} key={til._id}>
                <div className={styles.tilWrapper}>
                    <TilArticle til={til} />
                </div>
            </div>
        );
        return (
            <div className={styles.container}>
                {tils}
            </div>
        );
    }
}



