import React from 'react';
import fire from './config/Fire';

export default class Profile extends React.Component {
    render({match:{params:{userId}}}) {
        return (
            <div>
                a user profile
                {console.log(userId)}
            </div>
        );
    }
}


