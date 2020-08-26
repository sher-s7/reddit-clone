import React from 'react';
import ToastSVG from './assets/toast.svg'
export default class Toast extends React.Component {

    render() {
        return (
            <img id='logo' src={ToastSVG} alt="Toast icon"/>
        );
    }
}