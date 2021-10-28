
import React from "react";
import Post from "../components/post";
import AppBar from "../components/appbar"

export default class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {posts: [], loaded: false, adding: false};
    }

    render() {
        const visitor = window.location.pathname.substr(1) || '' // Handles 'login'
        return (
            <>
                <AppBar />
                <div className="w-5/12 lg:w-2/3 md:w-5/6 sm:w-11/12 mx-auto flex items-center justify-center flex-col overflow-y-auto overflow-x-hidden">
                    <button className='w-full mt-4 mb-2 bg-purple-500 text-gray-200 py-2 rounded-lg' onClick={()=>{this.setState({adding: !this.state.adding})}}>
                        <i className="fas fa-pen"/> {this.state.adding ? 'Cancel post' : 'Create a new post'}
                    </button>
                    {this.state.adding ?
                        <Post post_id={''} content={{
                            username: visitor,
                            location: "",
                            images: [''],
                            text: "",
                            likes: 0,
                            comments: []
                        }} editing={true}/>
                    : null} {/** Add a temporary editable post whose submit will trigger POST */}
                    {this.state.loaded ?
                        this.state.posts.sort((a,b) => {
                            return b.date - a.date // Sort in reverse chronological order
                        }).map(post => {
                            return <Post content={post} editing={false} post_id={post.post_key} visitor={visitor} key={post.post_key}/>
                        })
                    : <p className='text-center'>Loading posts...</p> }
                </div>
            </>
        )
    }

    componentDidMount() {
        if (!this.state.loaded) {
            fetch("https://general.gepeake.workers.dev/posts", {method: 'GET'})
            .then(response => response.json()).then(data => {
                this.setState({
                    posts: Object.keys(data.data.posts).map(post_key => { 
                        // Turn the dict into a list of dict with the keys included to allow for sorting
                        var post_with_key = data.data.posts[post_key];
                        post_with_key.post_key = post_key
                        return post_with_key
                    }),
                    loaded: true
                });
            });
        }
    }
}