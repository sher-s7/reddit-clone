/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';
class Settings extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            currentUser: null,
            currentPassword: '',
            newPassword: '',
            password: '',
        }

        this.fileInput = React.createRef();
    }

    componentDidMount() {
        this._isMounted = true;
        this.authListener();
    }


    authListener() {
        fire.auth().onAuthStateChanged((user) => {
            if (this._isMounted && user) {
                this.setState({ currentUser: user, profilePicture: user.photoURL });
                fire.firestore().collection('users').doc(user.uid).get().then(userRef => {
                    if (userRef.data()) {
                        this.setState({ joinedGroups: userRef.data().joinedGroups });
                    }
                })
            } else {
                this.props.history.push('/')
            }
        });
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    handleProfilePic = (e) => {
        e.preventDefault();
        const currentUser = this.state.currentUser;
        const size = this.fileInput.current.files[0].size / Math.pow(1024, 2);
        const fileExtension = this.fileInput.current.files[0].type;
        const acceptedTypes = ['image/jpeg', 'image/png']
        if (!currentUser) {
            alert('Must be logged in to post');
        } else if (size > 20) {
            alert('File must be less than 20MB');

        } else if (!acceptedTypes.includes(fileExtension)) {
            alert('File must be a PNG or JPG image')
        } else {
            fire.storage().ref(`users/${currentUser.uid}/profilePicture.png`).put(this.fileInput.current.files[0]).then(snapshot => {
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
                this.setState({ passwordSuccess: 'Successfully changed password.', currentPassword: '', newPassword: '' })
            }).catch((error) => { this.setState({ passwordSuccess: error.message }) });
        }).catch((error) => { this.setState({ passwordSuccess: error.message }) });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    deleteAccount = (e) => {
        console.log(this.state.joinedGroups)
        e.preventDefault();
        let confirm = window.confirm("Are you sure you want to delete your account?");
        if (confirm) {
            const password = this.state.password;
            this.reauthenticate(password).then(() => {
                const user = fire.auth().currentUser;
                this.state.joinedGroups.forEach(group => {
                    fire.firestore().collection('groups').doc(group).update({
                        numberOfUsers: firebase.firestore.FieldValue.increment(-1)
                    });
                });
                fire.firestore().collection('users').doc(user.uid).delete().then(() => {
                    user.delete()
                        .then(this.props.history.push('/'))
                        .catch(error => this.setState({ deleteFail: error.message }));
                });
            }).catch((error) => { this.setState({ deleteFail: error.message }) });
        }
    }

    deletePicture = () => {
        let confirm = window.confirm("Are you sure you want to remove your profile picture?");
        if (confirm) {
            fire.storage().ref(`users/${this.state.currentUser.uid}/profilePicture.png`).delete().catch(error => console.error(error.message));
            fire.storage().ref('defaultProfilePicture.png').getDownloadURL().then(url => {
                fire.auth().currentUser.updateProfile({
                    photoURL: url
                }).catch(error => console.error(error.message));
                fire.firestore().collection('users').doc(fire.auth().currentUser.uid).update({
                    photoUrl: url
                }).catch(error => console.error(error.message));
                this.setState({ profilePicture: url })
            });

        }
    }

    render() {
        return (
            <div id='settings'>
                <h1 className='feedHeading'>SETTINGS</h1>
                <div id='settingsContainer'>
                    <div id='imageFormContainer'>
                        <form onSubmit={this.handleProfilePic}>
                            <h2>Update profile picture</h2>
                            <label htmlFor='profilePicture'>
                                <div id='profilePictureContainer'>
                                    <img src={this.state.profilePicture ? this.state.profilePicture : ''} alt='Profile picture' />
                                </div>
                                <input required type='file' accept="image/png, image/jpeg" name="profilePicture" id="imageInput" ref={this.fileInput} size='10' />
                            </label>
                            <input type="submit" value="Submit" />
                            <p>{this.state.success ? 'Profile picture updated.' : null}</p>
                        </form>
                        <button onClick={this.deletePicture}>Remove profile picture</button>
                    </div>

                    <form onSubmit={this.changePassword}>
                        <h2>Change password</h2>
                        <label htmlFor="currentPassword">
                            Current password:
                        <input required value={this.state.currentPassword} onChange={this.handleChange} type="password" name='currentPassword' />
                        </label>
                        <label htmlFor="newPassword">
                            New password:
                        <input required value={this.state.newPassword} onChange={this.handleChange} type="password" name='newPassword' />
                        </label>
                        <input type="submit" value="Submit" />
                        <p>{this.state.passwordSuccess ? this.state.passwordSuccess : null}</p>
                    </form>

                    <form onSubmit={this.deleteAccount}>
                        <h2>Delete account</h2>
                        <label htmlFor="password">
                            Password:
                        <input required value={this.state.password} onChange={this.handleChange} type="password" name='password' />
                        </label>
                        <input type="submit" value="Delete account" />
                        <p>{this.state.deleteFail}</p>
                    </form>
                </div>
            </div>
        );
    }
}

export default withRouter(Settings);