import React from 'react';
import './home.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Link } from 'react-router-dom';
import Footer from '../Footer/footer';

const Home = () => {
    // Carousel data
    const carouselItems = [
        {
            image: 'https://www.shoonyatax.com/images/slider/swiper/bgnew4.jpg',
            title: 'Welcome to Our Tax Management',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        },
        {
            image: 'https://www.shoonyatax.com/img/s4.jpg',
            title: 'Welcome to Our Tax Management',
            description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
        },
        // Add more carousel items as needed
    ];

    // Features data
    const features = [
        {
            iconClass: 'fas fa-handshake',
            title: 'Expert Support',
            description: 'Get expert support and guidance from our dedicated team to address your concerns.',
        },
        {
            iconClass: 'fas fa-chart-bar',
            title: 'Comprehensive Reporting',
            description: 'Access detailed tax reports and analysis to make informed financial decisions.',
        },
        // Add more features as needed
    ];

    return (
        <div className='home-container'>
            <Carousel showStatus={false} showThumbs={false} infiniteLoop autoPlay>
                {carouselItems.map((item, index) => (
                    <div key={index}>
                        <img src={item.image} alt='img' className='image-slide' />
                        <div className="carousel-caption">
                            <h5>{item.title}</h5>
                            <p>{item.description}</p>
                        </div>
                    </div>
                ))}
            </Carousel>

            <section id="why-choose-us" className="why-choose-us-container">
                <div className="container">
                    <h2 className="section-title text-center" style={{ color: '#faae0b' }}>Why Choose Us</h2>
                    <div className="row d-flex align-items-center p-3">
                        {features.map((feature, index) => (
                            <div key={index} className={`col-lg-6${index % 2 === 1 ? ' order-md-2' : ''}`}>
                                <div className="feature">
                                    <i className={feature.iconClass}></i>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                        {features.map((feature, index) => (
                            <div key={index} className={`col-lg-6${index % 2 === 1 ? ' order-md-1' : ''} mb-4`}>
                                <img
                                    src={index % 2 === 0 ? 'https://img.freepik.com/premium-vector/people-suffering-from-problems_179970-813.jpg' : 'https://img.freepik.com/premium-vector/credit-score-vector-illustration-with-loan-arrow-gauge-speedometer-indicator-from-poor-good-rate_2175-15382.jpg?size=626&ext=jpg&ga=GA1.1.386372595.1697587200&semt=ais'}
                                    className='img-fluid shadow'
                                    alt={feature.title}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <Footer/>
        </div>
    );
};

export default Home;
