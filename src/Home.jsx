import React from 'react';
import Feed from './Feed';

export default class Home extends React.Component {
    render() {
        return (
            <div>
                Hello home
                <Feed/>
            </div>
        );
    }
}