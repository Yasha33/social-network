import React from 'react'

import api from '../constants/api';
import './logIn.css';

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.loginButton = React.createRef();

        this.state = {
            login: null,
            password: null,
            wrongData: {},
        };
    }

    login() {
        const checkLogin = data => {
            if (data.id) {
                this.props.history.push('/main', { id: data.id });
            }
            else {
                this.setState({ wrongData: { borderColor: 'red' } });
            }
        };


        fetch(api.login, {
            method: 'POST',
            body: JSON.stringify({
                login: this.state.login,
                password: this.state.password,
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => {
            if (response.status === 400) {
                this.setState({ wrongData: { borderColor: 'red' } });
            }
            return response.json()
        }).then(checkLogin);
    }

    checkEnter(key) {
        if (key.keyCode === 13) {
            this.loginButton.current.focus();
        }
    }

    render() {
        return (
            <div className='logIn'>
                <input style={this.state.wrongData} type="text" placeholder="Login" onKeyDown={this.checkEnter.bind(this)} onChange={(e) => this.setState({ login: e.target.value })} />
                <input style={this.state.wrongData} type="password" placeholder="Password" onKeyDown={this.checkEnter.bind(this)} onChange={(e) => this.setState({ password: e.target.value })} />
                <button onClick={this.login.bind(this)} ref={this.loginButton}>Sign In</button>
            </div>
        )
    }
}
