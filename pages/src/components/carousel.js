import React from "react"

export default class Carousel extends React.Component {

    constructor(props){
        super(props);
        this.state = {blowup: null}
        this.blowup = this.blowup.bind(this);
    }

    blowup(event){
        const target = event.target;
        const name = target.name;
        this.setState({blowup: name});
    }

    render() {
        return (
            <div className='mt-6 overflow-hidden p-1 rounded-lg'>
                <div className='flex overflow-y-hidden rounded-lg overflow-x-auto mb-1 h-full'>
                    {
                        this.props.imgs.map((element, index) => { // Allow each image to blowup and fill screen
                            return <button key={index} onClick={this.blowup} className=' flex-none h-36 mr-2 mb-1 rounded-lg'>
                                <img alt='Post media' name={element} className='h-full w-full rounded-lg' src={element}/>
                            </button>
                        })
                    }
                </div>
                { this.state.blowup ? // Fill the screen with the image, onclick set blowup to null
                    <button onClick={this.blowup} name={null} className='fixed h-full w-full z-50 bg-opacity-60 bg-gray-500 left-0 top-0 flex items-center justify-center'>
                        <img alt='Post media' className='h-2/3 rounded-lg' src={this.state.blowup}/>
                    </button>
                : null}
            </div>
        )
    }
}