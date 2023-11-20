import React from 'react';
import './footer.css'; // Create a corresponding CSS file for styling

const Footer = () => {
    return (
        <div className="site-footer">
            <div className="footer-container">
                <div className="row">
                    <div className="col-md-4">
                        <h4>About Us</h4>
                        <p>
                            We are dedicated to simplifying tax management and financial services for individuals and businesses. Our goal is to make your financial life easier and more efficient.
                        </p>
                    </div>
                    <div className="col-md-4">
                        <h4>Quick Links</h4>
                        <ul className="list-unstyled">
                            <li><a href="/">Home</a></li>
                            <li><a href="/about">About</a></li>
                            <li><a href="/services">Services</a></li>
                            <li><a href="/contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="col-md-4">
                        <h4>Contact Us</h4>
                        <address>
                            <p><strong>Address:</strong> 123 Main St, City, Country</p>
                            <p><strong>Email:</strong> info@yourwebsite.com</p>
                            <p><strong>Phone:</strong> +1 (123) 456-7890</p>
                        </address>
                    </div>
                </div>
            </div>
            <div className="text-center mt-3 copy-right text-light p-4">
                <p>&copy; {new Date().getFullYear} Your Company Name. All rights reserved.</p>
            </div>
        </div>

    );
};

export default Footer;
