import React, { useState, useEffect } from "react"
import facade from "./apifacade";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Redirect,
  Link
} from "react-router-dom";

function App() {
  const [roles, setRoles] = useState([]);


  const getRoles = (r) => {
    setRoles(r);
  }

  return(
    <Router>
    <Navbar/>
      <Switch>
        <Route exact path="/">
          <Home/>
        </Route>
        <Route path="/login">
          <Login getRoles={getRoles}/>
        </Route>
        <PrivateRoute path="/user" component={LoggedIn} roles={roles}/>
      </Switch>
    </Router>
  );
}

function Navbar() {
  const logout = () => {
    facade.logout();
  }

  return(
    <nav className="header">
      <ul>
        <li>
          <NavLink exact to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/user">Test</NavLink>
        </li>
        
        {facade.getToken() == null ? (<li style={{float: "right"}}>
          <Link to="/login">Log in</Link>
        </li>) : (<li style={{float: "right"}}><Link to="/" onClick={logout}>Log out</Link></li>)
        }

      </ul>
    </nav>
  );
}

const PrivateRoute = ({component: Component, roles: roles, ...rest}) => {
  return (
    <Route
      {...rest}
      render={(props) => facade.getToken() != null
        ? <Component {...props} roles={roles} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />} />
  )
}

function Home() {
  return(
    <div>Home</div>
  );
}

function Login(props) {
  const [err, setErr] = useState("");

  const setErrorMsg = (msg) => {
    setErr(msg);
  }

  const login = (user, pass) => {
    facade.login(user, pass)
      .then(data => {props.getRoles(data.roles)})
      .catch(err => {
        setErrorMsg("Wrong username or password");
      });
  }

  return (
    <div>
      <LogIn login={login} setErrorMsg={setErrorMsg}/>
    </div>
  )
}

function LogIn(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = (event) => {
    event.preventDefault();
    props.login(username, password);
  } 

  const onChange = (event) => {
    props.setErrorMsg("");
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
  const {roles} = props;
  const [dataFromServer, setDataFromServer] = useState("Fetching!!");
  return (
    <div>
      <h2>Data recieved</h2>
      <h3>{dataFromServer}</h3>
      <h4>Roles</h4>
        {
          roles.map((elem, index) => (<h5 key={index}>{elem}</h5>))
        }
    </div>
  )
}

export default App;