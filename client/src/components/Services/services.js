import React from 'react';
import styled from 'styled-components';
import Footer from '../Footer/footer'

const ServicesSection = styled.section`
  margin-top: 10vh;
  background-color: #f9f9f9;
  padding: 0;
`;

const ServicesContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const ServicesHeader = styled.h2`
  font-family: 'Bree Serif', serif;
  color: #333;
  font-size: 2.5em;
  margin-bottom: 30px;
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
`;

const ServiceItem = styled.li`
  font-size: 1.2em;
  margin-bottom: 15px;
  color: #333;
  position: relative;

  &:before {
    content: "•";
    color: #007BFF;
    font-size: 1.5em;
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
  }
`;

const Services = () => (
  <ServicesSection>
    <ServicesContainer>
      <ServicesHeader>OUR SERVICES</ServicesHeader>
      <ServicesDescription>
        At TaxReturn Management, we are dedicated to providing a comprehensive suite of services to meet your diverse tax needs. Our experienced team ensures accuracy, compliance, and peace of mind.
      </ServicesDescription>
      <ServicesList>
        <ServiceItem>Individual Tax Returns</ServiceItem>
        <ServiceItem>Business Tax Planning and Strategy</ServiceItem>
        <ServiceItem>Audit Support and Representation</ServiceItem>
        <ServiceItem>Bookkeeping and Financial Statements</ServiceItem>
        <ServiceItem>Tax Consultation and Advisory Services</ServiceItem>
        <ServiceItem>IRS Issue Resolution and Appeals</ServiceItem>
        <ServiceItem>Estate and Inheritance Tax Planning</ServiceItem>
        <ServiceItem>Nonprofit Organization Tax Services</ServiceItem>
      </ServicesList>
      <ServicesDescription>
        We tailor our services to your unique situation, ensuring you maximize your deductions and minimize your tax liability. Trust us to navigate the complexities of the tax code so you can focus on what matters most.
      </ServicesDescription>
    </ServicesContainer>
    <Footer />
  </ServicesSection>
);

export default Services;
