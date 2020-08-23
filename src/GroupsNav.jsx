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
        this.displayGroups();
        this.props.currentUser ? this.props.setModal('group') : alert('Must be signed in to create new groups');
    }

    displayGroups = () => {
        if (this.state.displayGroupList === 'hidden') {
            this.loadGroups();
            this.setState({ displayGroupList: 'display' });
        } else {
            this.setState({ displayGroupList: 'hidden' });
        }
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
            <div id='groupList'>
                <button onClick={this.displayGroups}>Groups</button>
                <ul className={this.state.displayGroupList}>
                    <li>
                        <button onClick={this.handleClick} className='newGroupButton'>
                        <i class="las la-plus"/> Create a group
                        </button>
                    </li>
                    {fire.auth().currentUser ? <h3>Joined groups</h3> : null}
                    {this.state.groups && this.state.groups.length > 0
                        ? this.state.groups.map(group => <li onClick={this.displayGroups} key={group.id || group}><Link to={`/group/${group.id || group}`}>{group.id || group}</Link></li>)
                        : 'Joined groups will appear here'}
                    {fire.auth().currentUser ? <li id='allGroups'><Link to='/groups'>All groups</Link></li> : null}
                </ul>
            </div>
        );
    }
}