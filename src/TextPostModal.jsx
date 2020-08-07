import React from 'react';
import fire from './config/Fire';
export default class TextPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fire.firestore().collection('posts').add({
            type: 'text',
            body: this.state.body,
            dateCreated: new Date(),
            points: 0,
            title: this.state.title,
            uid: fire.auth().currentUser.uid,
            username: fire.auth().currentUser.displayName,
            group: this.props.selectedGroup,
        }).then(this.props.updateView).then(this.props.setModal)
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    render() {
        return (
            <div id='textModal'>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">
                        <input value={this.state.title} onChange={this.handleChange} type="text" name="title" id="titleInput" placeholder='Title' required />
                    </label>
                    <label htmlFor="body">
                        <textarea value={this.state.body} onChange={this.handleChange} name="body" id="bodyTextArea" placeholder='Text (optional)' />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}