import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupValid from "../Components/ValidSignup";
import axios from "axios";

function Signup() {
  const [values, setValues] = useState({
    firstname: "",
    lastname: "",
    gender: "selectgender",
    usertype: "selectuser",
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
    setErrors(SignupValid(values))

    if(errors.firstname === "" && errors.lastname === "" && errors.gender === "" && errors.usertype === "" &&
    errors.email === "" && errors.password === "") {
      await axios.post("http://localhost:8080/auth/Signup", values)
        .then((res) => {
          if (res.data === "Error") {
            alert("Email already in use");
          } else {
            navigate("/Login");
          }
        })
        .catch((err) => console.log(err));
    }
  };
  return (
    <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h1>Sign Up</h1>
        <form action="" onSubmit={handleSubmit}>
        <div className='mb-3'>
          <label htmlFor='firstname'> <strong> First Name </strong> </label>
          <input type='text' placeholder='Enter First Name' onChange={handleInput} className='form-control rounded-0' name='firstname'/>
          {errors.firstname && <span className='text-danger'> {errors.firstname} </span>}
        </div>
        <div className='mb-3'>
          <label htmlFor='lastname'> <strong> Last Name </strong> </label>
          <input type='text' placeholder='Enter Last Name' onChange={handleInput} className='form-control rounded-0' name='lastname'/>
          {errors.lastname && <span className='text-danger'> {errors.lastname} </span>}
        </div>
        <div className='mb-3'>
         <label htmlFor='gender'> <strong> Gender </strong> </label>
         <select value={values.gender} className='select-gender w-100' onChange={handleInput} name='gender'>
         <option value="selectgender" disable="true" selected hidden name='gender'>Select Gender</option>
           <option value="male" name='gender'>Male</option>
           <option value="female" name='gender'>Female</option>
         </select>
         {errors.gender && <span className='text-danger'> {errors.gender} </span>}
       </div>
       <div className='mb-3'>
         <label htmlFor='usertype'> <strong> Type Of User </strong> </label>
         <select value={values.usertype} className='select-user w-100' onChange={handleInput} name='usertype'>
         <option value="selectuser" disable="true" selected hidden name='usertype'>Select User</option>
           <option value="patient" name='usertype'>Patient </option>
           <option value="practitioner" name='usertype'>Practitioner</option>
         </select>
         {errors.usertype && <span className='text-danger'> {errors.usertype} </span>}
 </div>
        <div className='mb-3'>
          <label htmlFor='email'> <strong> Email </strong> </label>
          <input type='email' placeholder='Enter Email' onChange={handleInput} className='form-control rounded-0' name='email'/>
          {errors.email && <span className='text-danger'> {errors.email} </span>}
        </div>
        <div className='mb-3'>
          <label htmlFor='password'> <strong> Password </strong> </label>
          <input type='password' placeholder='Enter Password' onChange={handleInput} className='form-control rounded-0' name='password'/>
          {errors.password && <span className='text-danger'> {errors.password} </span>}
        </div>
          <button type="submit" className="btn-login w-100">
            <strong> Sign Up </strong>
          </button>
          <Link to="/Login" className="btn-register w-100 rounded-0 text-decoration-none">
            <strong> Login If You Already Have An Account </strong>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
