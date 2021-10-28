import React from "react"
import Logo from '../resources/icon.png'

export default class AppBar extends React.Component {

    render() {
        return (
            <div className='title-font flex items-center w-full p-4 bg-gray-800'>
                <img className='h-20' src={Logo} alt='Peake Social Logo'/>
                <h1 className='pl-5 text-5xl text-white sm:text-4xl'>Peake Social</h1>
            </div>
        )
    }
}