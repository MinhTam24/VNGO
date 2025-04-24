import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Section from './Sections';
import Header from '../Header/Header';
import Nav from '../Nav/Nav';
import MainAside from '../MainAside/MainAside';
export class Home extends Component {
    render() {
        return (
            <>
                <Header />
                <Outlet />
            </>
        )
    }
}

export default Home