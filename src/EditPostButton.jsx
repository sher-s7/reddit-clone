import React from 'react';
export default class EditPostButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        return (
            <button onClick={() => this.props.editPost(true)}>
                Edit
            </button>
        );
    }
}