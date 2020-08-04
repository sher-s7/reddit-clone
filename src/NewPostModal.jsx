import React from 'react';
import fire from './config/Fire';
import TextPostModal from './TextPostModal';
import ImagePostModal from './ImagePostModal';
import LinkPostModal from './LinkPostModal';
export default class NewPostModal extends React.Component {
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
        fire.firestore().collection('groups').get().then(groupsData => {
            groupsData.docs.forEach(doc =>
                arr.push(doc.id)
            )
            this.setState({ groups: arr, selectedGroup: arr[0] });
        });
    }

    dislpayModal = () => {
        console.log(this.state.tab)
        if (this.state.tab === 'text') {
            return <TextPostModal updateView={this.props.updateView} setModal={this.props.setModal} selectedGroup={this.state.selectedGroup}/>;
        } else if (this.state.tab === 'image') {
            return <ImagePostModal updateView={this.props.updateView} setModal={this.props.setModal} selectedGroup={this.state.selectedGroup}/>;
        } else if (this.state.tab === 'link') {
            return <LinkPostModal updateView={this.props.updateView} setModal={this.props.setModal} selectedGroup={this.state.selectedGroup}/>;
        } else {
            return null;
        }
    }

    render() {
        return (
            <div className='newPostModal'>
                <h3>Create a post</h3>
                <span>Select value: {this.state.selectedGroup}</span>
                <div>
                    <ul>
                        <li><button onClick={() => this.setState({ tab: 'text' })}>Text</button></li>
                        <li><button onClick={() => this.setState({ tab: 'image' })}>Image</button></li>
                        <li><button onClick={() => this.setState({ tab: 'link' })}>Link</button></li>
                    </ul>
                </div>
                <label htmlFor='groups'>Select a group</label>
                <select name='groups' onChange={(e) => this.setState({ selectedGroup: e.target.value })}>
                    {this.state.groups.map(group =>
                        <option key={group} value={group}>{group}</option>
                    )}
                </select>
                {this.dislpayModal()}
            </div>
        );
    }
}