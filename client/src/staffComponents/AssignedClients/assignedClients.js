import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assignedClients.css'; // Import the associated CSS file
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import domain from '../../domain/domain';

const AssignedClientList = () => {
    const [clients, setClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(19);
    const token = localStorage.getItem('customerJwtToken');

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get(`${domain.domain}/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
            }
        };

        fetchClients();
    }, [token]);

    const handleEditClick = (clientId) => {
        setIsEditModalOpen(!isEditModalOpen);
        setProfileId(clientId);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="client-list-container">
                <h4>Clients</h4>
                <div className="table-container shadow mt-4">
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th className="text-center">ID</th>
                                <th className="text-center">Name</th>
                                <th className="text-center">Email</th>
                                <th className="text-center">Phone</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.user_id} className="client-row">
                                    <td className="text-center">{client.user_id}</td>
                                    <td className="text-center">{client.first_name}</td>
                                    <td className="text-center">{client.email_address}</td>
                                    <td className="text-center">{client.contact_number}</td>
                                    <td className="text-center">
                                        <button
                                            className="view-profile-button"
                                            onClick={() => handleEditClick(client.user_id)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
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

export default AssignedClientList;
