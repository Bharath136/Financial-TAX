import React, { useEffect, useState } from 'react';
import domain from '../../domain/domain';
import axios from 'axios';
import showAlert from '../../SweetAlert/sweetalert';
import Sidebar from '../../userComponents/SideBar/sidebar';
import { AddStaffButton, AddStaffCard, AddStaffContainer, AddStaffHeader, ButtonContainer, FormLabel, MarginBottom2 } from './styledComponents.js';
import { useNavigate } from 'react-router-dom';

const AddStaff = () => {
    const initialFormFields = [
        { label: 'First Name', name: 'first_name', type: 'text', placeholder: 'First Name' },
        { label: 'Last Name', name: 'last_name', type: 'text', placeholder: 'Last Name' },
        { label: 'Email', name: 'email_address', type: 'email', placeholder: 'Email' },
        { label: 'Phone', name: 'contact_number', type: 'umber', placeholder: 'Mobile Number' },
        { label: 'Password', name: 'password', type: 'text', placeholder: 'Password' },
        { label: 'Secret Code', name: 'secret_code', type: 'text', placeholder: 'Secret Code' },
    ];

    const [formData, setFormData] = useState({});
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'STAFF') {
                navigate('/staff-dashboard')
            } else if (currentUser.role === 'CUSTOMER') {
                navigate('/user-dashboard')
            }
        }
    }, [currentUser, navigate])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))

        const newFormData = { ...formData, created_by: currentUser.first_name }
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
            setFormData({})
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <AddStaffContainer>
            <AddStaffCard className='shadow'>
                <AddStaffHeader >Add Staff</AddStaffHeader>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        {initialFormFields.map((field, index) => (
                            <div className='col-12 col-md-6' key={index}>
                                <MarginBottom2 >
                                    <FormLabel htmlFor={field.name} >
                                        <strong>{field.label}</strong>
                                    </FormLabel>
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
                                </MarginBottom2>
                            </div>
                        ))}
                    </div>
                    <ButtonContainer>
                        <AddStaffButton type="submit">
                            Add Staff
                        </AddStaffButton>
                    </ButtonContainer>

                </form>
            </AddStaffCard>
        </AddStaffContainer>
    );
};

export default AddStaff;
