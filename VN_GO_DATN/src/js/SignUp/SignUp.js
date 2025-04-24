import React, { Component } from 'react'
import '../../css/SignInUp.css';
import Background from './Background';
import { Outlet } from 'react-router-dom';
import "../../css/Hobby.css";

export class SignUp extends Component {
    render() {
        return (
            <>
                <div className="row ht-100v flex-row-reverse no-gutters">
                
                    <div className="col-md-6 d-flex flex-column justify-content-center align-items-center">
                    <Outlet />
                    </div>
                    <Background />
                </div>
            </>
        )
    }
}

export default SignUp