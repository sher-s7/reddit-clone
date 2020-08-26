/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import DeletePostButton from './DeletePostButton';
import { Link, withRouter } from 'react-router-dom';
import fire from './config/Fire';
import EditPostButton from './EditPostButton';
import EditPost from './EditPost';
import 'line-awesome/dist/line-awesome/css/line-awesome.min.css'
import VoteButton from './VoteButton';
import { formatDistanceStrict } from 'date-fns';

class PostTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editPost: false,
            location: this.props.location,
        }
    }

    editPost = (value) => {
        this.setState({ editPost: value })
    }

    markAsEdited = () => {
        fire.firestore().collection('posts').doc(this.props.post.id).update({ edited: true }).then();
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
                <>
                    {postData.edited ? <span className='edited'>(edited)</span> : null}
                    {this.state.editPost ? <EditPost updatePosts={this.props.updatePosts} editPost={this.editPost} markAsEdited={this.markAsEdited} docId={post.id} /> : <p className='postBody'>{postData.body}</p>}
                    {currentUserPost && !this.props.profile ? <EditPostButton editPost={this.editPost} /> : null}
                </>
            );
        } else if (postData.type === 'image') {
            return (
                <div className='imageContainer'>
                    <img width='250px' src={postData.image} alt='Post image'></img>
                </div>
            );
        } else if (postData.type === 'link') {
            return (
                <a className='postLink' target='_blank' href={postData.link} rel="noopener noreferrer">
                    {postData.link}
                </a>
            );
        }

    }

    render() {
        return (
            <div className={`postContainer ${this.props.post.data().type}`}>
                {this.state.location.pathname === '/' || this.state.location.pathname === '/feed' || this.state.location.pathname.includes('/post/') || this.state.location.pathname.includes('/profile/') ?
                    <div className='groupName'>
                        <Link to={`/group/${this.props.post.data().group}`}>{this.props.post.data().group}</Link>
                    </div>
                    : null}
                <div className='postedBy'><span className='user'>Posted by <Link to={`/profile/${this.props.post.data().username}`}>{this.props.post.data().username}</Link></span><span className='dividingDot'>·</span>
                    <span className='distanceInWords'>{formatDistanceStrict(this.props.post.data().dateCreated.toDate(), new Date(),
                        { addSuffix: true })}</span></div>
                <h1 className='postTitle'>{this.props.post.data().title}</h1>
                {this.props.profile ? null : <VoteButton collection='posts' doc={this.props.post} />}
                {this.generatePost()}
                {this.props.user && this.props.user.uid === this.props.post.data().uid ? <DeletePostButton profile={this.props.profile} updatePosts={this.props.updatePosts} docId={this.props.post.id} /> : null}

            </div>

        );
    }
}

export default withRouter(PostTemplate);