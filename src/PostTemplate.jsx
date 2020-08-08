import React from 'react';
import DeletePostButton from './DeletePostButton';
import { Link } from 'react-router-dom';
import LinkImage from './assets/link.png';
import fire from './config/Fire';
import EditPostButton from './EditPostButton';
import EditPost from './EditPost';
export default class PostTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPost: false,
            edited: false
        }
    }

    editPost = (value) => {
        this.setState({ editPost: value })
    }

    markAsEdited = () => {
        fire.firestore().collection('posts').doc(this.props.post.id).update({ edited: true });
    }

    generatePost = () => {
        const post = this.props.post;
        const postData = this.props.post.data();
        let currentUserPost = false;
        if (this.props.user && this.props.user.uid === postData.uid) {
            currentUserPost = true;
        }
        if (postData.type === 'text') {
            return (
                <li key={post.id}>
                    <span>Posted by <Link to={`/profile/${postData.username}`}>{postData.username}</Link></span>
                    {postData.edited ? <span className='edited'>(edited)</span> : null}
                    <h1>{postData.title}</h1>
                    {this.state.editPost ? <EditPost updatePosts={this.props.updatePosts} editPost={this.editPost} markAsEdited={this.markAsEdited} docId={post.id} /> : <h2>{postData.body}</h2>}
                    {currentUserPost ? <EditPostButton editPost={this.editPost} /> : null}
                    {currentUserPost ? <DeletePostButton updatePosts={this.props.updatePosts} docId={post.id} /> : null}
                    <Link to={`/post/${post.id}`}>Comments</Link>
                </li>
            );
        } else if (postData.type === 'image') {
            return (
                <li key={post.id}>
                    <span>Posted by <Link to={`/profile/${postData.username}`}>{postData.username}</Link></span>
                    <h1>{postData.title}</h1>
                    <img width='250px' src={postData.image} alt='post img'></img>
                    {currentUserPost ? <DeletePostButton updatePosts={this.props.updatePosts} type={'image'} docId={post.id} /> : null}
                    <Link to={`/post/${post.id}`}>Comments</Link>
                </li>
            );
        } else if (postData.type === 'link') {
            return (
                <li key={post.id}>
                    <span>Posted by <Link to={`/profile/${postData.username}`}>{postData.username}</Link></span>
                    <a target='_blank' href={"http://" + postData.link} rel="noopener noreferrer">
                        <img src={LinkImage} alt="link" />
                        <h1>{postData.title}</h1>
                    </a>
                    {currentUserPost ? <DeletePostButton updatePosts={this.props.updatePosts} docId={post.id} /> : null}
                    <Link to={`/post/${post.id}`}>Comments</Link>
                </li>
            );
        }

    }

    render() {
        return (
            this.generatePost()
        );
    }
}