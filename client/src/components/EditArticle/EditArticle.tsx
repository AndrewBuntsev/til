import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import RichTextEditor from 'react-rte';

import * as api from '../../api';
// import JoditEditor from "jodit-react";
// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import styles from './EditArticle.module.css';
import { ApiResponse } from '../../types/ApiResponse';
import Authorization from '../Authorization/Authorization';
import Button from '../controls/Button/Button';
import { ResponseStatus } from '../../enums/ResponseStatus';


type Props = {};
type State = {
    articleId?: string;
    value: any;
    redirect: string;
};

export default class EditArticle extends Component<Props, State> {

    state = {
        articleId: null,
        value: RichTextEditor.createEmptyValue(),
        redirect: null
    }

    onTextChange = value => {
        this.setState({ value });
    };

    onHtmlChange = e => {
        let html: string = e.target.value;
        html = html
            .replace(/<br>/g, '')
            .replace(/<h1>/g, '<h2>')
            .replace(/<\/h1>/g, '</h2>');
        this.setState({ value: RichTextEditor.createValueFromString(html, 'html') });
    };

    saveArticle = async () => {
        const saveTilresponse: ApiResponse = await api.saveTil(this.state.value.toString('html'), this.state.articleId);
        //TODO: process an error
        this.setState({ redirect: '/' });
    };

    deleteArticle = async () => {
        const deleteTilresponse: ApiResponse = await api.deleteTil(this.state.articleId);
        //TODO: process an error
        console.log(deleteTilresponse);
        this.setState({ redirect: '/' });
    };

    async componentDidMount() {
        const articleId = (new URLSearchParams(window.location.search)).get('articleId');

        if (articleId) {
            //load the article
            const response: ApiResponse = await api.getTil(articleId);
            if (response.status == ResponseStatus.SUCCESS && response.payload) {
                this.setState({
                    articleId: articleId,
                    value: RichTextEditor.createValueFromString(response.payload['text'], 'html')
                });
            }
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        const toolbarConfig = {
            // Optionally specify the groups to display (displayed in the order listed).
            display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'LINK_BUTTONS', 'IMAGE_BUTTON', 'HISTORY_BUTTONS'],
            INLINE_STYLE_BUTTONS: [
                { label: 'Bold', style: 'BOLD', className: 'custom-css-class' },
                { label: 'Italic', style: 'ITALIC' },
                { label: 'Underline', style: 'UNDERLINE' }
            ],
            BLOCK_TYPE_DROPDOWN: [
                { label: 'Normal', style: 'unstyled' },
                { label: 'Heading', style: 'header-two' },
                { label: 'Heading Small', style: 'header-three' },
                { label: 'Code Block', style: 'code-block' }
            ],
            BLOCK_TYPE_BUTTONS: [
                { label: 'Blockquote', style: 'blockquote' },
                { label: 'Image', style: 'image' }
            ]
        };

        return (
            <div className={styles.container}>

                <Authorization />
                <div className={styles.textContainer}>
                    <RichTextEditor
                        toolbarConfig={toolbarConfig}
                        value={this.state.value}
                        onChange={this.onTextChange}
                    />
                </div>


                <textarea
                    className={styles.htmlContainer}
                    value={this.state.value.toString('html')}
                    onChange={this.onHtmlChange} />

                <div className={styles.buttonsPanel}>
                    <Button title={this.state.articleId ? 'Save' : 'Post'} onClick={this.saveArticle} />
                    {this.state.articleId && <Button title={'Delete'} onClick={this.deleteArticle} />}
                </div>
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

