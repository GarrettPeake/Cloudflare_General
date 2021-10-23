import React from "react"
import Logo from '../resources/icon.png'

export default class AppBar extends React.Component {

    render() {
        return (
            <div className='flex w-full bg-gray-800 justify-between'>
                <div className='h-20 p-16 flex items-center'>
                    <img className='h-20' src={Logo} alt='Peake Social Logo'/>
                    <h1 className='pl-5 text-5xl text-white'>Peake Social</h1>
                </div>
            </div>
        )
    }
}