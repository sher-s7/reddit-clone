import React from 'react';
import fire from './config/Fire';
export default class EditPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        fire.firestore().collection('posts').doc(this.props.docId).get().then(docRef => {
            this.setState({postBody: docRef.data().body})
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    submitEdit = (e) => {
        e.preventDefault();
        fire.firestore().collection('posts').doc(this.props.docId).update({
            body: this.state.postBody
        }).then(() => {
            this.props.markAsEdited();
            this.props.editPost(false)
        }).then(this.props.updatePosts);
    }

    render() {
        return (
            <form className='editPostForm' onSubmit={this.submitEdit}>
                Edit post
                <textarea name='postBody' value={this.state.postBody} onChange={this.handleChange}></textarea>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}