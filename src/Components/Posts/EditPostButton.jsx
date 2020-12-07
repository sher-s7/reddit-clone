import React from 'react';
export default class EditPostButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <button className='editPostButton' onClick={() => this.props.editPost(true)}>
                Edit
            </button>
        );
    }
}