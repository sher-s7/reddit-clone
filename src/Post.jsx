import React from 'react';
import fire from './config/Fire';
import { Link } from 'react-router-dom';
import NewComment from './NewComment';
export default class Post extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount = () => {
        fire.firestore().collection('posts').doc(this.props.postId).get().then(docRef => {
            this.setState({ post: docRef.data() })
        });
        fire.firestore().collection('comments').where('postId', '==', this.props.postId).get().then(commentsData => {
            this.setState({ comments: commentsData.docs })
        });
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
                    <img src={post.image} alt='post img' />
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

    render() {
        return (
            this.state.post && this.state.comments ? (
                <div className='postPage'>
                    {this.displayPost()}
                    <div className='comments'>
                        <span>Comments</span>
                        <NewComment postId={this.props.postId}/>
                        {this.state.comments.map(comment => (
                            <div key={comment.id} className='comment'>
                                <div className='commentPoints'>{comment.data().points}</div>
                                <Link to={`/profile/${comment.data().creator}`}>{comment.data().creator}</Link>
                                <p>{comment.data().text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : <span>Loading</span>

        );
    }
}