import React, { useContext, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import './auth.scss';
import { AuthContext } from "../context/AuthContext";
import { useToken } from "../context/tokenContext";


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    // const [token, setToken] = useState('');
    const { updateToken } = useToken();

    const handleInputChange = (e) => {
        // example of an event(e) is a user typing in an input field
        const { name, value } = e.target;
        // the name corresponds to the name attribute of the input field, and value corresponds to the current value entered by the user in the input field.
        if (name === 'email') setEmail(value);
        else if (name === 'password') setPassword(value);
        setError(null);
    };

    const handleLogin = (userData) => {
        login(userData);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError('Please fill in all the fields.');
            return;
        }


        const userData = {
            email,
            password
        };

        try {
            const token = localStorage.getItem('token'); // Get the token from localStorage

            const response = await fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            

            if (response.ok) {

                const responseData = await response.json(); // Parse the response body as JSON
                const { token, user } = responseData;

                localStorage.setItem('token', token); // Store in localStorage for simplicity
                updateToken(token);
            
                if (responseData.user.role === 'admin') {
                    try {
                        console.log(`${responseData.user.firstname} Admin logged in successfully`);
                        handleLogin(user);
                        return navigate('/admin');
                        
                      } catch (error) {
                        console.error("Navigation error:", error);
                      }
                }
                console.log('User logged in successfully!');
                handleLogin();
                handleLogin(user);
                window.alert(`Logged in successfully as ${email}`)
                navigate('/'); // Navigate to the home page
            } else {
                console.error('Error logging in:', response.statusText);
                setError('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Error signing up:', error);
                setError('An error occured. Please try again later');
        }; 
    };
    
    return (
        <div className="auth-block">
            
            <div className="sub-auth">
                <div className="main-block">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <button className="google-btn"><FontAwesomeIcon icon={['fab', 'google']} className="google-icon"/>Log in with google</button>
                        <p className="or">_______ or _______</p>
                        
                        <div className="input-group">
                            <FontAwesomeIcon icon={faUser} size="xs" className="icon"/>
                            <label htmlFor="email">Enter your email address</label>
                            <input type="text"
                            id="email"
                            name="email"
                            value={email}
                            onChange={handleInputChange}
                             placeholder="Enter your email address" aria-required className="log-text"/>
                        </div>
                        <div className="input-group">
                        <label htmlFor="password">Enter your password</label>
                            <FontAwesomeIcon icon={faKey} size="xs" className="icon"/>
                            <input type="password" id='password'
                            name="password"
                            value={password}
                            onChange={handleInputChange}
                            placeholder="Enter password" aria-required />
                        </div>
                        {error && <div className="error">{error}</div>}
                        <p className="f-pwd">Forgot password?</p>
                        <button type="submit" className="submit-btn">Login</button>
                        <p className="acc">Don't have an account? <span><Link to='/signup' className="sig">Sign up</Link></span>.</p>
                    </form>
                    </div>
                    
                </div>
        </div>
    )
    
}


export default Login