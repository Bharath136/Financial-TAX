import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './clients.css'; // Import the associated CSS file
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import SweetLoading from '../../SweetLoading/SweetLoading';

const Clients = () => {
    const [clients, setClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(19);
    const token = localStorage.getItem('customerJwtToken');
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${domain.domain}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = response.data;
                const filteredData = data.filter((user) => {
                    return user.role === 'CUSTOMER'
                })
                setClients(filteredData);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };
        fetchClients()
    }, [token]);



    const handleEditClick = () => {
        setIsEditModalOpen(!isEditModalOpen);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="client-list-container">
                <h4>Clients</h4>
                {loading ? <SweetLoading loading={loading} setLoading={setLoading} /> : <div className="table-container shadow mt-4">
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.user_id} className="client-row">
                                    <td>{client.user_id}</td>
                                    <td>{client.first_name}</td>
                                    <td>{client.email_address}</td>
                                    <td>{client.contact_number}</td>
                                    <td>
                                        <button
                                            className="view-profile-button"
                                            onClick={() => {
                                                handleEditClick();
                                                setProfileId(client.user_id);
                                            }}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div>

            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={false}
            />
        </div>
    );
};

export default Clients;
