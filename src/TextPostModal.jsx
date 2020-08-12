import React from 'react';
import fire from './config/Fire';
import { withRouter } from 'react-router-dom';
class TextPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const currentUser = fire.auth().currentUser;
        if (!currentUser) {
            alert('Must be logged in to post.')
        } else {
            fire.firestore().collection('posts').add({
                type: 'text',
                body: this.state.body,
                dateCreated: new Date(),
                points: 0,
                title: this.state.title,
                uid: currentUser.uid,
                username: currentUser.displayName,
                group: this.props.selectedGroup,
                commentCount: 0,
                votes: {}
            }).then((post) => {
                this.props.setModal();
                this.props.history.push(`/${this.props.selectedGroup}/post/${post.id}`);
            })
        }
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

export default withRouter(TextPostModal)