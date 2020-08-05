import React from 'react';
import fire from './config/Fire';
import TextPostModal from './TextPostModal';
import ImagePostModal from './ImagePostModal';
import LinkPostModal from './LinkPostModal';
import { withRouter } from 'react-router-dom';

class NewPostModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.tab || 'text',
            groups: [],
            selectedGroup: ''
        }
    }

    componentDidMount() {
        let arr = [];
        let path = this.props.location.pathname.split('/');
        fire.firestore().collection('groups').get().then(groupsData => {
            groupsData.docs.forEach(doc =>
                arr.push(doc.id)
            )
            path.includes('group') ? this.setState({ groups: arr, selectedGroup: path[path.length - 1] }) :
                this.setState({ groups: arr, selectedGroup: arr[0] });
        });
    }

    dislpayModal = () => {
        if (this.state.tab === 'text') {
            return <TextPostModal updateView={this.props.updateView} setModal={this.props.setModal} selectedGroup={this.state.selectedGroup} />;
        } else if (this.state.tab === 'image') {
            return <ImagePostModal updateView={this.props.updateView} setModal={this.props.setModal} selectedGroup={this.state.selectedGroup} />;
        } else if (this.state.tab === 'link') {
            return <LinkPostModal updateView={this.props.updateView} setModal={this.props.setModal} selectedGroup={this.state.selectedGroup} />;
        } else {
            return null;
        }
    }

    render() {

        return (
            <div className='newPostModal'>
                <h3>Create a post</h3>
                <div>
                    <ul>
                        <li><button onClick={() => this.setState({ tab: 'text' })}>Text</button></li>
                        <li><button onClick={() => this.setState({ tab: 'image' })}>Image</button></li>
                        <li><button onClick={() => this.setState({ tab: 'link' })}>Link</button></li>
                    </ul>
                </div>
                <label htmlFor='groups'>Select a group</label>
                <select value={this.state.selectedGroup} name='groups' onChange={(e) => this.setState({ selectedGroup: e.target.value })}>
                    {this.state.groups.map(group =>
                        <option key={group} value={group}>{group}</option>
                    )}
                </select>
                {this.dislpayModal()}
            </div>
        );
    }
}

export default withRouter(NewPostModal);