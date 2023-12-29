


import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
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

// Styled components
const HomeContainer = styled.div`
  position: relative;
  background-color:var(--main-background);
`;

const ImageSlide = styled.img`
  width: 100%;
  height: auto;
`;

const CarouselCaption = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #fff;
`;

const Section = styled.section`
   background-color:var(--main-background);
  padding: 60px 20px;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-family: 'Bree Serif', serif;
  color: #333;
  font-size: 2.5em;
  margin-bottom: 30px;
  @media screen and (max-width:768px){
    font-size:24px;
  }
`;

const FeaturesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const FeatureItem = styled.div`
  width: 100%;
  max-width: 550px;
  padding: 20px;
  margin-bottom: 40px;
  background-color: #fff;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }

  @media screen and (min-width: 768px) {
    width: 45%;
  }

  &:nth-child(even) {
    flex-direction: row-reverse;
  }
`;

const FeatureIcon = styled.div`
  font-size: 3em;
  color: var(--accent-background);
  margin-bottom: 20px;
   @media screen and (max-width:768px){
    font-size: 1em;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.8em;
  margin-bottom: 10px;
  color: #333;
  @media screen and (max-width:768px){
    font-size:20px;
  }
`;

const FeatureDescription = styled.p`
  font-size: 1.2em;
  color: #555;
   @media screen and (max-width:768px){
    font-size:0.8rem;
  }
`;

const Title = styled.h1`
  font-size:2rem;

  @media screen and (max-width:768px){
        font-size:1.2rem;
  }
 `
const Description = styled.p`
    font-size:1.2rem;
      @media screen and (max-width:768px){
        font-size:0.8rem;
  }
`
const MainSection = styled.section`
  padding: 20px;
  width: 100%;
  min-height: 100vh;
  color: var(--background-with);
  background-color: var(--accent-background);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    padding:50px;
  }
`;

const H1 = styled.h1`
  color: white;
  font-size: 5.5vw;
  margin-bottom: 30px;
  position: relative;
  text-decoration: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -20px; /* Adjust the distance from the text */
    left: 32%;
    transform: translateX(-50%);
    width: 200px;
    height: 10px; /* Adjust the height of the underline */
    background-color: #ffa500; /* Adjust the color of the underline */
    border-radius: 50%;
    box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.3); /* Add shadow to the underline */
  }

  @media (min-width: 768px) {
    font-size: 60px;

    &::after {
      width: 500px;
      height: 20px;
      left: 50%;
      border-radius: 50%;
    }
  }
`;



const Description2 = styled.p`
  color: white;
  font-size: 3vw;

  @media (min-width: 768px) {
    font-size: 30px;
  }
`;

const BannerSectionTextContainer = styled.div`
  padding: 10px;
  width: 100%;
  order:2;

  @media (min-width: 768px) {
    width: 50vw;
    order:1;
  }
`;

const BannerSectionImageContainer = styled.div`
  width: 100%;
  text-align: center;
  order:1;
  padding:20px;

  @media (min-width: 768px) {
    width: 50vw;
    order:2;
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  background-color: #ffa500;
  color: #ffffff;
  padding: 15px 30px;
  font-size: 3vw;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ff7f00;
  }

  @media (min-width: 768px) {
    font-size: 20px;
  }
`;
const Landingpage = () => {

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
        const token = localStorage.getItem('customerJwtToken')
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
    },
    // Add more slider images as needed
  ];


  const sliderSettings = {
    dots: true,
    infinite: true,
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
            {/* <Carousel showStatus={false} showThumbs={false} infiniteLoop autoPlay>
                {carouselItems.map((item, index) => (
                    <div key={index}>
                        <ImageSlide src={item.image} alt='images' />
                        <CarouselCaption>
                            <Title>{item.title}</Title>
                            <Description>{item.description}</Description>
                        </CarouselCaption>
                    </div>
                ))}
            </Carousel> */}

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
