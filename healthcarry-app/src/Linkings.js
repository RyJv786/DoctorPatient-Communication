import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Front from './Pages/Front';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import HomeChat from './Pages/HomeChat';

function Linkings() {

  return (
    <Router>
      <Routes>
            <Route path="/" element= {<Front/>} >
            </Route>
            <Route path="/Signup" element= {<Signup/>}>
            </Route>
            <Route path="/Login" element= {<Login/>}>
            </Route>
            <Route path="/home-chat" element= {<HomeChat/>}>
            </Route>
            </Routes>
    </Router>
  )
}

export default Linkings