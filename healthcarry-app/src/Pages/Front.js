import React from 'react'

function Front() {
  return (
    <div className="Front">
      <header className="Front-header">
        <h1>
          <strong>
          HealthCarry+
          </strong>
        </h1>
      </header>
      <header className="Front-pagetxt">
      Our aim is to make the lives easier and quicker of all patients and practioners alike.
        Please remember to be respectful at all times
      </header>
      <header className="Signup-click">
      <a href='/Signup'>
        SignUp
      </a>
      </header>
      <header className="Login-click">
      <a href='/Login'>
        Login
      </a>
      </header>
    </div>
  )
}

export default Front