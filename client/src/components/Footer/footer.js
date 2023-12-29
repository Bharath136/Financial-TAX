// src/components/Footer.js
import React from 'react';
import { SiteFooter, FooterContainer, Row, Column, Heading, Paragraph, UnorderedList, ListItem, Address, CopyRightSection, MessageContainer, Message, ContactLink } from './styledComponents';

const Footer = () => {
    return (
        <SiteFooter>
            <FooterContainer>
                <Row>
                    <Column>
                        <Heading>About Us</Heading>
                        <Paragraph>
                            We are dedicated to simplifying tax management and financial services for individuals and businesses. Our goal is to make your financial life easier and more efficient.
                        </Paragraph>
                    </Column>
                    <Column>
                        <Heading>Quick Links</Heading>
                        <UnorderedList>
                            <ListItem><a href="/">Home</a></ListItem>
                            <ListItem><a href="/about">About</a></ListItem>
                            <ListItem><a href="/services">Services</a></ListItem>
                            <ListItem><a href="/contact">Contact</a></ListItem>
                        </UnorderedList>
                    </Column>
                    <Column>
                        <Heading>Contact Us</Heading>
                        <Address>
                            <Paragraph><strong>Address:</strong> 123 Main St, City, Country</Paragraph>
                            <Paragraph><strong>Email:</strong> info@uniprofin.com</Paragraph>
                            <Paragraph><strong>Phone:</strong> +1 (123) 456-7890</Paragraph>
                        </Address>
                    </Column>
                </Row>
                <CopyRightSection>
                    <Paragraph>&copy; {new Date().getFullYear()} UniProFin. All rights reserved.</Paragraph>
                    <Paragraph>For further assistance or if you have any questions, please don't hesitate to <a href="/contact">contact our support team</a>.</Paragraph>
                </CopyRightSection>
            </FooterContainer>
        </SiteFooter>
    );
};

export default Footer;

export const email = 'info@uniprofin.com'
export const support = 'support@uniprofin.com'
export const phone = '+91 9512368745'
export const location = '123 Main Street, City, Country'


export const message = <MessageContainer className='shadow'>

    <Message> <strong className='text-start'>Note: </strong>
        Please feel free to contact us at{' '}
        <ContactLink href=''>{phone}</ContactLink> for any further assistance or
        send the documents to <ContactLink href={`mailto:${support}`}>{support}</ContactLink>.
    </Message>
</MessageContainer>

