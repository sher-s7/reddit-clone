import React from 'react';
export default class EditCommentButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render() {
        return (
            <button className='editCommentButton' onClick={() => {
                this.props.editComment(true);
                this.props.showReplyBox(false);
                }}>
                Edit
            </button>
        );
    }
}