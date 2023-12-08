import React from 'react';
import './about.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../Footer/footer';

const About = () => {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    // Slider images data
    const sliderImages = [
        {
            src: 'https://img.freepik.com/free-vector/money-income-attraction_74855-6573.jpg?size=626&ext=jpg&ga=GA1.1.1679116835.1698125431&semt=ais',
            alt: 'Image1',
        },
        {
            src: 'https://img.freepik.com/free-vector/online-tax-concept-illustration_114360-16043.jpg?size=626&ext=jpg&ga=GA1.1.1679116835.1698125431&semt=ais',
            alt: 'Image2',
        },
        {
            src: 'https://img.freepik.com/free-vector/tax-preparation-concept-illustration_114360-16037.jpg?size=626&ext=jpg&ga=GA1.1.1679116835.1698125431&semt=ais',
            alt: 'Image3',
        },
        // Add more slider images as needed
    ];

    // Key features data
    const keyFeatures = [
        'Effortless Taxpayer Registration',
        'Comprehensive Tax Type Management',
        'Secure and Transparent Transactions',
        'Detailed Tax Reports and Analysis',
        'Access Anytime, Anywhere',
        // Add more key features as needed
    ];

    return (
        <div>
            <div id="about" className="about-container">
                <div className="container">
                    <h2 style={{color:`var(--headings)`}} className="section-title text-center mb-5">ABOUT US</h2>
                    <div className="row">
                        <div className="col-lg-6 text-secondary text-start">
                            <h2 className="section-title">About Our Financial Tax System</h2>
                            <p>
                                Welcome to our comprehensive Tax Management System, designed to simplify your tax-related tasks and enhance financial management. We understand the importance of efficient tax management for individuals and businesses alike.
                            </p>
                            <p>
                                Our system offers a wide range of features and benefits, making it easier for you to stay compliant with tax regulations, track your financial data, and save time on tax-related processes.
                            </p>
                            <p>Whether you're an individual taxpayer or a business owner, our system is tailored to meet your needs. Here are some key features:</p>
                            <ul>
                                {keyFeatures.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="col-lg-6">
                            <Slider {...sliderSettings}>
                                {sliderImages.map((image, index) => (
                                    <div key={index}>
                                        <img
                                            src={image.src}
                                            alt={image.alt}
                                            style={{ width: '100%', maxHeight: '500px' }}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default About;
