import React from 'react';
import './landingpage.css';
import { Carousel } from 'react-responsive-carousel';
import { FaHandshake, FaChartBar, FaClock, FaLock, FaUsers } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../Footer/footer';

const Landingpage = () => {
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
        }
    ];

    const features = [
        {
            id:1,
            icon: <FaHandshake size={280} className="icon" />,
            title: 'Expert Support',
            description:
                'Get expert support and guidance from our dedicated team to address your concerns. Our knowledgeable professionals are here to assist you at every step of the way.',
        },
        {
            id: 2,
            icon: <FaChartBar size={280} className="icon" />,
            title: 'Comprehensive Reporting',
            description:
                'Access detailed tax reports and analysis to make informed financial decisions. Our comprehensive reporting tools provide you with a clear understanding of your financial data.',
        },
        {
            id: 3,
            icon: <FaClock size={280} className="icon" />,
            title: 'Time-saving Solutions',
            description:
                'Save time with our efficient solutions. We understand the value of your time, and our tools are designed to streamline your financial processes, giving you more time for what matters.',
        },
        {
            id: 4,
            icon: <FaLock size={280} className="icon" />,
            title: 'Secure Transactions',
            description:
                'Ensure the security of your transactions. We prioritize the safety of your financial data and implement robust security measures to protect your information from unauthorized access.',
        },
        {
            id: 5,
            icon: <FaUsers size={280} className="icon" />,
            title: 'Collaborative Environment',
            description:
                'Experience a collaborative environment. Our platform allows seamless collaboration between different users, making it easy for teams to work together on financial tasks.',
        }
    ];


    const isEven = (id) => {
        return id % 2 === 0;
    }




    return (
        <div>
            <div className='home-container'>
                <Carousel showStatus={false} showThumbs={false} infiniteLoop autoPlay>
                    {carouselItems.map((item, index) => (
                        <div key={index}>
                            <img src={item.image} alt='images' className='image-slide' />
                            <div className="carousel-caption">
                                <h5>{item.title}</h5>
                                <p>{item.description}</p>
                            </div>
                        </div>
                    ))}
                </Carousel>

                <section id="why-choose-us" className="why-choose-us-container">
                    <div className="container">
                        <h2 className="section-title">WHY CHOOSE US</h2>
                        <div className="features-container">
                            {features.map((feature, index) => (
                                <div key={index} className={`feature-item ${isEven(feature.id) && 'feature-item-reverse'} `}>
                                    <div className='feature-icon'>
                                        {feature.icon}
                                    </div>
                                    <div className="feature">
                                        
                                        <h3>{feature.title}</h3>
                                        <p>{feature.description}</p>
                                    </div>
                                    
                                </div>
                            ))}
                            
                        </div>
                    </div>
                </section>

            </div>
            <Footer/>
        </div>
    );
};

export default Landingpage;
