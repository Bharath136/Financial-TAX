


import React, { useEffect } from 'react';
import { FaHandshake, FaChartBar, FaClock, FaLock, FaUsers, FaClipboardCheck } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../Footer/footer';
import { useNavigate } from 'react-router-dom';
import bannerImage from '../../Assets/banner-image2.png'
import bannerImage2 from '../../Assets/banner-image3.png'
import bannerImage3 from '../../Assets/banner-image4.png'
import Slider from 'react-slick';
import {getToken} from '../../StorageMechanism/storageMechanism'

import {
  HomeContainer,
  Section,
  Container,
  SectionTitle,
  FeaturesContainer,
  FeatureItem,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  MainSection,
  H1,
  Description2,
  BannerSectionTextContainer,
  BannerSectionImageContainer,
  CTAButton,
} from './styledComponents';

const Landingpage = () => {

    const features = [
        {
            id: 1,
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
        },
        {
            id: 6,
            icon: <FaClipboardCheck size={280} className="icon" />,
            title: 'Audit Preparedness',
            description:
                'Stay prepared for audits with our thorough documentation and support. We assist you in organizing and presenting your financial information with confidence during audits.',
        },
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const token = getToken()
        if (token) {
            navigate('/user/dashboard')
        }
    })

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
    }
  ];


  const sliderSettings = {
    dots: false,
    infinite: true,
    prevArrow: null,
    nextArrow: null, 
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    
  };

    return (
        <HomeContainer>

        <MainSection id="your-cta-section">
            <BannerSectionTextContainer>
              <H1>Welcome to UniProFin</H1>
              <Description2>
                Unlock the power of financial freedom with UniProFin. Our expert services guide you towards informed decisions for a secure financial future.
              </Description2>
              <CTAButton onClick={() => navigate('/accounts/login')}>Get Started</CTAButton>
            </BannerSectionTextContainer>
          <BannerSectionImageContainer>
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
          </BannerSectionImageContainer>
        </MainSection>
            <Section id="why-choose-us">
                <Container>
                    <SectionTitle>WHY CHOOSE US</SectionTitle>
                    <FeaturesContainer>
                        {features.map((feature, index) => (
                            <FeatureItem key={index}>
                                <FeatureIcon>{feature.icon}</FeatureIcon>
                                <div className="feature">
                                    <FeatureTitle>{feature.title}</FeatureTitle>
                                    <FeatureDescription>{feature.description}</FeatureDescription>
                                </div>
                            </FeatureItem>
                        ))}
                    </FeaturesContainer>
                </Container>
            </Section>
            <Footer />
        </HomeContainer>
    );
};

export default Landingpage;
