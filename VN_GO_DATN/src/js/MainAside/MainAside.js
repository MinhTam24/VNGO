import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Main from '../Main/Main'
import Aside from '../Aside/Aside'
export class MainAside extends Component {
  render() {
    return (
      <>
        <Outlet />
        <Aside />
      </>
    )
  }
}

export default MainAside