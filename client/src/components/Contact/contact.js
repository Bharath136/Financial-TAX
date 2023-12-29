import React, { useState } from 'react';
import domain from '../../domain/domain'
import axios from 'axios'
import showAlert from '../../SweetAlert/sweetalert';
import './contact.css'; 
import Footer, { email, location, phone } from '../Footer/footer';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.post(`${domain.domain}/contact/message`,formData)
        if(response.status === 200){
            showAlert({
                title: 'Message sent Successful!',
                text: '',
                icon: 'success',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
            });
            setFormData({})
        }
    };

    return (
        <>
            <section id="contact-us" className="contact-us-container">
                <div className="container container-section">
                    <h2 className="section-title">Get In Touch</h2>
                    <p className="section-description">We are here to help you! how can we help?</p>
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
                                                className="form-control mb-4"
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                required
                                            ></textarea>
                                        ) : (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                placeholder={field.placeholder}
                                                className="form-control mb-4"
                                                value={formData[field.name] || ''}
                                                onChange={handleChange}
                                                required
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className='d-flex align-items-center justify-content-end'>
                                    <button type="submit" className="btn text-center" style={{ backgroundColor: `var(--main-background-shade)`, color:`var(--accent-background)`,fontWeight:'500', padding:'10px 30px'}}>SUBMIT</button>
                                </div>
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
                                    <span className='span-text'>Address:</span> {location}
                                </p>
                                <p><span className='span-text'>Phone:</span> {phone}</p>
                                <p><span className='span-text'>Email:</span> {email}</p>
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
