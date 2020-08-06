import React from 'react';
import fire from './config/Fire';
import NewComment from './NewComment';
import CommentTemplate from './CommentTemplate';
export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount = () => {
        fire.firestore().collection('posts').doc(this.props.postId).get().then(docRef => {
            this.setState({ post: docRef.data(), user: fire.auth().currentUser })
        });
        this.updateComments();
    }

    displayPost = () => {
        const post = this.state.post;
        if (post.type === 'text') {
            return (
                <div className='post'>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </div>
            );
        } else if (post.type === 'image') {
            return (
                <div className='post'>
                    <h3>{post.title}</h3>
                    <img width='290px' src={post.image} alt='post img' />
                </div>
            )
        } else if (post.type === 'link') {
            return (
                <div className='post'>
                    <a target='_blank' rel="noopener noreferrer" href={post.link}>{post.title}</a>
                </div>
            )
        }
    }

    updateComments = () => {
        fire.firestore().collection('comments').where('postId', '==', this.props.postId).orderBy('points', 'desc').get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
        });
    }

    render() {
        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>
                    {this.displayPost()}
                    <div className='comments'>
                        <span>Comments</span>
                        <NewComment updateComments={this.updateComments} postId={this.props.postId}/>
                        {this.state.comments.map(comment => (
                            <CommentTemplate user={this.state.user} key={comment.id} updateComments={this.updateComments} comment={comment}/>
                        ))}
                    </div>
                </div>
            ) : <span>Loading</span>

        );
    }
}