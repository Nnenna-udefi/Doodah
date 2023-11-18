import React, { useContext, useState } from "react";
import './header.scss'
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import logo from '../../images/doodah-logo.png';
import { CartContext } from "../context/CartContext";
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { cart } = useContext(CartContext);
    const [isActive, setIsActive] = useState(false);
    const { isLoggedIn, logout } = useContext(AuthContext);

    // add the active class
    const toggleActiveClass = () => {
        setIsActive(!isActive);
    };

    // clean up function to remove the active class
    const removeActive = () => {
        setIsActive(false)
    };  

    // Function to handle logout
    const handleLogout = () => {
        logout();
    }

    
    return (
        <header>
            <nav>
                <div className="logo-block">
                    <img src={logo} alt="doodah logo" />
                    <div className="logo-text">
                        <h1 className="logo">Doodah</h1>
                        {/* <p>TAGLINE</p> */}
                    </div>
                </div>
                <form className="search-form">
                    <input type="search" name="search" className="search-input" placeholder="Search products and prices"/>
                    <button type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                    </button>
                </form>
                <div className={`menu-link ${isActive ? 'active' : ''}`}>
                    <Link className="link" to='/' onClick={removeActive}>Home</Link>
                    {/* <Link className="link" to='/about' onClick={removeActive}>About Us</Link> */}
                    <Link className="link" to='/products' onClick={removeActive}>Products</Link>
                    
                    {isLoggedIn ? (
                        <>
                            <Link className="link" to='/my-account' onClick={removeActive}>My Account</Link>
                            <Link className="out-link" to='/' onClick={() => {
                                handleLogout();
                                removeActive();
                            }}> Sign Out </Link>
                        </>
                    ) : (
                        <Link className="link" to='/login' onClick={removeActive}>Sign Up/Log In</Link>
                    )}
                </div>

                <div className={`hamburger ${isActive ? 'active' : ''}`} onClick={toggleActiveClass}>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </div>

                <Link className="cart" to='/cart'>
                    <FontAwesomeIcon icon={faCartShopping} color="#EB2D66" size="xs" />
                    <span className="noItems">{cart.length}</span>
                    <FontAwesomeIcon icon={faCaretDown} size="xs"/>
                </Link>
            </nav>
        </header>
        
    )
}

export default Header