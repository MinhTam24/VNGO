import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Nav from '../Nav/Nav';
import MainAside from '../MainAside/MainAside';
export class Section extends Component {
    render() {
        return (
            <> 
            <section className="container-fluid">
                <div className='row'>
                    <Nav />
                    <Outlet />
                </div>
            </section>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" /></>
        )
    }
}

export default Section