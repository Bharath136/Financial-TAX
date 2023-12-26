import React, { useEffect, useState } from 'react';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import './register.css';
import { NavLink, useNavigate } from 'react-router-dom';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import authImage from '../../Assets/loginbg.png';
import renderLoader from '../../SweetLoading/ButtonLoader'


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const Register = () => {

    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [apiStatusOTP, setApiStatusOTP] = useState(apiStatusConstants.initial)
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

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
    const [timer, setTimer] = useState(); // Initial timer value in seconds

    useEffect(() => {
        let interval;

        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => clearInterval(interval); // Cleanup on component unmount or when timer reaches 0

    }, [otpSent, timer]);

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


    const handleGetOtp = async () => {
        
        try {
            setApiStatusOTP(apiStatusConstants.inProgress);
            if(formData.email_address === undefined || ''){
                setErrorMsg("Email is required to get OTP.")
            }

            const response = await axios.post(`${domain.domain}/email/send-otp`, {
                email_address: formData.email_address,
            });

            if (response) {
                setTimer(120);
                setOtpSent(true);
                showAlert({
                    title: 'OTP Sent!',
                    text: 'OTP has been sent to your email address.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setApiStatusOTP(apiStatusConstants.success);
            } else {
                showAlert({
                    title: 'Error',
                    text: 'Failed to send OTP. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                setApiStatusOTP(apiStatusConstants.success);
            }
        } catch (error) {
            console.error('Error sending OTP:', error);
            setApiStatusOTP(apiStatusConstants.success);
        }
    };

    const validateFields = () => {
        const requiredFields = ['first_name', 'last_name', 'contact_number', 'password', 'email_address'];

        for (const field of requiredFields) {
            if (!formData[field] || formData[field].trim() === '') {
                setErrorMsg("All fields must be filled");
                return false;
            }
        }

        return true;
    };


    const handleSubmit = async () => {
        try {
            const res = await axios.post(`${domain.domain}/user/register`, formData);
            console.log(res);

            if (res.status === 201) {
                showAlert({
                    title: 'Email Verified, Registration Successful!',
                    text: "Welcome to our financial tax app. Let's log in and explore!",
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setApiStatus(apiStatusConstants.success);
                localStorage.setItem('profileBg', getRandomColor());
                navigate('/accounts/login');
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.error('Server error:', error.response);
                setErrorMsg(error.response.data.error || 'Registration failed. Please try again.');
            } else {
                console.error('Error registering user:', error);
                setErrorMsg('Registration failed. Please try again.');
            }

            setApiStatus(apiStatusConstants.failure);
        }
    };





    const handleVerifyOtp = async () => {
        try {
            setApiStatus(apiStatusConstants.inProgress);
            if (!validateFields()) {
                setApiStatus(apiStatusConstants.success);
                return;
            }else{
                setErrorMsg('')
            }

            const response = await axios.post(`${domain.domain}/email/verify-otp`, {
                email_address: formData.email_address,
                otp,
            });
            
            console.log(response)
            if (response) {
                
                setApiStatus(apiStatusConstants.success);
                handleSubmit()
                
                
            } else {
                showAlert({
                    title: 'Error',
                    text: 'Invalid OTP. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
                setApiStatus(apiStatusConstants.success);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);

            if (error.response && error.response.status === 401) {
                // Handle 400 Bad Request error
                const errorMessage = error.response.data.error || 'Invalid OTP. Please try again.';
                setErrorMsg(errorMessage);
                setApiStatus(apiStatusConstants.failure);
            } else {
                // Handle other errors
                const errorMessage = 'Error verifying OTP. Please try again.';
                setErrorMsg(errorMessage);
                setApiStatus(apiStatusConstants.failure);
            }
        }
    };

    const renderOtpSection = () => (
        <div className="otp-section">
            <label htmlFor="otp" className="form-label text-dark m-0">
                Enter OTP sent to your email:
            </label>
            <div className='d-flex' style={{ border: '1px solid grey', borderRadius: '4px', }}>
                <input
                    type="text"
                    className="p-2 text-dark w-100"
                    style={{ border: 'none', borderRadius: '4px', outline: 'none' }}
                    id="otp"
                    placeholder="Enter OTP"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <button
                    disabled={timer > 0}
                    style={{
                        outline: 'none',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        backgroundColor: `var(--accent-background)`,
                        cursor: timer > 0 ? 'not-allowed' : 'pointer',
                        color: '#fff',
                        width:"100px"
                    }}
                    type="button"
                    onClick={handleGetOtp}
                >
                    {apiStatusOTP === apiStatusConstants.inProgress ? renderLoader() : <span>Resend</span>}
                </button>
            </div>
            <div className="timer mt-2">
                {timer > 0 && <span>Your OTP expires in {timer} seconds</span>}
                {timer === 0 && <span className='text-danger'>OTP expired. Please request a new one.</span>}
            </div>
            {errorMsg && <span className='text-danger'>{errorMsg}</span>}
            <button type="button" onClick={handleVerifyOtp} className="register-button w-100 mt-2">
                {apiStatus === apiStatusConstants.inProgress ? renderLoader(): <span>Verify</span>}
            </button>
        </div>
    );


    // const renderLoader = () => {
    //     return(
    //         <div className="spinner-border text-primary" role="status">
    //             <span className="sr-only"></span>
    //         </div>
    //     )
    // }


    const renderRegistrationForm = () => {
        return (
            <div className='register-main-container'>
                <div className="register-container d-flex">
                    <img src={authImage} alt='loginImage' className='img-fluid d-none d-md-block' />
                    <div className="register-card text-start">
                        <h2 className="register-header">Register</h2>
                        <p className='signup-description mt-3'>Already have an account? <NavLink className='link' to='/accounts/login'> Sign In</NavLink></p>
                        <form className='form-container'>
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
                            {otpSent ? renderOtpSection() : null}
                            {!otpSent && errorMsg && <span className='text-danger'>{errorMsg}</span>}
                            {!otpSent && <button type="button" onClick={handleGetOtp} className="register-button w-100 mt-2">
                                {apiStatusOTP === apiStatusConstants.inProgress ? renderLoader(): <span>Get OTP</span> }
                            </button>}
                        </form>
                    </div>
                </div>
            </div>
        );
    }


    const renderComponents = () => {
        switch (apiStatus) {
            // case apiStatusConstants.inProgress:
            //     return <div style={{marginTop:'200px'}}><SweetLoading /></div>;
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
