import React from "react"

export default class Carousel extends React.Component {

    render() {
        return (
            <div className='mt-6 overflow-hidden h-20 p-1 rounded-lg'>
                <div className='flex overflow-y-hidden mb-1 overflow-x-auto h-full rounded-lg'>
                    {
                        this.props.imgs.map(element => {
                            return <img alt='Post media' className='mr-2 mb-1 rounded-lg' src={element}/>
                        })
                    }
                </div>
            </div>
        )
    }
}