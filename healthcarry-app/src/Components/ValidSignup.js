function SignupValid(values) {
    alert("")
    let error = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const password_pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-z0-9]{8,}$/

    if(values.firstname === ""){
        error.firstname = "First Name should not be empty"
    }
    else{
        error.firstname = ""
    }

    if(values.lastname === ""){
        error.lastname = "Last Name should not be empty"
    }
    else{
        error.lastname = ""
    }

    if(values.gender === "selectgender"){
        error.gender = "Please Choose Your Gender"
    }
    else{
        error.gender = ""
    }
 
    if(values.usertype === "selectuser"){
        error.usertype = "Please Choose 'Patient' or 'Practitioner' "
    }
    else{
        error.usertype = ""
    }

    if(values.email === ""){
        error.email = "Email should not be empty"
    }

    else if(!email_pattern.test(values.email)){
        error.email = "Email Didn't match"
    }
    else{
        error.email = ""
    }

    if(values.password === ""){
        error.password = "Password should not be empty"
    }

    else if(!password_pattern.test(values.password)){
        error.password = "Password Must Be 8 Characters Long & Contain Atleast 1 Capital Letter & 1 Number"
    }
    else{
        error.password = ""
    }
    return error;
}
export default SignupValid;