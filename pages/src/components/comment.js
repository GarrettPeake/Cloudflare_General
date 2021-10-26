import React from "react"

export default class Comment extends React.Component {

    constructor(props){
        super(props);
        this.state = {user: {name: '', pfp: '', loaded: false}, data: props.content};
    }

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

    render() {
        return (
            <div className='ml-4 border-l-2 border-gray-500 mt-2 mb-2'>
                <div className='w-full flex ml-2 items-center'>
                    { this.state.user.loaded ?
                        <img alt='Poster profile' className='rounded-full w-6 h-6 mr-2' src={this.state.user.pfp}/>
                    : <div className='bg-gray-400 rounded-full w-6 h-6 flex items-center justify-center mr-2'>
                        <i className="fas fa-user text-gray-200 text-sm text-center"/>
                    </div> }
                    <div className='flex flex-col'>
                        <div className='flex items-baseline'>
                            <p className=' text-gray-200 text-sm mr-1'>{this.state.user.name}</p>
                            <p className=' text-gray-500 text-xs'>@{this.state.data.username}</p>
                        </div>
                    </div>
                </div>
                <div className='flex flex-col p-1 ml-2 w-full'>
                    <p className='text-gray-200 p-2 text-left'>{this.state.data.text}</p>
                </div>
            </div>
        )
    }
}