
import React from "react";
import Post from "../components/post";
import AppBar from "../components/appbar"

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: {}, loaded: false, adding: false};
    }

    render() {
        return (
            <>
                <AppBar />
                <div className="w-5/12 lg:w-2/3 md:w-5/6 sm:w-11/12 mx-auto flex items-center justify-center flex-col overflow-y-auto overflow-x-hidden">
                    <button className='w-full mt-4 mb-2 bg-purple-500 text-gray-200 py-2 rounded-lg' onClick={()=>{this.setState({adding: !this.state.adding})}}>
                        <i className="fas fa-pen"/> {this.state.adding ? 'Cancel post' : 'Create a new post'}
                    </button>
                    {this.state.adding ?
                        <Post post_id={''} content={{
                            username: "auth_placeholder",
                            location: "",
                            images: [''],
                            text: "",
                            likes: 0,
                            comments: []
                        }} editing={true}/>
                    : null}
                    {this.state.loaded ?
                        Object.keys(this.state.posts).map(post_key => {
                            return <Post content={this.state.posts[post_key]} editing={false} post_id={post_key} key={post_key}/>
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
                console.log(data)
                this.setState({
                    posts: data.data.posts,
                    loaded: true
                });
            });
        }
    }
}