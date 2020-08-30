import React from 'react';
import fire from './config/Fire';
import firebase from 'firebase/app';
import { withRouter } from 'react-router-dom';

class NewGroupModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
            validations: 'hidden',
            name: '',
            desc: ''
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (fire.auth().currentUser) {
            fire.firestore().collection('groups').doc(this.state.name).set({
                description: this.state.desc,
                createdBy: fire.auth().currentUser.displayName,
                numberOfUsers: 1
            })
                .then(() => {
                    fire.firestore().collection('users').doc(fire.auth().currentUser.uid).update({
                        createdGroups: firebase.firestore.FieldValue.arrayUnion(this.state.name),
                        joinedGroups: firebase.firestore.FieldValue.arrayUnion(this.state.name)
                    })
                }).then(() => {
                    this.props.setModal();
                    this.props.history.push(`/group/${this.state.name}`);
                }).catch(error => console.error(error));
        } else {
            alert('Must be signed in to create a group');
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    showValidations = () => {
        this.setState({
            validations: ''
        })
    }
    hideValidations = () => {
        
        this.setState({
            validations: 'hidden'
        })
    }

    render() {
        return (
            <div id='newGroupModal'>
                <button className='closeModal' onClick={() => this.props.setModal(null)}> ╳ </button>
                <div id='groupInfoContainer'>
                    <div>
                        <i onMouseEnter={this.showValidations} onMouseLeave={this.hideValidations} className="las la-info-circle"></i>
                        <p className={`validationInfo ${this.state.validations}`}>Name must be between 3 to 25 characters long. Whitespace and special characters are not allowed, except for underscores.</p>
                    </div>
                </div>
                <h2>CREATE A GROUP</h2>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor="title">
                        Name
                        <input pattern="^[A-Za-z_]{3,25}$" required name='name' onChange={this.handleChange} value={this.state.title} type="text" />
                    </label>
                    <label htmlFor="desc">
                        <span>Description</span>
                        <input required name='desc' maxLength={129} onChange={this.handleChange} value={this.state.desc} type="text" />
                    </label>
                    <input type="submit" value="Create group" />
                </form>
            </div>
        );
    }
}

export default withRouter(NewGroupModal);