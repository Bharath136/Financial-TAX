import React, { useEffect, useState } from 'react';
import './login.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';
import AuthContext from '../../AuthContext/AuthContext';
import showAlert from '../../SweetAlert/sweetalert';
import authImage from '../../Assets/loginbg.png'

const Login = ({ setShowNav }) => {
    const initialFormFields = [
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
    ];

    const token = localStorage.getItem('customerJwtToken');
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate('/user-dashboard');
        }
    }, [token, navigate]);

    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${domain.domain}/user/login`, formData);
            localStorage.setItem('customerJwtToken', response.data.token);
            const user = response.data.user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            setShowNav(false)
            let destination = '/user-dashboard';
            let successMessage = 'User Login Successful! Welcome to Financiltax User Portal. Explore your tax-related information and manage your profile.';

            if (user.role === 'ADMIN') {
                destination = '/admin-dashboard';
                successMessage = 'Admin Login Successful! Welcome to Financiltax Admin Portal. You have access to advanced administrative features.';
            } else if (user.role === 'STAFF') {
                destination = '/staff-dashboard';
                successMessage = 'Staff Login Successful! Welcome to Financiltax Staff Portal. You can manage client-related tasks and documents.';
            }

            navigate(destination);

            showAlert({
                title: 'Login Successful!',
                text: successMessage,
                icon: 'success',
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
            });
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'An error occurred during login.');
            console.error('Error:', error);
        }
    };

    return (
        <AuthContext.Consumer>
            {(value) => {
                const { changeLogin } = value;
                return (
                    <div className="container login-container d-flex">
                        <div className="login-card shadow text-start">
                            <h2 className="login-header">Login</h2>
                            <p className='signup-description mt-3'>Don't have an account yet? <NavLink className='link' to='/signup'> Sign Up</NavLink></p>
                            <form onSubmit={handleSubmit} className='form-container'>
                                {initialFormFields.map((field, index) => (
                                    <div className="mb-2 d-flex flex-column" key={index}>
                                        <div className='d-flex justify-content-between'>
                                            <label htmlFor={field.name} className="form-label text-dark m-0">
                                                {field.label}
                                            </label>
                                            {field.name === 'password' && <Link className='link'>Forgot password?</Link>}
                                        </div>
                                        <input
                                            type={field.type}
                                            className="p-2 text-dark"
                                            style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                                            id={field.name}
                                            placeholder={field.placeholder}
                                            name={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                ))}
                                <div className='d-flex align-items-center mt-3 mb-3'>
                                    <input style={{ width: '15px', height: '15px' }} id='remember' type='checkbox' />
                                    <label htmlFor='remember' style={{ marginLeft: '10px' }}>Remember me</label>
                                </div>
                                <button type="submit" onClick={changeLogin} className="login-button w-100 mt-2">
                                    Login
                                </button>
                                {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                            </form>
                        </div>
                        <img src={authImage} alt='loginImage' className='img-fluid d-none d-md-block' />
                    </div>
                );
            }}
        </AuthContext.Consumer>
    );
};

export default Login;
