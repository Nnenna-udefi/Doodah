import React from "react";
import './footer.scss';
import paypal from '../../images/paypal.png';
import ame from '../../images/american-express.png';
import discover from '../../images/discover.png';
import maestro from '../../images/maestro.png';
import visa from '../../images/visa.png'

const Footer = () => {
    return (
        <footer>
            <div className="newsletter">
                <div className="newsletter-text">
                    <h1>Sign Up To Our Newsletter.</h1>
                    <p>Be the first to hear about the latest offers.</p>
                </div>
                <form className="newsletter-form">
                    <input type="email" placeholder="Your Email" required aria-required className="input" />
                    <button type="submit">Subscribe</button>
                </form>
            </div>

            <div className="content">
                <ul className="content-list">
                    <h3>Information</h3>
                    <li className="list">About Us</li>
                    <li className="list">About Zip</li>
                    <li className="list">Privacy Policy</li>
                    <li className="list">Search</li>
                    <li className="list">Terms</li>
                    <li className="list">Orders and Returns</li>
                    <li className="list">Contact Us</li>
                    <li className="list">Advanced Search</li>
                    <li className="list">Newsletter Subscription</li>
                </ul>

                <ul className="content-list">
                    <h3>PC Parts</h3>
                    <li className="list">CPUs</li>
                    <li className="list">Add On Cards</li>
                    <li className="list">Hard Drives (Internal)</li>
                    <li className="list">Graphic Cards</li>
                    <li className="list">Keyboards / Mice</li>
                    <li className="list">Cases / Power Supplies / Cooling</li>
                    <li className="list">RAM (Memory)</li>
                    <li className="list">Software</li>
                    <li className="list">Speakers / Headsets</li>
                    <li className="list">Motherboards</li>
                </ul>

                <ul className="content-list">
                    <h3>Desktop PCs</h3>
                    <li className="list">Custom PCs</li>
                    <li className="list">Servers</li>
                    <li className="list">All-In-One PCs</li>
                    <li className="list">HP/Compaq PCs</li>
                    <li className="list">ASUS PCs</li>
                    <li className="list">Tecs PCs</li>
                </ul>

                <ul className="content-list">
                    <h3>Laptops</h3>
                    <li className="list">Everyday Use Notebooks</li>
                    <li className="list">MSI Workstation Series</li>
                    <li className="list">MSI Prestige Series</li>
                    <li className="list">Tablets and Pads</li>
                    <li className="list">Netbooks</li>
                    <li className="list">Infinity Gaming Notebooks</li>
                </ul>

                <div className="content-list">
                    <h3>Address</h3>
                    <p className="list">Address: 1234 Street Adress City Address, 1234</p>
                    <p className="list">Phones: <span className="color">(00) 1234 5678</span></p>
                    <p className="list">We are open: Monday-Thursday: 9:00 AM - 5:30 PM</p>
                    <p className="list">Friday: 9:00 AM - 6:00 PM</p>
                    <p className="list">Saturday: 11:00 AM - 5:00 PM</p>
                    <p className="list">E-mail: <span className="color">shop@email.com</span></p>
                </div>
            </div>
            <p className="license">Copyright © 2023 Doodah</p>
            <hr className="line"/>
            <div className="payment-icons">
                <img src={paypal} alt="paypal icon" />
                <img src={discover} alt="discover icon" />
                <img src={ame} alt="american express icon" />
                <img src={visa} alt="visa icon" />
                <img src={maestro} alt="maestro icon" />
            </div>
        </footer>
    )
}

export default Footer