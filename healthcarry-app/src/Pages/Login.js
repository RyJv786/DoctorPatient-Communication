import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginValid from "../Components/ValidLogin";
import axios from "axios";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  
  const handleInput = (event) => {
    setValues((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors(LoginValid(values));

    if( errors.email === "" && errors.password === "") {
      try {
          const {
            data: { user },
          } = await axios.post("http://localhost:8080/auth/Login", values);
          localStorage.setItem("user", JSON.stringify(user));
          navigate("/home-chat");
      } 
      catch (err) {
        if (err.response && err.response.status === 401) {
          setErrors({ ...errors, general: err.response.data.message });
        }
        else {
        console.log(err);
        }
      }
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h1>Log In</h1>
        <form action="" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email">
              <strong> Email </strong>
            </label>
            <input type="email" placeholder="Email" onChange={handleInput} className="form-control rounded-0" name="email" /> 
              {errors.email && (<span className="text-danger"> {errors.email} </span>)}
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong> Password </strong>
            </label>
            <input type="password" placeholder="Password" onChange={handleInput}
              className="form-control rounded-0" name="password" />
            {errors.password && (<span className="text-danger"> {errors.password} </span>)}
          </div>
          <button type="submit" className="btn-login w-100">
            <strong> Log in </strong>
            {errors.general && (alert("Your Email or Password are incorrect"))}
          </button>
          <Link to="/Signup" className="btn-register w-100 rounded-0 text-decoration-none">
            <strong> Create Account </strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
