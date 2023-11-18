import './home.scss';
import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';


const ProductCarousel = () => {
  const [popularProducts, setPopularProducts] = useState([]);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/products/popular')

        if (response.ok) {
          const data = await response.json();
          setPopularProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products', error);
      }
    }
    fetchPopular();
  }, []);

  const truncateName = (name) => {
    const words = name.split(' ');
    if (words.length > 4) {
        return words.slice(0, 6).join(' ') + '...';
    }
    return name;
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4, // Number of products to show at once
    slidesToScroll: 4, // Number of products to scroll by

    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      }
    ]
  };

  return (
    <div className="products-display">
      <h2>Popular Products</h2>
      <Slider {...settings}>
      {popularProducts.popularProducts && popularProducts.popularProducts.length > 0 ? (
          popularProducts.popularProducts.map((popular) => (
            <div key={popular._id} className="package">
            <Link to={`/products/${popular._id}`} className='productId-link'>
            <p>{truncateName(popular.name)}</p>
            <img src={popular.images[0]} alt='product preview' />
            <div className="product-price">
                <p>Price: ₦ {popular.price}</p>
                <FontAwesomeIcon icon={faArrowRight} className="arrow"/>
            </div>
            </Link>
          </div>

        ))
        ) : (
          <p>Loading..</p>
        )}
      </Slider>
    </div>
  );
};

export default ProductCarousel;
