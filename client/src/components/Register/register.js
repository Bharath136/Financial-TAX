import React, { useEffect, useState } from 'react';
import './register.css'
import { NavLink, useNavigate } from 'react-router-dom';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import authImage from '../../Assets/loginbg.png'

const Register = () => {
    const initialFormFields = [
        { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Phone', name: 'contact_number', type: 'umber', placeholder: 'Mobile Number' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
    ];

    const randomColors = [
        '#42A5F5',
        '#FF7043',
        '#4CAF50',
        '#FFEB3B',
        '#9C27B0',
        '#EF5350',
        '#00E676',
        '#FFC107',
        '#03A9F4',
        '#FF5722'
    ];

    const [formData, setFormData] = useState({});

    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    function getRandomColor() {
        return randomColors[Math.floor(Math.random() * 10)];
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        axios.post(`${domain.domain}/user/register`, formData)
            .then((response) => {
                console.log('Successful response:', response.data);
                console.log('Form submitted:', formData);
                navigate('/login')
                showAlert({
                    title: 'Registration Successful!',
                    text: "Welcome to our financial tax app. Let's log in and explore!",
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                localStorage.setItem('profileBg',getRandomColor())

            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };



    return (
        <div className='register-main-container'>
            <div className="container register-container d-flex">
                <img src={authImage} alt='loginImage' className='img-fluid d-none d-md-block' />
                <div className="register-card shadow text-start">
                    <h2 className="register-header">Register</h2>
                    <p className='signup-description mt-3'>Already have an account? <NavLink className='link' to='/login'> Sign In</NavLink></p>
                    <form onSubmit={handleSubmit} className='form-container'>
                        {initialFormFields.map((field, index) => (
                            <div className="mb-2 d-flex flex-column" key={index}>
                                    <label htmlFor={field.name} className="form-label text-dark m-0">
                                        {field.label}
                                    </label>
                                <input
                                    type={field.type}

                                    className="p-2 text-dark" style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                                    id={field.name}
                                    placeholder={field.placeholder}
                                    name={field.name}
                                    value={formData[field.name] || ''}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <button type="submit" className="register-button w-100 mt-2">
                            Register
                        </button>

                    </form>
                </div>
                
            </div>
        </div>
    );
};

export default Register;
