import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
export default class Settings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentPassword: '',
            newPassword: '',
        }

        this.fileInput = React.createRef();
    }

    componentDidMount() {
        this.authListener();
    }


    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ currentUser: user, profilePicture: user.photoURL });
            } else {
                this.setState({ currentUser: null });
            }
        });
    }

    handleProfilePic = (e) => {
        e.preventDefault();
        const currentUser = this.state.currentUser;
        const fileExtension = this.fileInput.current.files[0].name.split('.').pop();
        const size = this.fileInput.current.files[0].size / Math.pow(1024, 2);
        if (!currentUser) {
            alert('Must be logged in to post');
        } else if (size > 20) {
            alert('File must be less than 20MB');
        } else {
            fire.storage().ref(`users/${currentUser.uid}/profilePicture.${fileExtension}`).put(this.fileInput.current.files[0]).then(snapshot => {
                snapshot.ref.getDownloadURL().then(url => {
                    currentUser.updateProfile({
                        photoURL: url
                    });
                    fire.firestore().collection('users').doc(currentUser.uid).update({
                        photoUrl: url
                    }).then(this.setState({ success: true }));
                    this.setState({ profilePicture: url })
                });
            }).catch(error => alert(error));
        }
    }

    reauthenticate = (currentPassword) => {
        const user = fire.auth().currentUser;
        const cred = firebase.auth.EmailAuthProvider.credential(
            user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    changePassword = (e) => {
        e.preventDefault();
        const currentPassword = this.state.currentPassword;
        const newPassword = this.state.newPassword
        this.reauthenticate(currentPassword).then(() => {
            const user = fire.auth().currentUser;
            user.updatePassword(newPassword).then(() => {
                this.setState({passwordSuccess: 'Successfully changed password.', currentPassword: '', newPassword: ''})
            }).catch((error) => { this.setState({passwordSuccess: error.message}) });
        }).catch((error) => { this.setState({passwordSuccess: error.message}) });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div id='settings'>
                <h1>Settings</h1>
                <form onSubmit={this.handleProfilePic}>
                    <label htmlFor='profilePicture'>
                        <img src={this.state.profilePicture ? this.state.profilePicture : 'loading'} alt='profile pic' width={'150px'} />
                        <input required type='file' accept="image/png, image/jpeg" name="profilePicture" id="imageInput" ref={this.fileInput} required />
                    </label>
                    <input type="submit" value="Submit" />
                    <p>{this.state.success ? 'Profile picture updated.' : null}</p>
                </form>

                <form onSubmit={this.changePassword}>
                    <label htmlFor="currentPassword">
                        Current password:
                        <input required value={this.state.currentPassword} onChange={this.handleChange} type="password" name='currentPassword'/>
                    </label>
                    <label htmlFor="newPassword">
                        New password:
                        <input required value={this.state.newPassword} onChange={this.handleChange} type="password" name='newPassword'/>
                    </label>
                    <input type="submit" value="Submit" />
                    <p>{this.state.passwordSuccess ? this.state.passwordSuccess : null}</p>
                </form>
            </div>
        );
    }
}