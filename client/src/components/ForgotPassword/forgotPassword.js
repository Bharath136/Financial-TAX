// ForgotPassword.js
import React, { useState } from 'react';
import domain from '../../domain/domain';
import axios from 'axios';
import './forgotPassword.css';
import showAlert from '../../SweetAlert/sweetalert';
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

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

    const handleResetPassword = async (e) => {
        e.preventDefault();

        try {
            // Check if new password matches confirm password
            if (newPassword !== confirmPassword) {
                setErrorMsg('New password and confirm password must match.');
                return;
            }

            // Send a request to your backend to initiate the password reset process
            await axios.put(`${domain.domain}/user/change-password`, {
                email_address: email,
                new_password: newPassword,
            });

            showAlert({
                title: 'Success!',
                text: 'Password reset success. Please keep it secret.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            setConfirmPassword("")
            setNewPassword("")
            setEmail('')

        } catch (error) {
            // Display an error message using sweetalert
            showAlert({
                title: 'Error!',
                text: error.response?.data?.message || 'An error occurred.',
                icon: 'error',
                confirmButtonText: 'OK',
            });

            console.error('Error:', error);
        }
    };

    return (
        <div className="container forgot-password-container">
            <div className="forgot-password-card shadow text-start">
                <h2 className="forgot-password-header mb-4">Forgot Password</h2>
                <form onSubmit={handleResetPassword} className="form-container">
                    <div className="mb-2 d-flex flex-column">
                        <label htmlFor="email" className="form-label text-dark m-0">
                            Email
                        </label>
                        <input
                            type="email"
                            className="p-2 text-dark"
                            style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
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
                                className="p-2 text-dark"
                                style={{ border: 'none', borderRadius: '4px', outline: 'none', width: '88%' }}
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
                                className="p-2 text-dark"
                                style={{ border: 'none', borderRadius: '4px', outline: 'none', width: '88%' }}
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
                                style={{backgroundColor:'transparent', outline:'none',border:'none'}}
                                onClick={toggleShowConfirmPassword}
                            >
                                {showConfirmPassword ? <VscEyeClosed size={25} /> : <VscEye size={25} />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button w-100 mt-2">
                        Reset Password
                    </button>
                    {errorMsg && <p className="text-danger">{errorMsg}</p>}
                    {successMsg && <p className="text-success">{successMsg}</p>}
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
