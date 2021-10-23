
import React from "react";
import Post from "../components/post";
import AppBar from "../components/appbar"

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], loaded: false};
    }

    render() {
        return (
            <>
                <AppBar />
                <div className="w-full flex items-center justify-center flex-col">
                    {this.state.loaded ?
                        this.state.posts.map(post => {
                            return <Post content={post} unique={[]}/>
                        }) 
                    : <p className='text-center'>Nothing to see yet, post something or check back later! </p> }
                </div>
            </>
        )
    }

    componentDidMount() {
        if (!this.state.loaded) {
            fetch("https://general.gepeake.workers.dev/posts", {method: 'GET'})
            .then(response => response.json()).then(data => {
                this.setState({
                    posts: data['data']['posts'],
                    loaded: true
                });
            });
        }
    }
}