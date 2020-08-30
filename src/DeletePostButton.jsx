import React from 'react';
import fire from './config/Fire';
import { withRouter } from 'react-router-dom';
class DeletePostButton extends React.Component {

    handleClick = () => {
        let confirm = window.confirm("Are you sure you want to delete this post?");
        const currentUser = fire.auth().currentUser;
        if (confirm && currentUser) {
            
            fire.firestore().collection('posts').doc(this.props.docId).get().then(docRef => {
                if (docRef.data().type=== 'image') {
                    fire.storage().ref(`users/${currentUser.uid}/${this.props.docId}/${docRef.data().imageName}`).delete();
                }
                fire.firestore().collection('posts').doc(this.props.docId).delete()
            }).then(() => {
                fire.firestore().collection('comments').where('postId', '==', this.props.docId).get().then(snapshot => {
                    snapshot.forEach(doc => {
                        if(doc.exists) fire.firestore().collection('comments').doc(doc.id).delete();
                    })
                }).then(() => {
                    this.props.updatePosts();                        
                }).catch(error => console.error(error.message))
                
            }).catch(error => console.error(error));
        }
    }

    render() {
        return (
            <button className='deletePostButton' onClick={this.handleClick}>
                Delete
            </button>
        );
    }
}

export default withRouter(DeletePostButton);