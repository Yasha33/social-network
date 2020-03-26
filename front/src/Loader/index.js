import React from 'react'
import './style.css'

export default props => {
    return (
        <div className='loader'>
            <div className='lds-roller'>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
    )
}