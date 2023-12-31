import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaBuilding, FaClipboard, FaBook, FaLightbulb, FaGavel, FaLandmark, FaHandshake } from 'react-icons/fa';
import Footer from '../Footer/footer';
import { getToken } from '../../StorageMechanism/storageMechanism';
import { useNavigate } from 'react-router-dom';


const ServicesSection = styled.section`
  padding-top: 10vh;
  background-color: var(--main-background);
  min-height: 100vh;
`;

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin:0 auto;
  text-align: center;
  padding: 80px 20px;

  @media screen and (max-width:768px){
    padding:20px;
  }
`;

const ServicesHeader = styled.h2`
  font-family: 'Bree Serif', serif;
  color: #333;
  font-size: 2.5em;
  margin-bottom: 30px;
  @media screen and (max-width:768px){
    font-size:24px;
  }
`;

const ServicesDescription = styled.p`
  font-size: 1.2em;
  color: #555;
  margin-bottom: 30px;
`;

const ServicesList = styled.ul`
  list-style: none;
  padding: 0;
  margin-bottom: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-5deg); }
  50% { transform: translateX(5px) rotate(5deg); }
  75% { transform: translateX(-5px) rotate(-5deg); }
  100% { transform: translateX(0); }
`;

const ServiceCard = styled.li`
  width: 250px;
  margin: 0 15px 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;

  @media screen and (max-width:879px){
        width:45%;
  }

  @media screen and (max-width:768px){
        width:100%;
  }

  &:hover {
    transform: scale(1.04);
    transition: 0.09s ease-in;
    animation: ${shakeAnimation} 0.5s ease-in-out; /* Apply shake animation on hover */
  }
`;


const ServiceIcon = styled.div`
  color: var(--accent-background);
  font-size: 2em;
  margin-bottom: 15px;
`;

const ServiceTitle = styled.h3`
  font-size: 1.2em;
  color: #333;
  margin-bottom: 10px;
`;

const ServiceDescription = styled.p`
  font-size: 1.1em;
  color: #555;
`;

const iconMap = {
  IndividualTaxReturns: FaUser,
  BusinessTaxPlanning: FaBuilding,
  AuditSupport: FaClipboard,
  Bookkeeping: FaBook,
  TaxConsultation: FaLightbulb,
  IRSIssueResolution: FaGavel,
  EstateTaxPlanning: FaLandmark,
  NonprofitTaxServices: FaHandshake,
};

const serviceDescriptions = {
  IndividualTaxReturns: 'Maximize deductions for individuals.',
  BusinessTaxPlanning: 'Strategic tax planning for businesses.',
  AuditSupport: 'Support and representation during audits.',
  Bookkeeping: 'Maintain accurate financial records.',
  TaxConsultation: 'Expert advice on tax-related matters.',
  IRSIssueResolution: 'Resolution and appeals for IRS issues.',
  EstateTaxPlanning: 'Plan for estate and inheritance taxes.',
  NonprofitTaxServices: 'Tax services tailored for nonprofit organizations.',
};

const Services = () => {

  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (token) {
      navigate('/user/dashboard')
    }
  })
  return (
    <ServicesSection>
      <ServicesContainer>
        <ServicesHeader>OUR SERVICES</ServicesHeader>
        <ServicesDescription>
          At TaxReturn Management, we are dedicated to providing a comprehensive suite of services to meet your diverse tax needs. Our experienced team ensures accuracy, compliance, and peace of mind.
        </ServicesDescription>
        <ServicesList>
          {Object.keys(iconMap).map((serviceName) => (
            <ServiceCard key={serviceName}>
              <ServiceIcon>
                {React.createElement(iconMap[serviceName])}
              </ServiceIcon>
              <ServiceTitle>{serviceName}</ServiceTitle>
              <ServiceDescription>{serviceDescriptions[serviceName]}</ServiceDescription>
            </ServiceCard>
          ))}
        </ServicesList>
        <ServicesDescription>
          We tailor our services to your unique situation, ensuring you maximize your deductions and minimize your tax liability. Trust us to navigate the complexities of the tax code so you can focus on what matters most.
        </ServicesDescription>
      </ServicesContainer>
      <Footer />
    </ServicesSection>
  )
}

export default Services;
