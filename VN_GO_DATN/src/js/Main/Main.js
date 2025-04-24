import React, { Component } from 'react'
import '../../css/Main.css';
import CreatPost from './CreatePost';
import Post from './Post';

export class Main extends Component {
    render() {
        return (
            <>
                <main className="main col-sm-6 py-2 ">
                    <CreatPost />
                    <Post />
                </main>
            </>
        )
    }
}

export default Main