import React from 'react';
export default class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div>
                <h3>Create a new post</h3>
                <button onClick={() => this.props.setModal('textPost')} className='newPostButton'>TEXT</button>
                <button onClick={() => this.props.setModal('imagePost')} className='newPostButton'>IMAGE</button>
                <button onClick={() => this.props.setModal('linkPost')} className='newPostButton'>LINK</button>
            </div>
        );
    }
}