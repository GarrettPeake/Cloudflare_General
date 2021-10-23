import React from "react"
import Carousel from './carousel'
import Comment from './comment'

export default class Post extends React.Component {

    constructor(props){
        super(props);
        this.state = {user: {name: 'NA', pfp: 'NA', loaded: false}, data: JSON.parse(props.content)};
        console.log(this.state.data)
        this.getCarousel = this.getCarousel.bind(this);
        this.urlifyBody = this.urlifyBody.bind(this);
    }

    componentDidMount(){
        if (!this.state.user.loaded) {
            fetch("https://general.gepeake.workers.dev/users/" + this.state.data.username, {method: 'GET'})
            .then(response => response.json()).then(data => JSON.parse(data.data.users[0])).then(data => {
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

    getCarousel(){
        if(this.state.data.images)
            return (
                <Carousel imgs={this.state.data.images}/>
            )
        else
            return null
    }

    urlifyBody() {
        // I stole this code!
        var urlRegex = /(https?:\/\/[^\s]+)/g;
        var elem = document.getElementById('textbody')
        elem.innerHTML = this.state.data.text.replace(urlRegex, function(url) {
                return <a href={url}>{url}</a>;
            })
      }

    render() {
        return (
            <div className='flex flex-col border-2 border-gray-900 rounded-lg shadow-sm mt-6 w-1/3 overflow-hidden items-center'>
                <div className='w-full flex p-4 bg-gray-900 items-center'>
                    { this.state.user.loaded ?
                        <img alt='Poster profile' className='rounded-full w-12 h-12 mr-2' src={this.state.user.pfp}/>
                    : <div className='bg-gray-400 rounded-full w-12 h-12 flex items-center justify-center mr-2'>
                        <i class="fas fa-user text-gray-200 text-2xl text-center"/>
                    </div> }
                    <div className='flex flex-col'>
                        <div className='flex items-center'>
                            <p className=' text-gray-200 mr-1 text-xl'>{this.state.user.name}</p>
                            <p className=' text-gray-500'>@{this.state.data.username}</p>
                        </div>
                        <div className='flex items-center'>
                            <i className="fas fa-compass text-gray-400 mr-2"></i>
                            <p className=' text-gray-400'>{this.state.data.location}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col p-4 w-full'>
                    <p className='text-gray-200 border-l-2 p-2 text-left'>{this.state.data.text}</p>
                    {this.getCarousel()}
                </div>
                <div className='flex w-full items-baseline border-t-2 border-b-2 p-2 border-gray-900'>
                    <i class="fas fa-comments text-gray-200 ml-4"/>
                    <p className='ml-1 text-gray-200'>{this.state.data.comments.length}</p>
                    <i className="ml-4 far fa-heart text-red-200"/>
                    <p className='ml-1 text-red-200'>{this.state.data.likes}</p>
                </div>
                <div className='flex flex-col shadow-sm mt-4 mb-2 w-full overflow-hidden'>
                    { this.state.data.comments ? 
                        this.state.data.comments.map(element => {
                            return <Comment content={element}/>
                        })
                        : null
                    }
                </div>
            </div>
        )
    }
}