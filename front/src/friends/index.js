import React from 'react'
import queryString from 'query-string'
import {withRouter} from 'react-router-dom'

import api from '../constants/api';
import './friends.css'

class Friends extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            id: null,
            incoming: [],
            outgoing: [],
            friends: [],
        }
    }

    componentDidMount() {
        const { id } = this.props.history.location.state;

        fetch(`${api.getAllUsers}?${queryString.stringify({id})}`,{
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(response => {
            this.setState({
                id,
                incoming: response.filter(el => el.relation === 'incoming'),
                outgoing: response.filter(el => el.relation === 'outgoing'),
                friends: response.filter( el => el.relation === 'friend')
            });
        });
    }

    changeRelation(id) {
        fetch(`${api.changeRelations}?${queryString.stringify({
            sourceId: this.state.id, targetId: id})}`,{
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(response => {
            this.setState({
                incoming: response.filter(el => el.relation === 'incoming'),
                outgoing: response.filter(el => el.relation === 'outgoing'),
                friends: response.filter( el => el.relation === 'friend')
            });
        });
    }

    changeRelationAddFriend(id) {
        fetch(`${api.changeRelations}?${queryString.stringify({
            sourceId: this.state.id, targetId: id, addFriend: true})}`,{
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(response => {
            this.setState({
                incoming: response.filter(el => el.relation === 'incoming'),
                outgoing: response.filter(el => el.relation === 'outgoing'),
                friends: response.filter( el => el.relation === 'friend')
            });
        });
    }

    render() {
        return (
            <div className='friends'>
                <h1>Pending requests</h1>
                <h2>Incoming</h2>
                {
                    this.state.incoming.map((value, index) => {
                        return <div className='person' key={index}>
                            <img src={value.photo} alt="user" />
                            <p>{value.login}</p>
                            <button className="personButton friendsButton" onClick={this.changeRelationAddFriend.bind(this, value.id)}>Accept</button>
                            <button className="personButton friendsButton" onClick={this.changeRelation.bind(this, value.id)} >Ignore</button>
                        </div>
                    })
                }
                <h2>Outgoing</h2>
                {
                    this.state.outgoing.map((value, index) => {
                        return <div className='person' key={index}>
                            <img src={value.photo} alt="user" />
                            <p>{value.login}</p>
                            <p>pending request</p>
                            <button className="personButton" onClick={this.changeRelation.bind(this, value.id)}>Cancel request</button>
                        </div>
                    })
                }
                <h1>Friends</h1>
                {
                    this.state.friends.map((value, index) => {
                        return <div className='person' key={index}>
                            <img src={value.photo} alt="user" />
                            <p>{value.login}</p>
                            <p>friend</p>
                            <button className="personButton" onClick={this.changeRelation.bind(this, value.id)} >Remove Friend</button>
                        </div>
                    })
                }
            </div>
        )
    }
}

export default withRouter(Friends)
