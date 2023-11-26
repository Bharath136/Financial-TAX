import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import domain from '../../domain/domain';
import { ClientListContainer, H1, Table, TableContainer, Td, Th, ViewButton } from './styledComponents';

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
            <ClientListContainer>
                <H1>Clients</H1>
                <TableContainer>
                    <Table>
                        <thead>
                            <tr>
                                <Th>ID</Th>
                                <Th>Name</Th>
                                <Th>Email</Th>
                                <Th>Phone</Th>
                                <Th>Actions</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.user_id}>
                                    <Td>{client.user_id}</Td>
                                    <Td>{client.first_name}</Td>
                                    <Td>{client.email_address}</Td>
                                    <Td>{client.contact_number}</Td>
                                    <Td>
                                        <ViewButton
                                            onClick={() => handleEditClick(client.user_id)}
                                        >
                                            View Profile
                                        </ViewButton>
                                    </Td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </ClientListContainer>

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
