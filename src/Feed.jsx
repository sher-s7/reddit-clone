import React from 'react';
import LinkImage from './assets/link.png';
export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    generatePost = (post) => {
        const postData = post.data();
        if (postData.type === 'text') {
            return (
                <li key={post.id}>
                    <h1>{postData.title}</h1>
                    <h2>{postData.body}</h2>
                </li>
            );
        } else if (postData.type === 'image') {
            return (
                <li key={post.id}>
                    <h1>{postData.title}</h1>
                    <img width='250px' src={postData.image} alt='post img'></img>
                </li>
            );
        } else if (postData.type === 'link') {
            return (
                <li key={post.id}>
                    <a target='_blank' href={"http://"+postData.link} rel="noopener noreferrer">
                        <img src={LinkImage} alt="link"/>
                        <h1>{postData.title}</h1>
                    </a>
                </li>
            );
        }

    }

    render() {

        return (
            <div id='feed'>
                <ul>
                    {this.props.posts.map(post => (
                        this.generatePost(post)
                    ))}
                </ul>
            </div>
        );
    }
}