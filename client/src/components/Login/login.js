import React, { useEffect, useState } from 'react';
import './login.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';
import AuthContext from '../../AuthContext/AuthContext';
import showAlert from '../../SweetAlert/sweetalert';

const Login = () => {
    const initialFormFields = [
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
    ];

    useEffect(() => {
        const token = localStorage.getItem('customerJwtToken');
        if (token) {
            navigate('/user-dashboard');
        }
    }, []);


    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState()

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${domain.domain}/user/login`, formData);
            localStorage.setItem('customerJwtToken', response.data.token);
            const user = response.data.user
            localStorage.setItem('currentUser', JSON.stringify(user))
            if (user.role === 'ADMIN') {
                navigate('/admin-dashboard');
                showAlert({
                    title: 'Admin Login Successful!',
                    text: 'Welcome to Financiltax Admin Portal. You have access to advanced administrative features.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                });
            } else if (user.role === 'STAFF') {
                navigate('/staff-dashboard');
                showAlert({
                    title: 'Staff Login Successful!',
                    text: 'Welcome to Financiltax Staff Portal. You can manage client-related tasks and documents.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                });
            } else {
                navigate('/user-dashboard');
                showAlert({
                    title: 'User Login Successful!',
                    text: 'Welcome to Financiltax User Portal. Explore your tax-related information and manage your profile.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel'
                });
            }

            
            
        } catch (error) {
            setErrorMsg(error.response.data.message)
            console.error('Error:', error);
        }
    };


    return (
        <AuthContext.Consumer>
            {(value) => {
                const { changeLogin } = value;
                const onLogin = () => {
                    changeLogin()
                }

                return (
                    <div className="container login-container d-flex">
                        <div className="login-card shadow text-start">
                            <h2 className="login-header">Login</h2>
                            <p className='signup-description mt-3'>Dosen't have an account yet? <NavLink className='link' to='/signup'> Sign Up</NavLink></p>
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
                                <div className='d-flex align-items-center mt-3 mb-3'>
                                    <input style={{ width: '15px', height: '15px' }} id='remember' type='checkbox' />
                                    <label htmlFor='remember' style={{ marginLeft: '10px' }}>Remember me</label>
                                </div>
                                <button type="submit" onClick={onLogin} className="login-button w-100 mt-2">
                                    Login
                                </button>
                                {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                            </form>
                        </div>
                        <img src='https://estudentbook.com/img/nwdesign/loginbg.png' alt='loginImage' className='img-fluid d-none d-md-block' />
                    </div>
                )
            }}
        </AuthContext.Consumer>
    );
};

export default Login;