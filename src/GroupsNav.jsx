import React from 'react';
import fire from './config/Fire';
import { Link } from 'react-router-dom';
export default class GroupsNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        fire.firestore().collection('groups').get().then(groupsData => {
            this.setState({
                groups: groupsData.docs
            })
        })
    }

    render() {
        return (
            <ul>
                {this.state.groups ? this.state.groups.map(group => <li key={group.id}><Link to={`/group/${group.id}`}>{group.id}</Link></li>) : null}
            </ul>
        );
    }
}