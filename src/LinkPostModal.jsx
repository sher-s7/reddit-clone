import React from 'react';
import fire from './config/Fire';
import { withRouter } from 'react-router-dom';
class LinkPostModal extends React.Component {
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
            username: fire.auth().currentUser.displayName,
            group: this.props.selectedGroup,
        }).then((post) => {
            this.props.setModal();
            this.props.history.push(`/${this.props.selectedGroup}/post/${post.id}`);
        })
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

export default withRouter(LinkPostModal)