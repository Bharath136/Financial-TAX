import React, { useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../Footer/footer';
import './about.css'; // Make sure to import your CSS file
import { FaUser, FaFileAlt, FaLock, FaChartBar, FaGlobe, FaBell, FaMobileAlt, FaCloudDownloadAlt } from 'react-icons/fa';
import FeatureCard from './featureCard';
import bannerImage from '../../Assets/banner-image2.png'
import bannerImage2 from '../../Assets/banner-image3.png'
import bannerImage3 from '../../Assets/banner-image4.png'
import { getToken } from '../../StorageMechanism/storageMechanism';
import { useNavigate } from 'react-router-dom';


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
            src: bannerImage,
            alt: 'Image1',
        },
        {
            src: bannerImage2,
            alt: 'Image2',
        },
        {
            src: bannerImage3,
            alt: 'Image3',
        },
        // Add more slider images as needed
    ];

    // Key features data
    // Key features data with React Icons
    const keyFeatures = [
        { text: 'Effortless Taxpayer Registration', icon: <FaUser /> },
        { text: 'Comprehensive Tax Type Management', icon: <FaFileAlt /> },
        { text: 'Secure and Transparent Transactions', icon: <FaLock /> },
        { text: 'Detailed Tax Reports and Analysis', icon: <FaChartBar /> },
        { text: 'Access Anytime, Anywhere', icon: <FaGlobe /> },
        { text: 'Real-time Tax Notifications', icon: <FaBell /> },
        { text: 'Mobile-Friendly Interface', icon: <FaMobileAlt /> },
        { text: 'Integrated Electronic Filing', icon: <FaCloudDownloadAlt /> },
    ];

    const navigate = useNavigate()
    const token = getToken()

    useEffect(() => {
        if(token){
            navigate('/user/dashboard')
        }
    })


    return (
        <div>
            <div id="about" className="about-container">
                <div className="container">
                    <div className='details-container'>
                        <h2 className='service-header'>ABOUT US</h2>
                        <div className="row">
                            <div className="col-lg-6 text-secondary">
                                <h2 className="service-header text-start">About Our Financial Tax System</h2>
                                <p>
                                    Welcome to our comprehensive Tax Management System, designed to simplify your tax-related tasks and enhance financial management. We understand the importance of efficient tax management for individuals and businesses alike.
                                </p>
                                <p>
                                    Our system offers a wide range of features and benefits, making it easier for you to stay compliant with tax regulations, track your financial data, and save time on tax-related processes.
                                </p>
                                <p>Whether you're an individual taxpayer or a business owner, our system is tailored to meet your needs. Here are some key features:</p>
                            </div>
                            <div className="col-lg-6">
                                <Slider {...sliderSettings}>
                                    {sliderImages.map((image, index) => (
                                        <div key={index}>
                                            <img
                                                src={image.src}
                                                alt={image.alt}
                                                className="slider-image"
                                            />
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </div>
                    </div>
                    <h2 className='service-header mt-5'>Key Features</h2>
                    <ul className="feature-cards">
                    
                        {keyFeatures.map((feature, index) => (
                            <li key={index}>
                                <FeatureCard icon={feature.icon} text={feature.text} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
