import React from 'react';
import DeletePostButton from './DeletePostButton';
import { Link } from 'react-router-dom';
import LinkImage from './assets/link.png';
export default class PostTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    generatePost = () => {
        const post = this.props.post;
        const postData = this.props.post.data();
        let currentUserPost = false;
        if(this.props.user && this.props.user.uid === postData.uid) {
            currentUserPost = true;
        }
        if (postData.type === 'text') {
            return (
                <li key={post.id}>
                    <h1>{postData.title}</h1>
                    <h2>{postData.body}</h2>
                    {currentUserPost ? <DeletePostButton updatePosts={this.props.updatePosts} docId={post.id}/> : null}
                    <Link to={`/post/${post.id}`}>Comments</Link>
                </li>
            );
        } else if (postData.type === 'image') {
            return (
                <li key={post.id}>
                    <h1>{postData.title}</h1>
                    <img width='250px' src={postData.image} alt='post img'></img>
                    {currentUserPost ? <DeletePostButton updatePosts={this.props.updatePosts} docId={post.id}/> : null}
                    <Link to={`/post/${post.id}`}>Comments</Link>
                </li>
            );
        } else if (postData.type === 'link') {
            return (
                <li key={post.id}>
                    <a target='_blank' href={"http://"+postData.link} rel="noopener noreferrer">
                        <img src={LinkImage} alt="link"/>
                        <h1>{postData.title}</h1>
                    </a>
                    {currentUserPost ? <DeletePostButton updatePosts={this.props.updatePosts} docId={post.id}/> : null}
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