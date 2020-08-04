import React from 'react';
export default class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    render() {
        
        return (
            <div id='feed'>
                <ul>
                    {this.props.posts.map(post => (
                        <li key={post.id}>
                            <h1>{post.data().title}</h1>
                            <h2>{post.data().body}</h2>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}