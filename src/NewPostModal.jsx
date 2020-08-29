import React from 'react';
import fire from './config/Fire';
import TextPostModal from './TextPostModal';
import ImagePostModal from './ImagePostModal';
import LinkPostModal from './LinkPostModal';
import { withRouter } from 'react-router-dom';

class NewPostModal extends React.Component {
    _isMounted = false;
    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.tab || 'text',
            groups: [],
            selectedGroup: ''
        }
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        this._isMounted = true;
        let arr = [];
        let path = this.props.location.pathname.split('/');
        fire.firestore().collection('groups').get().then(groupsData => {
            if (this._isMounted) {
                groupsData.docs.forEach(doc =>
                    arr.push(doc.id)
                )
                path.includes('group') ? this.setState({ groups: arr, selectedGroup: path[path.length - 1] }) :
                    this.setState({ groups: arr, selectedGroup: arr[0] });
            }
        });
        document.addEventListener('mousedown', this.handleClickOutside);
        document.addEventListener('touchstart', this.handleClickOutside);
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.removeEventListener('mousedown', this.handleClickOutside);
        document.removeEventListener('touchstart', this.handleClickOutside);
    }

    handleClickOutside(event) {
        if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(event.target)) {
            this.props.setModal();
        }
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
            <div className='newPostModal' ref={this.wrapperRef}>
                <button className='closeModal' onClick={() => this.props.setModal(null)}> ╳ </button>
                <h3>CREATE A POST</h3>
                <div id='postTypeTab'>
                    <ul>
                        <li><button className={this.state.tab === 'text' ? 'selectedTab' : ''} onClick={() => this.setState({ tab: 'text' })}>TEXT</button></li>
                        <li><button className={this.state.tab === 'image' ? 'selectedTab' : ''} onClick={() => this.setState({ tab: 'image' })}>IMAGE</button></li>
                        <li><button className={this.state.tab === 'link' ? 'selectedTab' : ''} onClick={() => this.setState({ tab: 'link' })}>LINK</button></li>
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