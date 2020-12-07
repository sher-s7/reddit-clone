import React from 'react';
export default class NewPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <div className='newPostContainer'>
                <h3>CREATE A NEW POST</h3>
                <button onClick={() => this.props.setModal('text')} className='newPostButton text'>TEXT</button>
                <button onClick={() => this.props.setModal('image')} className='newPostButton image'>IMAGE</button>
                <button onClick={() => this.props.setModal('link')} className='newPostButton link'>LINK</button>
            </div>
        );
    }
}