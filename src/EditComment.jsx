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
            this.setState({commentText: docRef.data().text})
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    submitEdit = (e) => {
        e.preventDefault();
        fire.firestore().collection('comments').doc(this.props.docId).update({
            text: this.state.commentText
        }).then(() => {
            this.props.markAsEdited();
            this.props.editComment(false)
        }).then(this.props.updateComments);
    }

    render() {
        return (
            <form className='editCostForm' onSubmit={this.submitEdit}>
                Edit comment
                <textarea name='commentText' value={this.state.commentText} onChange={this.handleChange}></textarea>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}