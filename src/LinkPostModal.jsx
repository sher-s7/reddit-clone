import React from 'react';
import fire from './config/Fire';
import { withRouter } from 'react-router-dom';
class LinkPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            link: '',
            disabled: false,
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const currentUser = fire.auth().currentUser;
        if (!currentUser) {
            alert('Must be logged in to post')
        } else {
            this.setState({disabled: true});
            fire.firestore().collection('posts').add({
                type: 'link',
                link: this.state.link,
                dateCreated: new Date(),
                points: 0,
                title: this.state.title,
                uid: currentUser.uid,
                username: currentUser.displayName,
                group: this.props.selectedGroup,
                commentCount: 0,
                votes: {}
            }).then((post) => {
                this.props.setModal();
                this.setState({disabled: false});
                this.props.history.push(`/group/${this.props.selectedGroup}/post/${post.id}`);
            })
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div id='linkModal'>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">
                        <input maxLength={300} value={this.state.title} onChange={this.handleChange} type="text" name="title" id="titleInput" placeholder='Title' required />
                    </label>
                    <label htmlFor="link">
                        <input maxLength={2000} value={this.state.link} type='text' onChange={this.handleChange} name="link" id="linkInput" placeholder='Url' required />
                    </label>
                    <input disabled={this.state.disabled} type="submit" value="POST" />
                </form>
            </div>
        );
    }
}

export default withRouter(LinkPostModal)