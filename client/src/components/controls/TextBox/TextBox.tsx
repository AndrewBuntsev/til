import React, { Component, CSSProperties } from 'react';
import styles from './TextBox.module.css';



type Props = {
    initialValue?: string;
    valueChanged: (newValue: string) => void;
    autocompleteList?: Array<string>;
    autoFocus?: boolean;
};
type State = {
    value: string;
    autocompleteMatchedList?: Array<string>;
};

export default class TextBox extends Component<Props, State> {

    state = {
        value: this.props.initialValue ?? '',
        autocompleteMatchedList: null
    };

    onValueChange = e => {
        const newValue: string = e.target.value;
        this.setState({ value: newValue });
        if (this.props.autocompleteList) {
            const matchedList = newValue ? this.props.autocompleteList.filter(r => r.includes(newValue.toUpperCase())) : null;
            this.setState({ autocompleteMatchedList: matchedList });
        }
        this.props.valueChanged(newValue);
    };

    onValueSelect = (value: string) => {
        this.setState({ value, autocompleteMatchedList: null });
        this.props.valueChanged(value);
    };

    onKeyDown = key => {
        if (key.key == 'Enter' || key.key == 'Escape') {
            this.setState({ autocompleteMatchedList: null })
        }
    };

    render() {
        return (
            <div className={styles.container}>
                <input
                    type='text'
                    value={this.state.value}
                    placeholder='Specify a tag...'
                    onChange={this.onValueChange}
                    autoFocus={this.props.autoFocus ? true : false}
                    onKeyDown={this.onKeyDown} />
                {this.state.autocompleteMatchedList && this.state.autocompleteMatchedList.length > 0 &&
                    <div className={styles.autocompleteContainer}>
                        <ul>
                            {this.state.autocompleteMatchedList.map(item => <li
                                key={item}
                                onClick={() => this.onValueSelect(item)}>{item}</li>)}
                        </ul>
                    </div>
                }
            </div>
        );
    }
}



