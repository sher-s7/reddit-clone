import React from 'react';
import fire from './config/Fire';
import { Link } from 'react-router-dom';
export default class GroupsNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayGroupList: 'hidden'
        }
    }

    componentDidMount() {
        this.loadGroups();
    }

    handleClick = () => {
        this.props.currentUser ? this.props.setModal('group') : alert('Must be signed in to create new groups');
    }

    displayGroups = (className) => {
        this.setState({ displayGroupList: className });
        if (className === 'display') this.loadGroups();
    }

    loadGroups = () => {
        fire.auth().onAuthStateChanged((user) => {
            if (user) {
                fire.firestore().collection('users').doc(user.uid).get().then(userData => {
                    if (userData.data()) {
                        this.setState({
                            groups: userData.data().joinedGroups
                        })
                    } else {
                        this.setState({
                            groups: []
                        })
                    }
                })
            } else {
                fire.firestore().collection('groups').get().then(groupsData => {
                    this.setState({
                        groups: groupsData.docs
                    })
                })
            }
        })

    }

    render() {
        return (
            <div onMouseLeave={() => this.displayGroups('hidden')} id='groupList'>
                <button onClick={() => this.displayGroups('display')}>{this.props.currentUser ? 'Joined groups' : 'Groups'}</button>
                <ul className={this.state.displayGroupList}>
                    <li>
                        <button onClick={this.handleClick} className='newGroupButton'>
                            <i className="las la-plus-square"></i> Create a group
                        </button>
                    </li>
                    {this.state.groups && this.state.groups.length > 0
                        ? this.state.groups.map(group => <li key={group.id || group}><Link to={`/group/${group.id || group}`}>{group.id || group}</Link></li>)
                        : 'Joined groups will appear here'}
                </ul>
            </div>
        );
    }
}