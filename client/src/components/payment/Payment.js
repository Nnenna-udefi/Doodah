import './payment.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTrash, faCheckCircle} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react';
import { CartContext } from '../context/CartContext';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { useNavigate } from 'react-router-dom';
import paystackimg from '../../images/paystack.png';
import { useToken } from '../context/tokenContext';
import { AuthContext } from '../context/AuthContext';

const Payment = () => {
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const [cartItems, setCartItems] = useState([]);
    const [activeLink, setActiveLink] = useState('Shipping'); // State to track the active link
    const [phoneNumber, setPhoneNumber] = useState('');
    // const [selectedState, setSelectedState] = useState('');
    const navigate = useNavigate();
    const { token } = useToken();
    const { user } = useContext(AuthContext); 
    
   

    const [userDetails, setUserDetails] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phoneNumber: '',
      });
      
      const [shippingDetails, setShippingDetails] = useState({
        addressNo: '',
        address: '',
        city: '',
        state: 'Lagos',
        code: '',
        landmark: '',
      });


    // const handleStateChange = (event) => {
    //     setSelectedState(event.target.value);
    // }

    // const states = ['', 'Lagos', 'Abuja', 'Kano', 'Ogun', 'Oyo', 'Enugu', 'Kwara', 'Imo', 'Anambra', 'Delta',
    // 'Cross-River', 'Akwa-Ibom', 'Rivers', 'Bayelsa', 'Kaduna', 'Abuja', 'Jos', 'Adamawa', 'Ebonyi', 'Abia']
    
    const handlePhoneNumberChange = (value) => {
        setPhoneNumber(value);
    };

    const handleClick = (link) => {
        setActiveLink(link);
    }
   
    useEffect(() => {
        setCartItems(cart)
    }, [cart]);

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    };

    const calculateSalesTax = () => {
        return calculateTotalPrice() * 0.02;
    };
      
    const totalDue = calculateTotalPrice() + calculateSalesTax();

    const handleDeleteItem = (index) => {
        removeFromCart(index);
    };

    const truncateName = (name) => {
        const words = name.split(' ');
        if (words.length > 3) {
            return words.slice(0, 7).join(' ') + '...';
        }
        return name;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (activeLink === 'Payment') {
            
          // Create an order object with user, products, shipping details, and payment method

          const products = cartItems.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            totalAmount: item.price,
          }));
          const order = {
            user: user._id,
            product: products[0].product,
            quantity: products[0].quantity,
            address: shippingDetails.address,
            totalAmount: products[0].totalAmount,
            status: 'Shipped',
            orderDate: new Date(),

            
          };
    
          try {
            // console.log('Order:', order);
            const response = await fetch('http://localhost:4000/api/orders/add', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              },
              body: JSON.stringify(order),
            });
    
            if (response.ok) {
                clearCart();
                setActiveLink('Shipping');
              navigate('/my-account');
              window.alert('Order was created successfully')
              console.log('Order created successfully');
            } else {
              console.error('Order creation failed');
              window.alert('Order was not created, Log in please!')
            }
          } catch (error) {

            console.error('Network error', error);
          }
        }
      };

    return (
        <div className='payment'>
            <div className='order'>
                <a href='/cart'>
                    <FontAwesomeIcon icon={faArrowLeft} className='arrow'/>
                    Back
                </a>

                <h2>Order Summary</h2>
                {cartItems.map((item, index) => (
                <div className='summary' key={index}>
                    <div className='order-box'>
                        <img src={item.img} alt='order icon' />
                        <div className='items'>
                            <p className='itemname'>{truncateName(item.name)}</p>
                            <p className='qty'>Quantity: {item.quantity} item(s)</p>
                        </div>
                    </div>
                    <div className='price-box'>
                        <p>₦{item.price}</p>
                        <FontAwesomeIcon icon={faTrash} size='xs' onClick={() => handleDeleteItem(index)} cursor='pointer' />
                    </div>
                </div>     
                ))}

                <div className='otherDetails'>
                    <form className='discount'>
                        <label htmlFor='gift'>Gift Card / Discount code</label><br />
                        <input type='text' name='gift' />
                        <button type='submit'>Apply</button>
                    </form>

                    <p>Subtotal <span>₦{calculateTotalPrice()}</span></p>
                    <hr />
                    <p>Sales tax (2%) <span>N{calculateSalesTax()}</span></p>
                    <hr />
                    <p>Shipping fee <span className='free'>FREE</span></p>
                    <hr />
                    <p>Total due <span>₦{totalDue}</span></p>
                </div>
            </div>
            <div className='pay-ship'>
            <div className='payment-link'>
            <Link className={activeLink === 'Shipping' ? 'active-link' : 'link'} onClick={() => setActiveLink('Shipping')}>
                Shipping
                </Link>
                -- <FontAwesomeIcon icon={faCheckCircle} /> ---

                <Link className={activeLink === 'Delivery' ? 'active-link' : 'link'} onClick={() => setActiveLink('Delivery')}>
                Delivery
                </Link>
                -- <FontAwesomeIcon icon={faCheckCircle} /> ---

                <Link className={activeLink === 'Payment' ? 'active-link' : 'link'} onClick={() => setActiveLink('Payment')}>
                Payment
                </Link>
            </div>

                <div className='toPay'>
                    {activeLink === 'Shipping' && (
                        <div>
                            <form >
                                <div className='shipment-form'>
                                    <h2>Contact Details</h2>
                                    <label htmlFor='firstname'>Firstname:</label><br />
                                    <input type='text' name='firstname' value={userDetails.firstname}
                                    onChange={(e) => setUserDetails({ ...userDetails, firstname: e.target.value })} required />

                                    <label htmlFor='lastname'>Lastname:</label>
                                    <input type='text' name='lastname' value={userDetails.lastname} 
                                    onChange={(e) => setUserDetails({ ...userDetails, lastname: e.target.value })}
                                    /><br />

                                    <label htmlFor='email'>Email:</label><br />
                                    <input type='email' name='email' value={userDetails.email} onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })} 
                                    required/><br />

                                    <label htmlFor='number'>Phone number:</label><br />
                                    <PhoneInput value={phoneNumber} defaultCountry='NG' onChange={handlePhoneNumberChange} id='number' />
                                </div>

                                <div className='shipment-form'>
                                    <h2>Shipping Details</h2>
                                    {/* <label htmlFor='addressNo'>Flat/House no:</label><br />
                                    <input type='number' name='addressNo' 
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, addressNo: e.target.value })} /><br /> */}

                                    <label htmlFor='address'>Address:</label><br />
                                    <input type='text' name='address' aria-required 
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, address: e.target.value })} /><br/>
                                    
                                    {/* <label htmlFor='city'>City:</label><br />
                                    <input type='text' name='city' aria-required 
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })} />

                                    <label htmlFor='state'>State:</label><br />
                                    <select id='state' name='state' value={selectedState} onChange={handleStateChange}>
                                        {states.map((state, index) => {
                                           return (
                                            <option key={index} value={state}>
                                                {state}
                                            </option>
                                           )
                                        })}
                                    </select>

                                    <label htmlFor='code'>Postal Code:</label><br />
                                    <input type='number' name='code' 
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, code: e.target.value })}  />

                                    <label htmlFor='landmark'>Famous Landmark:</label><br />
                                    <input type='text' name='landmark' 
                                    onChange={(e) => setShippingDetails({ ...shippingDetails, landmark: e.target.value })}  /><br /> */}

                                    <input type='checkbox' name='check' required aria-required/>
                                    <label htmlFor='check' className='checkbox'>My shipping and Billing address are the same</label>
                                </div>
                                <button className='back-btn' onClick={() => handleClick('Delivery')}>Continue to Delivery</button>
                            </form>       
                        </div>
                    )}

                    {activeLink === 'Delivery' && (
                            <div>
                        <form className='payment-form'>
                            <h2>Delivery Options</h2>
                            <input type="radio" id="outsideLagos" name="outsideLagos" value="Outside lagos" />
                            <label htmlFor="outsideLagos">Outside Lagos Home Delivery via DHL usually takes between 5 - 7 working days
                                <p>Pay with cash</p>
                            </label><br />
                            
                            <input type="radio" id="withinLagos" name="withinLagos" value="Within Lagos" />
                            <label htmlFor="withinLagos">Within Lagos usually takes 4 to 5 working days
                            <p>Delivery is free</p>
                            </label><br />
                            
                            <input type="radio" id="park" name="park" value="Park pickup" />
                            <label htmlFor="park">Outside Lagos Park pick up usually takes 5 to 6 working days
                                <p>Pay with cash at the park</p>
                            </label><br />
                        </form>
                        <button className='back-btn' onClick={() => handleClick('Shipping')}>
                            Back
                        </button>
                        <button className='makePayment-btn' onClick={() => handleClick('Payment')}>Continue to payment</button>
                        </div>
                    )}
                    {activeLink === 'Payment' && (
                        <div>
                            <form className='payment-form' onSubmit={handleSubmit} >
                                <h2>Payment Method</h2>
                                <input type="radio" id="delivery" name="payment_method" value="Pay online" />
                                <label htmlFor="delivery">Paystack
                                    <p>Pay online using your Visa/Mastercard</p>
                                    <img src={paystackimg} alt='paystack logo' />
                                </label><br />
                                <button className='back-btn' onClick={() => handleClick('Delivery')}>Back</button>
                            <button type='submit' className='makePayment-btn'>Place Order</button>
                    </form>
                            
                    </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Payment