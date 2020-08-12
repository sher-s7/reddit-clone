import React from 'react';
import fire from './config/Fire';
import { withRouter } from 'react-router-dom';
class ImagePostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
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
                            this.props.history.push(`/${this.props.selectedGroup}/post/${docRef.id}`);
                        })
                    })
                });
            })
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
                        <input value={this.state.title} onChange={this.handleChange} type="text" name="title" id="titleInput" placeholder='Title' required />
                    </label>
                    <label htmlFor="image">
                        <input type='file' accept="image/png, image/jpeg" name="image" id="imageInput" ref={this.fileInput} required />
                    </label>
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default withRouter(ImagePostModal)