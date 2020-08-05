import React from 'react';
import fire from './config/Fire';
import { Link } from 'react-router-dom';
export default class AllGroups extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
        let groupsArr = [];
        fire.firestore().collection('groups').get().then(groupsData => {
            groupsData.docs.forEach(group => {
                groupsArr.push(group.id)
            });
            this.setState({ groups: groupsArr })
        });
    }

    displayGroups = () => {
        return (
            <div>
                All Groups
                {this.state.groups.map(group => 
                    <Link key={group} to={`/group/${group}`}>{group}</Link>
                )}
            </div>

        )
    }

    render() {
        return (
            this.state.groups ? this.displayGroups() : <span>Loading</span>
        );
    }
}