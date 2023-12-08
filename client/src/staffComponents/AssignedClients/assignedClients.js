import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../userComponents/SideBar/sidebar';
import EditModal from '../../SweetPopup/sweetPopup';
import domain from '../../domain/domain';
import { ClientListContainer, H1, MainContainer, NoClientContainer, Table, TableContainer, Td, Th, ViewButton } from './styledComponents';
import noClient from '../../Assets/no-customers.jpg'
import SweetLoading from '../../SweetLoading/SweetLoading';
import Footer from '../../components/Footer/footer';
import { useNavigate } from 'react-router-dom';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const AssignedClientList = () => {
    const token = localStorage.getItem('customerJwtToken');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const [myClients, setMyClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser.role === 'ADMIN') {
            navigate('/admin-dashboard')
        } else if (currentUser.role === 'CUSTOMER') {
            navigate('/user-dashboard')
        }
        const getAllAssignedClients = async () => {
            setApiStatus(apiStatusConstants.inProgress);
            try {
                const assignedClientsResponse = await axios.get(`${domain.domain}/user/staff-clients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (assignedClientsResponse.status) {
                    setApiStatus(apiStatusConstants.success);
                    const filteredClients = assignedClientsResponse.data.filter(client => client.staff_id === currentUser.user_id);
                    setMyClients(filteredClients);
                }
            } catch (error) {
                console.error('Error fetching assigned clients:', error);
                setApiStatus(apiStatusConstants.failure);
            }
        };

        getAllAssignedClients();
    }, [token]); // Only token is a valid dependency here


    const handleEditClick = clientId => {
        setIsEditModalOpen(!isEditModalOpen);
        setProfileId(clientId);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>;
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return (
                    <TableContainer className='shadow'>
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
                                {myClients.map(client => (
                                    <tr key={client.user_id}>
                                        <Td>{client.user_id}</Td>
                                        <Td>{client.first_name}</Td>
                                        <Td>{client.email_address}</Td>
                                        <Td>{client.contact_number}</Td>
                                        <Td>
                                            <ViewButton onClick={() => handleEditClick(client.user_id)}>
                                                View Profile
                                            </ViewButton>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableContainer>
                );
            default:
                return null;
        }
    };

    return (
        <div className='d-flex'>
            <Sidebar />
                <ClientListContainer>
                    <H1>Clients</H1>
                    {myClients.length > 0 ? renderComponents() :
                        <NoClientContainer>
                            <img src={noClient} alt='img' className='img-fluid' />
                            <H1>No Clients Assigned</H1>
                            <p>Oops! It seems there are no clients assigned to you.</p>
                        </NoClientContainer>
                    }
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
