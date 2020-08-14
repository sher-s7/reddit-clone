import React from 'react';
export default class NewGroupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    render() {
        return (
            <div id='newGroupModal'>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">
                        GROUP TITLE
                        <input type="text"/>
                    </label>
                    <label htmlFor="title">
                        GROUP DESCRIPTION
                        <input type="text"/>
                    </label>
                </form>
            </div>
        );
    }
}