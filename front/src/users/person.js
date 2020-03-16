import React from 'react'

const Person = props => (
    <div className="person" >
        <img src={props.photo} alt="user" />
        <p>{props.name}</p>
        <p>{props.status}</p>
        <button className="personButton" onClick={props.changeRelation}>
            {props.status === 'friend' ? 'Remove friend' : props.status === 'outgoing' || props.status === 'incoming'
                ? 'Cancel request' : 'Add friend'}
        </button>
    </div>
);

export default Person
