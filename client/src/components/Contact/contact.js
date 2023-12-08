import React, { useState } from 'react';
import './contact.css'; // Import the CSS file for styling
import Footer from '../Footer/footer';

const Contact = () => {
    const initialFormFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Name', value: '' },
        { name: 'number', label: 'Mobile Number', type: 'text', placeholder: 'Mobile Number', value: '' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email', value: '' },
        { name: 'subject', label: 'Subject', type: 'text', placeholder: 'Subject', value: '' },
        { name: 'message', label: 'Message', type: 'textarea', placeholder: 'Type a Message...', value: '' },
    ];

    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
    };

    return (
        <>
            <section id="contact-us" className="contact-us-container">
                <div className="container">
                    <h2 className="section-title text-center mb-5">CONTACT US</h2>
                    <div className="row">
                        <div className="col-md-6 text-start">
                            <form onSubmit={handleSubmit} className="contact-form content">
                                {initialFormFields.map((field, index) => (
                                    <div className="form-group" key={index}>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                rows={5}
                                                className="form-control mb-4 shadow"
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                className="form-control mb-4 shadow"
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        )}
                                    </div>
                                ))}
                                <button type="submit" className="btn bg-dark text-warning border button mb-3">Submit</button>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <div className="text-start content">
                                <p>
                                    Have questions or need assistance? Feel free to reach out to us using the form. We'll get back to you as soon as possible.
                                </p>
                                <p>
                                    Our team is dedicated to providing top-notch customer support and addressing any inquiries or concerns you may have.
                                </p>
                                <p>
                                    <span className='span-text'>Address:</span> 123 Main Street, City, Country
                                </p>
                                <p><span className='span-text'>Phone:</span> +1 (123) 456-7890</p>
                                <p><span className='span-text'>Email:</span> info@yourwebsite.com</p>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
            <Footer />
        </>
    );
};

export default Contact;
