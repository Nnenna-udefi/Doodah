import React from 'react';
import './home.scss';
import rectangleDrone from '../../images/Rectangle-drone.png';
import drone from '../../images/drone.png';
import ProductCarousel from './ProductCarousel';
import Partners from './partner';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShippingFast, faCreditCard, faHandHoldingHand } from '@fortawesome/free-solid-svg-icons';


const Home = () => {
  

  return (
    <div className='homepage'>
      <div className='hero-section'>
        <div className='hero-text'>
          <h1>Best selling products</h1>
          <p>Browse through our range of appliances and enjoy 12 Months Warranty!</p>
          <button>
            <Link className='shop-link' to='/products'>
            Shop here
            </Link>
          </button>
        </div>

       

        <div className='img-section'>
         <div className='rectangle'>
          <img src={rectangleDrone} alt='rectangle drone' className='rec-drone' />
          <img src={drone} alt='drone-img' className='dron'/>
         </div>
        </div>
      </div>

      <div className='feature'>
        <div className='feature-box'>
          <FontAwesomeIcon icon={faShippingFast} color='red' className='feature-icon' size='xl'/>
          <div>
          <h3>Free Delivery</h3>
          <p>Free delivery within Lagos</p>
          </div>
        </div>

        <div className='feature-box'>
          <FontAwesomeIcon icon={faCreditCard} color='red' className='feature-icon' size='xl'/>
          <div>
          <h3>Safe Payment</h3>
          <p>100% secure payment</p>
          </div>
        </div>

        <div className='feature-box'>
          <FontAwesomeIcon icon={faHandHoldingHand} color='red' className='feature-icon' size='xl'/>
          <div>
          <h3>Shop With confidence</h3>
          <p>Buy now pay later</p>
          </div>
        </div>
      </div>


      <ProductCarousel />
      
      <Partners />

    </div>
  );
};

export default Home;