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
        this.setState({displayGroupList: className});
        if(className==='display') this.loadGroups();
    }

    loadGroups = () => {
        fire.firestore().collection('groups').get().then(groupsData => {
            this.setState({
                groups: groupsData.docs
            })
        })
    }

    render() {
        return (
            <div onMouseLeave={() => this.displayGroups('hidden')} id='groupList'>
                <button onClick={() => this.displayGroups('display')}>Groups</button>
                <ul className={this.state.displayGroupList}>
                    <li>
                        <button onClick={this.handleClick} className='newGroupButton'>
                            <i className="las la-plus-square"></i> Create a group
                        </button>
                    </li>
                    {this.state.groups ? this.state.groups.map(group => <li key={group.id}><Link to={`/group/${group.id}`}>{group.id}</Link></li>) : null}
                </ul>
            </div>
        );
    }
}