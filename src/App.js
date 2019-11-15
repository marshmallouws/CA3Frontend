import React, { useState } from "react"
import facade from "./apifacade";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect
} from "react-router-dom";
import { isUserWhitespacable } from "@babel/types";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [roles, setRoles] = useState([]);

  return(
    <Router>
    <Navbar/>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/login">
          <LogIn setRoles={setRoles} setIsLoggedIn={setIsLoggedIn}/>
        </Route>
        <Route path="/user" >
          <LoggedIn roles={roles} />
        </Route>
      </Switch>
    </Router>
  );
}

function Navbar() {
  return(
    <nav className="header">
      <ul>
        <li>
          <NavLink exact to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/login">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
}

function Home() {
  return (
    <div>
      <h1>Homepage</h1>
    </div>
  )
}

function LogIn(props) {
  const [err, setErr] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    facade.login(username, password)
      .then(data => {props.setRoles(data.roles); props.setIsLoggedIn(true); console.log(data.roles);})
      .catch(err => {
        setErr("Wrong username or password");
    });
  }

  const onChange = (event) => {
    setErr("");
    if (event.target.id === "username") {
      setUsername(event.target.value);
    } else {
      setPassword(event.target.value);
    }
  }

  return (

    <div className="container container-small">
    <div className="wrapper">
    <h2>Login</h2><br/>
      <form className="form-signin" onSubmit={login} onChange={onChange} >
        <div className="form form-group">
        <input className="form-control" placeholder="User Name" id="username" />
        </div><div className="form-group">
        <input className="form-control" placeholder="Password" id="password" /> <br/>
        <button className="btn btn-primary">Login</button>
        </div>
      </form>
      </div>
    </div>
  )
}

function LoggedIn(props) {
  const [dataFromServer, setDataFromServer] = useState("Fetching!!");
  console.log(props);
  return (
    <div>
      <h2>Data recieved</h2>
      <h3>{dataFromServer}</h3>
      <h4>Roles</h4>
        {
          //roles.map((elem, index) => (<h5 key={index}>{elem}</h5>))
        }
    </div>
  )
}

export default App;