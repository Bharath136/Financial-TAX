// ForgotPassword.js
import React, { useState, useEffect } from 'react';
import domain from '../../domain/domain';
import axios from 'axios';
import './forgotPassword.css';
import showAlert from '../../SweetAlert/sweetalert';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import { NavLink, useNavigate } from 'react-router-dom';
import authImage from '../../Assets/reset-password.png'
import { getUserData } from '../../StorageMechanism/storageMechanism'

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const token = getUserData();

    const navigate = useNavigate()

    useEffect(() => {
        if (token) {
            navigate('/user/dashboard')
        }

        let timerInterval;

        if (timer > 0) {
            timerInterval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        }

        return () => {
            clearInterval(timerInterval);
        };
    }, [timer]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const toggleShowNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


    const handleSendOtp = async () => {
        try {
            if (email.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
                setErrorMsg("All fields must be filled");
                return;
            }
            if(email.trim() === ''){
                setErrorMsg('Email is required to get OTP.')
                return
            }

            setLoading(true);

            // Send a request to your backend to initiate OTP generation and email sending
            await axios.post(`${domain.domain}/email/reset/send-otp`, {
                email_address: email,
            });

            setOtpSent(true);
            setErrorMsg('');
            setTimer(120); // 2 minutes
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error sending OTP.');
            console.error('Error sending OTP:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleResetPassword = async () => {

        try {
            setLoading(true);

            // Check if new password matches confirm password
            if (newPassword !== confirmPassword) {
                setErrorMsg('New password and confirm password must match.');
                return;
            }

            // Send a request to your backend to verify the OTP and reset the password
            await axios.put(`${domain.domain}/user/reset-password`, {
                email_address: email,
                new_password: newPassword,
                otp: otp,
            });

            showAlert({
                title: 'Success!',
                text: 'Password reset success. Please keep it secret.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            navigate('/accounts/login')

            setConfirmPassword('');
            setNewPassword('');
            setEmail('');
            setOtp('');
            setTimer(0);

        } catch (error) {
            // Display an error message using sweetalert
            showAlert({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred.',
                icon: 'error',
                confirmButtonText: 'OK',
            });

            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        try {
            if (email.trim() === '' || newPassword.trim() === '' || confirmPassword.trim() === '') {
                setErrorMsg("All fields must be filled");
                return false;
            }
            if (newPassword !== confirmPassword) {
                setErrorMsg('New password and confirm password must match.');
                return;
            }

            const response = await axios.post(`${domain.domain}/email/verify-otp`, {
                email_address: email,
                otp,
            });

            if (response) {
                handleResetPassword()
            } else {
                showAlert({
                    title: 'Error',
                    text: 'Invalid OTP. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);

            if (error.response && error.response.status === 401) {
                // Handle 400 Bad Request error
                const errorMessage = error.response.data.error || 'Invalid OTP. Please try again.';
                setErrorMsg(errorMessage);
            } else {
                // Handle other errors
                const errorMessage = 'Error verifying OTP. Please try again.';
                setErrorMsg(errorMessage);
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
                    className="w-100"
                    style={{ backgroundColor: 'transparent',padding:'14px', border: 'none', borderRadius: '4px', outline: 'none' }}
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
                        width: "100px"
                    }}
                    type="button"
                    onClick={handleSendOtp}
                >
                    {loading ? <span>Sending OTP</span> : <span>Resend</span>}
                </button>
            </div>
            <div className="timer mt-2">
                {timer > 0 && <span>Your OTP expires in {timer} seconds</span>}
                {timer === 0 && <span className='text-danger'>OTP expired. Please request a new one.</span>}
            </div>
            {errorMsg && <span className='text-danger'>{errorMsg}</span>}
            <button type="button" onClick={handleVerifyOtp} className="register-button w-100 mt-2">
                {loading ? "Resetting password..." : <span>Reset password</span>}
            </button>
        </div>
    );



    return (
        <div className="forgot-password-container">
            <img src={authImage} alt='loginImage' className='login-image d-none d-md-block' />
            <div className="forgot-password-card text-start">
                <h2 className="forgot-password-header mb-4">Forgot Password</h2>
                <p className='signup-description mt-3'>Don't want to reset password? <NavLink className='link' to='/accounts/login'> Login</NavLink></p>
                <form className="form-container">
                    <div className="mb-2 d-flex flex-column">
                        <label htmlFor="email" className="form-label text-dark m-0">
                            Email
                        </label>
                        <input
                            type="email"
                            style={{ backgroundColor: 'transparent',padding:'14px', border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                            id="email"
                            placeholder="Enter your registered email"
                            name="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                    </div>
                    <div className="mb-2 d-flex flex-column">
                        <label htmlFor="newPassword" className="form-label text-dark m-0">
                            New Password
                        </label>
                        <div className="input-group w-100 " style={{ border: '1px solid grey', borderRadius: '4px', }}>
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                // className="p-2 text-dark"
                                style={{padding:'14px',backgroundColor:'transparent', border: 'none', borderRadius: '4px', outline: 'none', width: '88%' }}
                                id="newPassword"
                                placeholder="New Password"
                                name="newPassword"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                required
                            />
                            <button
                                type="button"
                                className="eye-button"
                                style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}
                                onClick={toggleShowNewPassword}
                            >
                                {showNewPassword ? <VscEyeClosed size={25} /> : <VscEye size={25} />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-2 d-flex flex-column">
                        <label htmlFor="confirmPassword" className="form-label text-dark m-0">
                            Confirm Password
                        </label>
                        <div className="input-group" style={{ border: '1px solid grey', borderRadius: '4px', }}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                style={{ backgroundColor: 'transparent', padding: '14px', border: 'none', borderRadius: '4px', outline: 'none', width: '88%' }}
                                id="confirmPassword"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                            />
                            <button
                                type="button"
                                className="eye-button"
                                style={{ backgroundColor: 'transparent', outline: 'none', border: 'none' }}
                                onClick={toggleShowConfirmPassword}
                            >
                                {showConfirmPassword ? <VscEyeClosed size={25} /> : <VscEye size={25} />}
                            </button>
                        </div>
                    </div>
                    {otpSent ? renderOtpSection() : null}
                    {!otpSent && <button
                        type="button"
                        className={`login-button w-100 mt-2 ${loading ? 'disabled' : ''}`}
                        onClick={handleSendOtp}
                        disabled={loading}
                    >
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
