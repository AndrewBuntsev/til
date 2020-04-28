import React, { Component } from 'react';
import RichTextEditor from 'react-rte';

import * as api from './../../api';
// import JoditEditor from "jodit-react";
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import styles from './AddArticle.module.css';
import { ApiResponse } from '../../types/ApiResponse';
import Authorization from '../Authorization/Authorization';


type Props = {};
type State = {
    value: any;
};

export default class AddArticle extends Component<Props, State> {

    state = {
        value: RichTextEditor.createEmptyValue()
    }

    onTextChange = value => {
        this.setState({ value });
    };

    onHtmlChange = e => {
        this.setState({ value: RichTextEditor.createValueFromString(e.target.value, 'html') });
    };

    postArticle = async () => {
        this.setState({
            value: RichTextEditor.createEmptyValue()
        });
        const addTilresponse: ApiResponse = await api.addTil(this.state.value.toString('html'));
        console.log(addTilresponse);
    };

    render() {
        return (
            <div className={styles.container}>
                <Authorization />
                <div className={styles.textContainer}>
                    <RichTextEditor
                        value={this.state.value}
                        onChange={this.onTextChange}
                    />
                </div>


                <textarea
                    className={styles.htmlContainer}
                    value={this.state.value.toString('html')}
                    onChange={this.onHtmlChange} />

                <button onClick={this.postArticle}>post</button>
            </div>
        );
    }
}





// export default class AddArticle extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             editorState: '',
//         };
//     }

//     onEditorStateChange = (editorState) => {
//         this.setState({
//             editorState,
//         });
//     };

//     render() {
//         return (
//             <div className="App">
//                 <h2>Using CKEditor 5 build in React</h2>
//                 <CKEditor
//                     editor={ClassicEditor}
//                     data="<p>Hello from CKEditor 5!</p>"
//                     onInit={editor => {
//                         // You can store the "editor" and use when it is needed.
//                         console.log('Editor is ready to use!', editor);
//                     }}
//                     onChange={(event, editor) => {
//                         const data = editor.getData();
//                         console.log({ event, editor, data });
//                     }}
//                     onBlur={(event, editor) => {
//                         console.log('Blur.', editor);
//                     }}
//                     onFocus={(event, editor) => {
//                         console.log('Focus.', editor);
//                     }}
//                 />
//             </div>
//         );
//     }
// }

// export default class AddArticle extends Component {

//     state = {
//         content: '',
//     }

//     editor = React.createRef();

//     render() {
//         const config = {
//             readonly: false // all options from https://xdsoft.net/jodit/doc/
//         }

//         return (
//             <>
//                 <JoditEditor
//                     ref={this.editor}
//                     value={this.state.content}
//                     config={config}
//                     tabIndex={1} // tabIndex of textarea
//                     onBlur={newContent => this.setState({ content: newContent })} // preferred to use only this option to update the content for performance reasons
//                     onChange={newContent => { }}
//                 />
//                 <button onClick={() => console.log(this.state.content)}>code</button>
//             </>
//         );
//     }
// }

