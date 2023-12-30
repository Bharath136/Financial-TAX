import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EditModal from '../../SweetPopup/sweetPopup';
import domain from '../../domain/domain';
import { ClientListContainer, H1, NoClientContainer, Table, TableContainer, Td, Th, ViewButton } from './styledComponents';
import noClient from '../../Assets/no-customers.png'
import SweetLoading from '../../SweetLoading/SweetLoading';
import { useNavigate } from 'react-router-dom';
import FailureComponent from '../../FailureComponent/failureComponent';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const AssignedClientList = () => {
    const token = getToken();
    const currentUser = getUserData();

    const [myClients, setMyClients] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

    const navigate = useNavigate();

    useEffect(() => {
        if (currentUser) {
            if (currentUser.role === 'ADMIN') {
                navigate('/admin/dashboard')
            } else if (currentUser.role === 'CUSTOMER') {
                navigate('/user/dashboard')
            }
        }
        const getAllAssignedClients = async () => {
            setApiStatus(apiStatusConstants.inProgress);
            try {
                const assignedClientsResponse = await axios.get(`${domain.domain}/user/staff-clients`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (assignedClientsResponse.status === 200) {
                    setApiStatus(apiStatusConstants.success);
                    const filteredClients = assignedClientsResponse.data.filter(client => client.staff_id === currentUser.user_id);
                    setMyClients(filteredClients);
                }
            } catch (error) {
                setApiStatus(apiStatusConstants.failure);
                setErrorMsg(error || 'An unexpected error occurred. Please try again later.');
            }
        };

        getAllAssignedClients();
    }, [token, navigate]);

    const handleEditClick = clientId => {
        setIsEditModalOpen(!isEditModalOpen);
        setProfileId(clientId);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const renderClients = () => (
        <ClientListContainer>
            <H1>Clients</H1>
            {myClients.length > 0 ? <TableContainer className='shadow'>
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
            </TableContainer> :
                <NoClientContainer>
                    <img src={noClient} alt='img' className='img-fluid' />
                    <H1>No Clients Assigned</H1>
                    <p>Oops! It seems there are no clients assigned to you.</p>
                </NoClientContainer>
            }
        </ClientListContainer>
    );

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />;
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderClients();
            default:
                return null;
        }
    };

    return (
        <>
            {renderComponents()}
            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={false}
            />
        </>
    );
};

export default AssignedClientList;
