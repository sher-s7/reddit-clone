import React from 'react';
import fire from './config/Fire';
import { withRouter } from 'react-router-dom';
class ImagePostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            disabled: false,
        }

        this.fileInput = React.createRef();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const currentUser = fire.auth().currentUser;
        const size = this.fileInput.current.files[0].size / Math.pow(1024, 2);
        if (!currentUser) {
            alert('Must be logged in to post');
        } else if (size > 20) {
            alert('File must be less than 20MB');
        } else {
            this.setState({disabled: true});
            fire.firestore().collection('posts').add({
                type: 'image',
                dateCreated: new Date(),
                points: 0,
                title: this.state.title,
                uid: currentUser.uid,
                username: currentUser.displayName,
                group: this.props.selectedGroup,
                imageName: this.fileInput.current.files[0].name,
                commentCount: 0,
                votes: {}
            }).then(docRef => {
                fire.storage().ref(`users/${currentUser.uid}/${docRef.id}/${this.fileInput.current.files[0].name}`).put(this.fileInput.current.files[0]).then(snapshot => {
                    snapshot.ref.getDownloadURL().then(url => {
                        docRef.update({
                            image: url
                        }).then(() => {
                            this.props.setModal();
                            this.props.history.push(`/group/${this.props.selectedGroup}/post/${docRef.id}`);
                        })
                    })
                });
            }).catch(error => {
                console.error(error.message);
                this.setState({disabled: false})
            });
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div id='imageModal'>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">
                        <input maxLength={300} value={this.state.title} onChange={this.handleChange} type="text" name="title" id="titleInput" placeholder='Title' required />
                    </label>
                    <label htmlFor="image">
                        <input type='file' accept="image/png, image/jpeg" name="image" id="imageInput" ref={this.fileInput} required />
                    </label>
                    <input disabled={this.state.disabled} type="submit" value="POST" />
                </form>
            </div>
        );
    }
}

export default withRouter(ImagePostModal)