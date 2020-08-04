import React from 'react';
import fire from './config/Fire';
export default class LinkPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            link: '',
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        fire.firestore().collection('posts').add({
            type: 'link',
            link: this.state.link,
            dateCreated: new Date(),
            points: 0,
            title: this.state.title,
            uid: fire.auth().currentUser.uid,
            group: this.props.selectedGroup,
        }).then(this.props.updateView).then(this.props.setModal)
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    render() {
        return (
            <div id='linkModal'>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">
                        <input value={this.state.title} onChange={this.handleChange} type="text" name="title" id="titleInput" placeholder='Title' required />
                    </label>
                    <label htmlFor="link">
                        <input value={this.state.link} type='text' onChange={this.handleChange} name="link" id="linkInput" placeholder='Url' required/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}