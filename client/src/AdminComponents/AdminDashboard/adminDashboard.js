// import './staffDashboard.css';
import Sidebar from '../../userComponents/SideBar/sidebar';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaTasks, FaClipboardList, FaMoneyBillAlt, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';
import noClient from '../../Assets/no-customers.jpg'
import { H1, NoClientContainer, Table, TableContainer, Td, Th, ViewButton } from '../../staffComponents/AssignedClients/styledComponents';
import SweetLoading from '../../SweetLoading/SweetLoading';
import EditModal from '../../SweetPopup/sweetPopup';
import { CurrentUser, DashboardContainer, DashboardItem, DetailsContainer, MainContainer, SectionCard } from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';



const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const dataOrder = [
    'Schedule Interview',
    'Tax Interview',
    'Documents',
    'Tax Preparation',
    'Review',
    'Payments',
    'Client Review',
    'Filing',
    'Client Interview',
];

const AdminDashboard = () => {
    const [currentUser, setCurrentUser] = useState('');
    const [allClients, setAllClients] = useState([]);
    const [selectedCard, setSelectedCard] = useState(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [availableSteps, setAvailableSteps] = useState([]);

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('customerJwtToken');

    const getAllAssignedClients = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const assignedClientsResponse = await axios.get(`${domain.domain}/user/unassigned-clients`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const allClients = await axios.get(`${domain.domain}/user/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setAllClients(allClients)

            if (assignedClientsResponse.status === 200) {
                setApiStatus(apiStatusConstants.success);
               
                const filteredClients = assignedClientsResponse.data.filter(client => client.role === 'CUSTOMER');
                setClients(filteredClients);
            }
        } catch (error) {
            console.error('Error fetching assigned clients:', error);
            setApiStatus(apiStatusConstants.failure);
        }
    };

    const navigate = useNavigate();

    useEffect(() => {
        getAllAssignedClients();
        if (user.role === 'ADMIN') {
            navigate('/admin-dashboard');
        } else if (user.role === 'CUSTOMER') {
            navigate('/user-dashboard');
        }
        if (user) {
            setCurrentUser(user.first_name);
        }

    }, [navigate]);

    const colorMapping = {
        'Schedule Interview': '#42A5F5',
        'Tax Interview': '#FF7043',
        Documents: '#4CAF50',
        'Tax Preparation': '#FFEB3B',
        Review: '#9C27B0',
        Payments: '#EF5350',
        'Client Review': '#00E676',
        Filing: '#FFC107',
        'Client Interview': '#FF9800',
    };

    const calculateTotal = (clients, step) => {};

    const data = {
        'Schedule Interview': { total: calculateTotal(allClients, 'Schedule interview'), description: 'Schedule interview', icon: <FaCalendarAlt size={50} />, color: colorMapping['Schedule Interview'] },
        'Tax Interview': { total: calculateTotal(allClients, 'Complete tax interviews'), description: 'Complete tax interviews', icon: <FaClock size={50} />, color: colorMapping['Tax Interview'] },
        Documents: { total: calculateTotal(allClients, 'Submit required documents'), description: 'Submit required documents', icon: <FaFileAlt size={50} />, color: colorMapping.Documents },
        'Tax Preparation': { total: calculateTotal(allClients, 'Prepare tax documents'), description: 'Prepare tax documents', icon: <FaTasks size={50} />, color: colorMapping['Tax Preparation'] },
        Review: { total: calculateTotal(allClients, 'Review tax information'), description: 'Review tax information', icon: <FaCheck size={50} />, color: colorMapping.Review },
        Payments: { total: calculateTotal(allClients, 'View payment details'), description: 'View payment details', icon: <FaMoneyBillAlt size={50} />, color: colorMapping.Payments },
        'Client Review': { total: calculateTotal(allClients, 'Review client feedback'), description: 'Review client feedback', icon: <FaClipboardList size={50} />, color: colorMapping['Client Review'] },
        Filing: { total: calculateTotal(allClients, 'Submit tax filings'), description: 'Submit tax filings', icon: <FaFileAlt size={50} />, color: colorMapping.Filing },
    };



    const handleCardClick = async (key) => {
        setSelectedCard(key);
        setApiStatus(apiStatusConstants.inProgress);
        const response = await axios.get(`${domain.domain}/user/current-step/${key}`, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (response.status === 200) {
            setClients(response.data)
            setApiStatus(apiStatusConstants.success);
        }
        setTimeout(() => {
            const detailsContainer = document.getElementById('details-container');
            if (detailsContainer) {
                window.scrollTo({
                    top: detailsContainer.offsetTop,
                    behavior: 'smooth',
                });
            }
        }, 100);
    };

    const handleEditClick = clientId => {
        setIsEditModalOpen(!isEditModalOpen);
        setProfileId(clientId);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const handleMoveToClick = (client) => {
        setSelectedClient(client);

        const currentStepIndex = dataOrder.indexOf(client.current_step);
        const stepsAfterCurrent = dataOrder.slice(currentStepIndex + 1);

        setAvailableSteps(stepsAfterCurrent);
    };

    const handleStepChange = async (selectedStep) => {
        // Update the local state to reflect the change
        setSelectedClient((prevClient) => ({
            ...prevClient,
            current_step: selectedStep,
        }));
        setApiStatus(apiStatusConstants.inProgress);

        const response = await axios.post(`${domain.domain}/user/current-step/${selectedClient.user_id}`, { current_step: selectedStep, user }, {
            headers: { Authorization: `Bearer ${token}` },
        })
        if (response) {
            showAlert({
                title: 'Client Moved Successfully!',
                text: 'The client has been moved to further step.',
                icon: 'success',
                confirmButtonText: 'OK',
            });
            getAllAssignedClients();
            setApiStatus(apiStatusConstants.success);
        }

        // Reset available steps after the move
        setAvailableSteps([]);
    };

    const renderClients = () => (
        <TableContainer className='shadow'>
            <Table>
                <thead>
                    <tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Email</Th>
                        <Th>Phone</Th>
                        <Th>Actions</Th>
                        <Th>Update</Th>
                    </tr>
                </thead>
                <tbody>
                    {clients.map(client => (
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
                            <Td>
                                <ViewButton onClick={() => handleMoveToClick(client)}>
                                    Move To
                                </ViewButton>
                            </Td>
                            {/* <Td>{}</Td> */}
                        </tr>
                    ))}
                </tbody>
            </Table>

            {selectedClient && availableSteps.length > 0 && (
                <div className='d-flex align-items-center justify-content-end mt-4'>
                    <label htmlFor="moveTo" className='m-2'><strong>Move To: </strong></label>
                    <select
                        id="moveTo"
                        value=""
                        className='p-2'
                        onChange={(e) => handleStepChange(e.target.value)}
                    >
                        <option value="" disabled>Select an option</option>
                        {availableSteps.map((step) => (
                            <option key={step} value={step}>
                                {step}
                            </option>
                        ))}
                    </select>
                </div>
            )}


            <EditModal
                isOpen={isEditModalOpen}
                profileId={profileId}
                onRequestClose={handleEditModalClose}
                handleOpenClick={handleEditClick}
                isEditable={false}
            />
        </TableContainer>
    );

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>;
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderClients();
            default:
                return null;
        }
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <MainContainer>
                <h2>Welcome <CurrentUser>{currentUser}</CurrentUser></h2>
                <DashboardContainer>
                    {Object.entries(data).map(([key, value]) => (
                        <SectionCard
                            key={key}
                            onClick={() => handleCardClick(key)}
                            className={selectedCard === key ? 'selected' : ''}
                            style={{
                                transform: selectedCard === key ? 'scale(1.06)' : 'initial',
                                borderBottom: selectedCard === key ? `6px solid ${value.color}` : '1px solid blue',
                            }}
                        >

                            <DashboardItem title={value.description} >
                                <div className="dashboard-icon" style={{ color: value.color }}>{value.icon}</div>
                                <div className="dashboard-text">
                                    <h4>{value.description}</h4>
                                    {/* <p><strong>Total: </strong>{value.total.length}</p> */}
                                   
                                </div>
                            </DashboardItem>
                        </SectionCard>
                    ))}
                </DashboardContainer>
                {selectedCard ? (
                    <DetailsContainer id="details-container">
                        <h3>{data[selectedCard].description} Details:</h3>
                        {selectedCard === 'Client Interview' && (
                            <p>
                                This step involves scheduling and conducting a client interview to gather necessary information for further processing.
                            </p>
                        )}
                        {clients.length > 0 ? (
                            <>
                                {renderComponents()}
                            </>
                        ) : (
                            <NoClientContainer>
                                <img src={noClient} alt='img' className='img-fluid' />
                                <H1>No Clients Assigned</H1>
                                <p>Oops! It seems there are no clients assigned to you.</p>
                            </NoClientContainer>
                        )}
                    </DetailsContainer>
                ) :
                    <>
                        {clients.length > 0 && <div>
                            <H1>Unassigned customers</H1>
                            {renderComponents()}
                        </div>}
                    </>
                }
            </MainContainer>
        </div>
    );
};

export default AdminDashboard;
