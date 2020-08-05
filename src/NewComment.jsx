import React from 'react';
import fire from './config/Fire';
export default class NewComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ''
        }
    }
    
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fire.firestore().collection('comments').add({
            points: 0,
            creator: fire.auth().currentUser.displayName,
            text: this.state.comment,
            dateCreated: new Date(),
            postId: this.props.postId
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} className='newCommentForm'>
                <textarea value={this.state.textarea} name='comment' onChange={this.handleChange} id="commentTextArea"/>
                <input type="submit" value="Submit comment"/>
            </form>
        );
    }
}