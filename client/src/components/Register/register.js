import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import './register.css';
import { NavLink, useNavigate } from 'react-router-dom';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import authImage from '../../Assets/loginbg.png';
import SweetLoading from '../../SweetLoading/SweetLoading'


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const Register = () => {

    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

    const initialFormFields = [
        { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Phone', name: 'contact_number', type: 'tel', placeholder: 'Mobile Number' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
    ];

    const randomColors = [
        '#42A5F5',
        '#FF7043',
        '#4CAF50',
        '#9C27B0',
        '#EF5350',
        '#00E676',
        '#FFC107',
        '#03A9F4',
        '#FF5722'
    ];

    const [formData, setFormData] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    function getRandomColor() {
        return randomColors[Math.floor(Math.random() * randomColors.length)];
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        setApiStatus(apiStatusConstants.inProgress);

        try {
            const response = await axios.post(`${domain.domain}/user/register`, formData);

            if (response) {
                navigate('/accounts/login');
                showAlert({
                    title: 'Registration Successful!',
                    text: "Welcome to our financial tax app. Let's log in and explore!",
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                setApiStatus(apiStatusConstants.success);
                localStorage.setItem('profileBg', getRandomColor());
            }
        } catch (error) {
            console.error('Error:', error);
            setApiStatus(apiStatusConstants.failure);
        }
    };

    const renderRegistrationForm = () => {
        return (
            <div className='register-main-container'>
                <div className="register-container d-flex">
                    <img src={authImage} alt='loginImage' className='img-fluid d-none d-md-block' />
                    <div className="register-card text-start">
                        <h2 className="register-header">Register</h2>
                        <p className='signup-description mt-3'>Already have an account? <NavLink className='link' to='/accounts/login'> Sign In</NavLink></p>
                        <form onSubmit={handleSubmit} className='form-container'>
                            {initialFormFields.map((field, index) => (
                                <div className="mb-2 d-flex flex-column" key={index}>
                                    <label htmlFor={field.name} className="form-label text-dark m-0">
                                        {field.label}
                                    </label>
                                    <div className="input-group w-100" style={{ border: '1px solid grey', borderRadius: '4px' }}>
                                        <input
                                            type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
                                            className="p-2 text-dark"
                                            style={{ border: 'none', borderRadius: '4px', outline: 'none', width: '88%' }}
                                            id={field.name}
                                            placeholder={field.placeholder}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                        {field.type === 'password' && (
                                            <button
                                                type="button"
                                                className="eye-button"
                                                style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}
                                                onClick={toggleShowPassword}
                                            >
                                                {showPassword ? <VscEyeClosed size={25} /> : <VscEye size={25} />}
                                            </button>
                                        )}
                                    </div>
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
    }


    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <div style={{marginTop:'300px'}}><SweetLoading /></div>;
            case apiStatusConstants.failure:
                return renderRegistrationForm();
            case apiStatusConstants.success:
                return renderRegistrationForm();
            default:
                return renderRegistrationForm();
        }
    };

    return (
        renderComponents()
    )
    

};

export default Register;
