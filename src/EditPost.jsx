import React from 'react';
import fire from './config/Fire';
export default class EditPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('touchstart', this.handleClickOutside);
        fire.firestore().collection('posts').doc(this.props.docId).get().then(docRef => {
            this.setState({ postBody: docRef.data().body })
        })
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('touchstart', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.props.editPost(false)
        }
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
            <form ref={this.wrapperRef} className='editPostForm' onSubmit={this.submitEdit}>
                <p>EDIT POST</p>
                <textarea maxLength={10000} name='postBody' value={this.state.postBody} onChange={this.handleChange}></textarea>
                <input type="submit" value="Submit" />
                <button onClick={() => this.props.editPost(false)}>Cancel</button>
            </form>
        );
    }
}