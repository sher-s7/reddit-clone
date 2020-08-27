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
        this.props.showLoader();
        fire.firestore().collection('groups').get().then(groupsData => {
            groupsData.docs.forEach(group => {
                groupsArr.push(group.id)
            })
            this.setState({ groups: groupsArr })
        }).then(this.props.hideLoader);
    }

    displayGroups = () => {
        return (
            <div className='allGroups'>
                <h2>All Groups</h2>
                <div id='allGroupsList'>
                    {this.state.groups.map(group =>
                        <Link key={group} to={`/group/${group}`}>{group}</Link>
                    )}
                </div>
            </div>

        )
    }

    render() {
        return (
            this.state.groups ? this.displayGroups() : null
        );
    }
}