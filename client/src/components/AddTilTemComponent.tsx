import React, { Component, CSSProperties } from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as api from '../api';
import dispatchCombinedAction from '../redux/actions/dispatchCombinedAction';
import { ApiResponse } from '../types/ApiResponse';
import { ResponseStatus } from '../enums/ResponseStatus';
import { AppState } from '../types/AppState';
import { Action } from '../redux/Action';
import { ActionType } from '../redux/ActionType';



type Props = {
};
type State = {
    header: string;
    text: string;
    user: string;
};

class AddTilTemComponent extends Component<Props, State> {

    state = {
        header: '',
        text: '',
        user: ''
    };

    addTil = async () => {
        this.setState({
            header: '',
            text: '',
            user: ''
        });
        await api.addTil({ header: this.state.header, text: this.state.text, user: this.state.user, _id: '' });
    };

    async componentDidMount() {
        //const response: Response = await api.addTil(this.props.clientDetails.clientId, { clientId, clientName });
        const response: ApiResponse = await api.getTils();
        console.log(response.payload);
    }

    render() {
        return <div style={styles.container}>
            <input type='text' value={this.state.header} onChange={e => this.setState({ header: e.target.value })} />
            <input type='text' value={this.state.text} onChange={e => this.setState({ text: e.target.value })} />
            <input type='text' value={this.state.user} onChange={e => this.setState({ user: e.target.value })} />
            <button onClick={this.addTil}>Add TIL</button>
        </div>;
    }
}

const mapStateToProps = (state: AppState) => ({

});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    // dispatchCombinedAction: (actions: Array<Action>) => dispatch(dispatchCombinedAction(actions)),
    // setClientDetails: (clientDetails: ClientDetails) => dispatch(setClientDetails(clientDetails)),
    // setActiveContact: (activeContact: Contact) => dispatch(setActiveContact(activeContact))
});

export default connect(mapStateToProps, mapDispatchToProps)(AddTilTemComponent);



const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column'
    } as CSSProperties
};