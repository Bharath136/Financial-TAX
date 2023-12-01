import React, { useState } from 'react';
import './addStaff.css'
import { useNavigate } from 'react-router-dom';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import Sidebar from '../../userComponents/SideBar/sidebar';

const AddStaff = () => {
    const initialFormFields = [
        { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Phone', name: 'contact_number', type: 'umber', placeholder: 'Mobile Number' },
        { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
    ];

    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        const newFormData = {...formData, created_by:currentUser.first_name}

        try {
            await axios.post(`${domain.domain}/user/add-staff`, newFormData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('customerJwtToken')}`,
                },
            });
            showAlert({
                title: 'Staff Added Successfully!',
                text: "You can now assign a client to the newly added staff member.",
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <div className='d-flex'>
        <Sidebar/>
            <div className="add-staff-container">
                <div className="add-staff-card shadow text-start">
                    <h2 className="add-staff-header">Add Staff</h2>
                    <form onSubmit={handleSubmit} className='form-container'>
                        <div className='row'>
                            {initialFormFields.map((field, index) => (
                                <div className='col-12 col-md-6' key={index}>
                                    <div className="mb-2 d-flex flex-column" >
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
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="add-staff-button w-100 mt-2">
                            Add Staff
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default AddStaff;
