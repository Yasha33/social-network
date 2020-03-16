import React from 'react'
import {withRouter} from 'react-router-dom'
import queryString from 'query-string'

import api from '../constants/api';
import './users.css'
import Person from './person'

class Users extends React.Component {

    constructor(props) {
        super(props);
        this.searchInput = React.createRef();
        this.state = {
            id: null,
            allUsers: [],
            users: [],
        };
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
                allUsers: response,
                users: response,
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
                allUsers: response,
                users: response,
            });
        });

        this.searchInput.current.value = '';
    }

    search(data) {
        const users = this.state.allUsers.filter(e => e.login.toLowerCase().startsWith(data.toLowerCase()));
        this.setState({users});
    }

    render() {
        return (
            <div className="users">
                <input type="text" ref={this.searchInput} placeholder="name" onChange={event => this.search(event.target.value)} />
                {
                    this.state.users.map((user, index) =>
                        (
                            <Person
                                changeRelation={this.changeRelation.bind(this, user.id)}
                                key={index}
                                photo={user.photo}
                                name={user.login}
                                status={user.relation}
                            />
                        )
                    )
                }
            </div>
        )
    }
}

export default withRouter(Users)
