import React from 'react';
import './App.css';
import LogIn from './logIn'
import UsersFriends from './users-friends'
import {Route, Redirect} from 'react-router-dom'

class App extends React.Component {
  render() {
      return (
          <div>
              <Route path='/logIn' exact component={LogIn} />
              <Route path='/main' exact component={UsersFriends} />
              <Route path="/" exact component={LogIn}/>
              <Redirect from='/main' to='/' />
          </div>
      )
  }
}

export default App;
