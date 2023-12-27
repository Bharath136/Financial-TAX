// import React, { useEffect } from 'react';
// import './landingpage.css';
// import { Carousel } from 'react-responsive-carousel';
// import { FaHandshake, FaChartBar, FaClock, FaLock, FaUsers } from 'react-icons/fa';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';
// import 'slick-carousel/slick/slick.css';
// import 'slick-carousel/slick/slick-theme.css';
// import Footer from '../Footer/footer';
// import { useNavigate } from 'react-router-dom';

// const Landingpage = () => {
//     const carouselItems = [
//         {
//             image: 'https://www.shoonyatax.com/images/slider/swiper/bgnew4.jpg',
//             title: 'Welcome to Our Tax Management',
//             description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//         },
//         {
//             image: 'https://www.shoonyatax.com/img/s4.jpg',
//             title: 'Welcome to Our Tax Management',
//             description: 'Praesent commodo cursus magna, vel scelerisque nisl consectetur.',
//         }
//     ];

//     const features = [
//         {
//             id:1,
//             icon: <FaHandshake size={280} className="icon" />,
//             title: 'Expert Support',
//             description:
//                 'Get expert support and guidance from our dedicated team to address your concerns. Our knowledgeable professionals are here to assist you at every step of the way.',
//         },
//         {
//             id: 2,
//             icon: <FaChartBar size={280} className="icon" />,
//             title: 'Comprehensive Reporting',
//             description:
//                 'Access detailed tax reports and analysis to make informed financial decisions. Our comprehensive reporting tools provide you with a clear understanding of your financial data.',
//         },
//         {
//             id: 3,
//             icon: <FaClock size={280} className="icon" />,
//             title: 'Time-saving Solutions',
//             description:
//                 'Save time with our efficient solutions. We understand the value of your time, and our tools are designed to streamline your financial processes, giving you more time for what matters.',
//         },
//         {
//             id: 4,
//             icon: <FaLock size={280} className="icon" />,
//             title: 'Secure Transactions',
//             description:
//                 'Ensure the security of your transactions. We prioritize the safety of your financial data and implement robust security measures to protect your information from unauthorized access.',
//         },
//         {
//             id: 5,
//             icon: <FaUsers size={280} className="icon" />,
//             title: 'Collaborative Environment',
//             description:
//                 'Experience a collaborative environment. Our platform allows seamless collaboration between different users, making it easy for teams to work together on financial tasks.',
//         }
//     ];


//     const isEven = (id) => {
//         return id % 2 === 0;
//     }

//     const navigate = useNavigate();

//     useEffect(() => {
//         const token = localStorage.getItem('customerJwtToken')
//         if(token){
//             navigate('/user-dashboard')
//         }
//     })

//     return (
//         <div>
//             <div className='home-container'>
//                 <Carousel showStatus={false} showThumbs={false} infiniteLoop autoPlay>
//                     {carouselItems.map((item, index) => (
//                         <div key={index}>
//                             <img src={item.image} alt='images' className='image-slide' />
//                             <div className="carousel-caption">
//                                 <h5>{item.title}</h5>
//                                 <p>{item.description}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </Carousel>

//                 <section id="why-choose-us" className="why-choose-us-container">
//                     <div className="container">
//                         <h2 className="section-title">WHY CHOOSE US</h2>
//                         <div className="features-container">
//                             {features.map((feature, index) => (
//                                 <div key={index} className={`feature-item ${isEven(feature.id) && 'feature-item-reverse'} `}>
//                                     <div className='feature-icon'>
//                                         {feature.icon}
//                                     </div>
//                                     <div className="feature">
                                        
//                                         <h3>{feature.title}</h3>
//                                         <p>{feature.description}</p>
//                                     </div>
                                    
//                                 </div>
//                             ))}
                            
//                         </div>
//                     </div>
//                 </section>

//             </div>
//             <Footer/>
//         </div>
//     );
// };

// export default Landingpage;




import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Carousel } from 'react-responsive-carousel';
import { FaHandshake, FaChartBar, FaClock, FaLock, FaUsers, FaClipboardCheck } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Footer from '../Footer/footer';
import { useNavigate } from 'react-router-dom';

// Styled components
const HomeContainer = styled.div`
  position: relative;
  margin-top:10vh;
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
  background-color: #f9f9f9;
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

    // const isEven = (id) => {
    //     return id % 2 === 0;
    // }

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('customerJwtToken')
        if (token) {
            navigate('/user/dashboard')
        }
    })


    return (
        <HomeContainer>
            <Carousel showStatus={false} showThumbs={false} infiniteLoop autoPlay>
                {carouselItems.map((item, index) => (
                    <div key={index}>
                        <ImageSlide src={item.image} alt='images' />
                        <CarouselCaption>
                            <Title>{item.title}</Title>
                            <Description>{item.description}</Description>
                        </CarouselCaption>
                    </div>
                ))}
            </Carousel>

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
