import React from "react"
import Carousel from './carousel'
import Comment from './comment'

export default class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: {name: '', pfp: '', loaded: false},
            data: props.content,
            editing: props.editing,
            liked: false,
            commenting: false
        };
        console.log(this.state.data);
        this.getCarousel = this.getCarousel.bind(this);
        this.toggleEditing = this.toggleEditing.bind(this);
        this.submit = this.submit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.like = this.like.bind(this);
        this.updateRemote = this.updateRemote.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.addImage = this.addImage.bind(this);
    }

    toggleEditing(){
        var current = this.state.editing
        this.setState({editing: !current});
    }

    /**
     * Called when you save your edits
     * Turns of editing move and updates the database
     */
    submit(){
        this.toggleEditing();
        this.updateRemote(true);
    }

    /**
     * Toggle the users liking of a post on or off
     * Updates the database with that like
     * If many users have the same post data, their liking and unliking will conflict
     */
    like(){
        this.setState({
            liked: !this.state.liked
        });
        this.updateRemote(false);
    }

    /**
     * Removes the selected image from the post
     */
    removeImage(event ){
        const target = event.target;
        const name = target.getAttribute('name');
        var newImages = this.state.data.images
        newImages.splice(parseInt(name), 1);
        var newData = { ...this.state.data, images: newImages };
        this.setState({
            data: newData
        });
    }

    /**
     * Adds a new blank image field to the post
     */
    addImage(){
        var newData = { ...this.state.data, images: this.state.data.images };
        newData.images.push('');
        this.setState({
            data: newData
        });
    }

    /**
     * Formats the post and pushes the changes to the DB
     */
    updateRemote(refresh){
        // Allow changing users by just changing path, since auth is not implemented
        const user = window.location.pathname.substr(1);
        // Remove empty images
        const newImages = this.state.data.images.filter(item => item);
        // Increment likes
        const newLikes = this.state.data.likes + this.state.liked
        // Add data.newComment
        var newComments = null
        if(this.state.data.newComment)
            newComments = this.state.data.comments.concat([{username: user, text: this.state.data.newComment}])
        // Assemble new object
        const newData = {
            username: user,
            location: this.state.data.location,
            images: newImages,
            text: this.state.data.text,
            likes: newLikes,
            comments: newComments || this.state.data.comments
        }
        // POST or PUT based on whether there's an ID the object to remote
        const METHOD = this.props.post_id ? 'PUT' : 'POST';
        console.log(METHOD);
        fetch("https://general.gepeake.workers.dev/posts/" + this.props.post_id, {
            method: METHOD,
            body: JSON.stringify(newData),
        }).then(response => response.json()).then(data => {
            console.log(data);
            if(refresh)
                document.location.reload();
        });
    }

    /**
     * Loads the user when the component is created
     */
     componentDidMount(){
        if (!this.state.user.loaded) {
            fetch("https://general.gepeake.workers.dev/users/" + this.state.data.username, {method: 'GET'})
            .then(response => response.json()).then(data => data.data.users[0]).then(data => {
                if(data !== null)
                    this.setState({
                        user: {
                            name: data.name,
                            pfp: data.pfp,
                            loaded: true
                        }
                    });
            });
        }
    }

    /**
     * Generates a side scrolling view of the images or a list of fields for editing
     * @returns A DOM node allowing viewing or editing of the post's associated images
     */
    getCarousel(){
        if(!this.state.editing){
            if(this.state.data.images)
                return (
                    <Carousel imgs={this.state.data.images}/>
                )
            else
                return null
        } else {
            return (
                <div className='flex flex-col mt-4'>
                    {
                        this.state.data.images.map((element, index) => {
                            return <div className='flex items-center'>
                                <input onChange={this.handleInputChange} className='mr-2 mb-4 rounded-lg p-1 bg-gray-600 text-gray-200 w-full ring-2 ring-purple-500' name={'image:'+index} value={element} placeholder='Enter the url for an image'/>
                                <button onClick={this.removeImage} className=''><i name={index} className="fas fa-trash-alt text-xl mb-4 text-purple-500"/></button>
                            </div>
                        })
                    }
                    <button onClick={this.addImage} className='rounded-lg p-1 bg-purple-500 text-gray-200 w-full'>Add another image</button>
                </div>
            )
        }
    }

    /**
     * Handles any form changes
     * Does special work to handle and identify image changes
     */
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        var newData = {}
        if(name.substr(0, 5) === 'image'){
            var currImages = this.state.data.images
            if(name.substr(6, name.length) === 'new'){
                currImages.push(value)
            } else{
                currImages[parseInt(name.substr(6, name.length))] = value
            }
            newData = { ...this.state.data, images: currImages };
        } else
            newData = { ...this.state.data, [name]: value };
        this.setState({
            data: newData
        });
    }

    render() { /** Tailwind isn't the best for readability */
        return (
            <div className='flex flex-col border-2 border-gray-900 my-4 w-full rounded-lg overflow-hidden items-center'>
                {!this.state.editing ? <> {/** Defines the body of the post when not in editing mode */}
                    <div className='w-full flex p-4 bg-gray-900 items-center'>
                        { this.state.user.loaded ? /** Loads the profile picture if the user is loaded */
                            <img alt='Poster profile' className='rounded-full w-12 h-12 mr-2' src={this.state.user.pfp}/>
                        : /** Uses a avatar template otherwise */
                            <div className='bg-gray-400 rounded-full w-12 h-12 flex items-center justify-center mr-2'>
                                <i className="fas fa-user text-gray-200 text-2xl text-center"/>
                            </div>
                        } {/** Now we do the headline, some HTML is repeated rather than having many this.state.editing ternary blocks*/}
                        <div className='flex flex-col'>
                            <div className='flex sm:flex-col'>
                                <p className=' text-gray-200 mr-1 text-xl'>{this.state.user.name}</p>
                                <p className=' text-gray-500'>@{this.state.data.username}</p>
                            </div>
                            <div className='flex items-center'>
                                <i className="fas fa-compass text-gray-400 mr-2"></i>
                                <p className=' text-gray-400'>{this.state.data.location}</p>
                            </div>
                        </div>
                        <button className='ml-auto' onClick={this.toggleEditing}><i className="fas fa-edit text-2xl text-gray-600"></i></button>
                    </div>
                    {/** Displays the body of the post */}
                    <div className='flex flex-col p-4 w-full'>
                        <p className='text-gray-200 border-l-2 p-2 text-left break-words'>{this.state.data.text}</p>
                        {this.getCarousel()}
                    </div>
                 </> : <> {/** Essentially the same HTML as above but with inputs and different formatting */}
                    <div className='w-full flex p-4 bg-gray-900 items-center'>
                        { this.state.user.loaded ?
                            <img alt='Poster profile' className='rounded-full w-12 h-12 mr-2 flex-none' src={this.state.user.pfp}/>
                        : <div className='bg-gray-400 flex-none rounded-full w-12 h-12 flex items-center justify-center mr-2'>
                            <i className="fas fa-user text-gray-200 text-2xl text-center"/>
                        </div> }
                        <div className='flex flex-col'>
                            <div className='flex sm:flex-col'>
                                <p className=' text-gray-200 mr-1 text-xl'>{this.state.user.name}</p>
                                <p className=' text-gray-500'>@{this.state.data.username}</p>
                            </div>
                            <div className='flex items-center'>
                                <i className="fas fa-compass text-gray-400 mr-2"></i>
                                <input type='text' name='location' onChange={this.handleInputChange} className=' pl-1 text-gray-400 sm:w-2/3 bg-gray-700 ring-purple-500 ring-2 rounded-md' value={this.state.data.location} placeholder='Add a location'/>
                            </div>
                        </div>
                        <button className='ml-auto' onClick={this.submit}><i className="fas fa-paper-plane text-2xl text-purple-500"></i></button>
                    </div>
                    <div className='flex flex-col p-4 w-full'>
                        <textarea type='text' name='text' onChange={this.handleInputChange} className='break-words text-gray-200 bg-gray-600 p-2 text-left ring-purple-500 ring-2 rounded-md' value={this.state.data.text} placeholder='Tell the world something!'/>
                        {this.getCarousel()}
                    </div>
                </>
                } {/** We now create the bar to display the comment and likes counts */}
                <div className='flex w-full items-baseline border-t-2 p-2 border-gray-900'>
                    <i className="fas fa-comments text-gray-200 ml-4"/>
                    <p className='ml-1 text-gray-200'>{this.state.data.comments.length}</p>
                    <button className='ml-4 flex items-center' onClick={this.like}>
                        {this.state.liked?
                        <i className="fas fa-heart text-red-200"></i>
                        : <i className=" far fa-heart text-red-200"/>}
                        <p className='ml-1 text-red-200'>{this.state.data.likes+this.state.liked}</p>
                    </button>
                </div>
                {/** Now we use a component to display the completed comments, comments aren't GUI editable */}
                { this.state.data.comments ? 
                    <div className='flex flex-col border-t-2 pt-4 border-gray-900 shadow-sm mb-2 w-full overflow-hidden'>
                            {this.state.data.comments.map((element,index) => {
                                return <Comment content={element} key={index}/>
                            })}
                    </div>
                    : null
                }
                <div className='px-4 mb-2 w-full box-border'>
                <button className='w-full bg-gray-600 text-gray-200 py-2 rounded-lg' onClick={()=>{this.setState({commenting: !this.state.commenting})}}>
                    <i className="fas fa-pen"/> {this.state.commenting ? 'Cancel comment' : 'Leave a comment'}
                </button>
                    {this.state.commenting ?
                        <div className='flex'> 
                        <textarea type='text' name='newComment' onChange={this.handleInputChange} className='w-full mt-2 mr-2 break-words text-gray-200 bg-gray-600 p-2 text-left ring-purple-500 ring-2 rounded-md' value={this.state.data.newComment || ''} placeholder='A penny for your thoughts?'/>
                        <button className='ml-auto' onClick={()=>{this.updateRemote(true); this.setState({commenting: false});}}><i className="fas fa-paper-plane text-2xl text-purple-500"></i></button>
                        </div>
                    : null}
                </div>
            </div>
            )
    }
}