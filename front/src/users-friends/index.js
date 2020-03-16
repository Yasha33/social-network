import React from 'react'
import Users from '../users'
import './users-friends.css'
import Friends from '../friends'

class userFriends extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            active: 'users',
        }
    }

    changeTabs(data) {
        this.setState({active: data});
    }

    render() {
        return (
            <div className='userFriends'>
                <input id='radio1' type='radio' value='users' name='check' className='checkBox' checked={this.state.active === 'users'} onChange={el => this.changeTabs(el.target.value)}/>
                <input id='radio2' type='radio' value='friends' name='check' className="checkBox" checked={this.state.active === 'friends'} onChange={el => this.changeTabs(el.target.value)}/>
                <label htmlFor='radio1' className="firstLabel">Users</label>
                <label htmlFor='radio2' className="secondLabel">Friends</label>
            {this.state.active === 'users' ? <Users/> : <Friends/>}
            </div>
        )
    }
}

export default userFriends
