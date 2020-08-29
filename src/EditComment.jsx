import React from 'react';
import fire from './config/Fire';
export default class EditComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        fire.firestore().collection('comments').doc(this.props.docId).get().then(docRef => {
            if (docRef.exists) {
                this.setState({ commentText: docRef.data().text })
            }
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    submitEdit = (e) => {
        e.preventDefault();
        console.log(this.props.docId)
        fire.firestore().collection('comments').doc(this.props.docId).update({
            text: this.state.commentText
        }).then(() => {
            this.props.markAsEdited();
            this.props.editComment(false)
        }).then(this.props.updateComments).catch(error => console.error(error.message));
    }

    render() {
        return (
            <form className='editCommentForm' onSubmit={this.submitEdit}>
                <textarea name='commentText' value={this.state.commentText} onChange={this.handleChange}></textarea>
                <input type="submit" value="Submit" />
                <button onClick={() => this.props.editComment(false)}>Cancel</button>
            </form>
        );
    }
}