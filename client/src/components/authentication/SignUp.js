import React, { Component } from "react";
import { Link, Navigate } from "react-router-dom";
import './auth.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../context/AuthContext";

class SignUp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            error: false,
            errorPwd: '',
            fontColor: 'white',
            emailError: '',
            redirect: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.validateEmail = this.validateEmail.bind(this);
    }
        // Add form input change handlers and submit handler here
        handleInputChange = (event) => {
            const { name, value, checked, type } = event.target;
            this.setState({
            [name]: type === 'checkbox' ? checked : value,
            emailError: name === 'email' && !this.validateEmail(value) ? 'Valid email required' : ''
            });
        };

        // handle the logged in state after the user signs up
        static contextType = AuthContext;

        validateEmail = (email) => {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailPattern.test(email);
        };

        handlePassword = (event) => {
            const passwd = event.target.value;
            this.setState({password: passwd});
            let fontColor = 'white';
      
            const lowercase = /[a-z]/g;
            const uppercase = /[A-Z]/g;
            const numbers = /[0-9]/g;
            
            if (!passwd.match(lowercase) || !passwd.match(uppercase) || 
              !passwd.match(numbers) || passwd.length < 10) {
            fontColor = 'red';  // Change font color to red for weak passwords
            } else {
              fontColor = 'green';  // Change font color to green for strong passwords
            }
      
            if (!passwd.match(lowercase)) {
              this.setState({errorPwd: 'Password should contain lowercase letters!', fontColor});
              fontColor = 'red';
            } else if (!passwd.match(uppercase)) {
              this.setState({errorPwd: 'Password should contain uppercase letters!', fontColor});
         
            } else if (!passwd.match(numbers)) {
              this.setState({errorPwd: 'Password should contain numbers!', fontColor});
      
            } else if (passwd.length < 10) {
              this.setState({errorPwd: 'Password length should be more than 10', fontColor});
      
            } else {
              this.setState({errorPwd: "Password is strong!", fontColor});
            }
            
        };

        handleLogin = () => {

          this.context.login();
      }


        handleSubmit = async (event) => {
            event.preventDefault(); // prevents the app from reloading when the submit button is clicked
            const { firstname, lastname, email, password } = this.state;

            const userData = {
              firstname,
              lastname,
              email,
              password
            };

            try {
              const response = await fetch('http://localhost:4000/api/users/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
              });

              if (response.ok) {
                console.log('User signed up successfully!')
                window.alert(`Signed up successfully as ${firstname + lastname} `)
                this.setState({ redirect: true });
                this.handleLogin();
              } else {
                console.error('Error signing up:', response.statusText);
              }
            } catch (error) {
              console.error('Error signing up:', error);
            }
          
            // Validate email
            const isEmailValid = this.validateEmail(email);
          
            this.setState({
              emailError: isEmailValid ? '' : 'Valid email required!'
            });
          
            if (firstname === '' || lastname === '' || email === '' || password === '' || !isEmailValid) {
              this.setState({
                error: true
              });
            } else {
              this.setState({
                // submitted: true,
                error: false
              })
            };  
          
    };


    render() {
        const { firstname, lastname, email, password, fontColor, emailError, errorPwd } = this.state;
        if (this.state.redirect) {
          return <Navigate to='/' />;
        }
        return (
            <div className="auth-block">
                <div className="sub-auth reverse">
                    <div className="main-block">
                    <h1>REGISTER</h1>
                    <form onSubmit={this.handleSubmit}>

                    <label htmlFor="firstname">Enter your first name:</label><br />
                        <input type="text" id="firstname" name="firstname" placeholder="Enter Firstname"
                        value={firstname} onChange={this.handleInputChange} aria-required className="sign-text"/>

                      <label htmlFor="lastname">Enter your last name:</label><br />
                        <input type="text" id="lastname" name="lastname" placeholder="Enter Lastname" className="sign-text" 
                        value={lastname} onChange={this.handleInputChange}/>

                        <label htmlFor="email">Enter your email address:</label>
                        <input type="email" id="email" name='email' placeholder="Enter Email address" aria-required
                        value={email} onChange={this.handleInputChange} required/><br />
                        {emailError && <span className="error">{emailError}</span>}
                        
                        <label htmlFor="password">Enter your password:</label>
                        <input type="password" id="password" name="password" placeholder="Enter password"
                        value={password} onChange={this.handlePassword} aria-required/><br />
                        <span className='small' style={{ color: fontColor }} >{errorPwd}</span>

                        <p className="or">_______ or _______</p>
                        <button className="google-btn">
                          <FontAwesomeIcon icon={['fab', 'google']} className="google-icon"
                          /> Sign up with google
                          </button>
                        <button type="submit" className="submit-btn">Sign Up</button>
                        <p className="acc">If you already have an account <span ><Link to='/login' className="sig">Log In</Link></span>.</p>
                    </form>
                    </div>
                </div>
            </div>
        )
    }
    
}

export default SignUp;
