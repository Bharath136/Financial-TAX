import './staffDashboard.css';
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaTasks, FaClipboardList, FaMoneyBillAlt, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';
import noClient from '../../Assets/no-customers.jpg'
import { H1, NoClientContainer } from '../AssignedClients/styledComponents';
import SweetLoading from '../../SweetLoading/SweetLoading';
import { CurrentUser, DashboardContainer, DashboardItem, DetailsContainer, MainContainer, SectionCard } from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import SecretCode from '../SecretCodePopup/secretCodePopup';
import ClientTable from './clientTable';


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const dataOrder = [
    "Scheduling",
    'TaxInterview',
    'Documents',
    'TaxPreparation',
    'Review',
    'Payments',
    'Filing',
    'Client Interview',
];

const StaffDashboard = () => {
    const [currentUser, setCurrentUser] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [profileId, setProfileId] = useState(null);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [availableSteps, setAvailableSteps] = useState([]);
    const [customerResponse, setCustomerResponse] = useState('');
    const [showSecretCodePopup, setShowSecretCodePopup] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [allClients, setAllClients] = useState([]);

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const token = localStorage.getItem('customerJwtToken');

    const getAllAssignedClients = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const assignedClientsResponse = await axios.get(`${domain.domain}/user/staff-clients`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const allClients = await axios.get(`${domain.domain}/user/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const filteredClients = allClients.data.filter(client => client.role === 'CUSTOMER');

            setAllClients(filteredClients)

            if (assignedClientsResponse.status === 200) {
                setApiStatus(apiStatusConstants.success);
                const filteredClients = assignedClientsResponse.data.filter(client => client.staff_id === user.user_id && client.current_step === null);
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
        if (user) {
            setCurrentUser(user.first_name);
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }

    }, [navigate]);

    const calculateTotal = (clients, step) => {
        const total = clients.filter((client) => client.current_step === step)
        return total.length
    };

    const colorMapping = {
        Scheduling: '#42A5F5',
        TaxInterview: '#FF7043',
        Documents: '#4CAF50',
        TaxPreparation: '#FFEB3B',
        Review: '#9C27B0',
        Payments: '#EF5350',
        ClientReview: '#00E676',
        Filing: '#FFC107',
        ClientInterview: '#FF9800',
    };

    const data = {
        Scheduling: { description: "Scheduling", total: calculateTotal(allClients, 'Scheduling'), icon: <FaCalendarAlt size={50} />, color: colorMapping["Scheduling"] },
        TaxInterview: { description: 'TaxInterview', total: calculateTotal(allClients, 'TaxInterview'), icon: <FaClock size={50} />, color: colorMapping['TaxInterview'] },
        Documents: { description: 'Documents', total: calculateTotal(allClients, 'Documents'), icon: <FaFileAlt size={50} />, color: colorMapping.Documents },
        TaxPreparation: { description: 'TaxPreparation', total: calculateTotal(allClients, 'TaxPreparation'), icon: <FaTasks size={50} />, color: colorMapping['TaxPreparation'] },
        Review: { description: 'Review', total: calculateTotal(allClients, 'Review'), icon: <FaCheck size={50} />, color: colorMapping.Review },
        Payments: { description: 'Payments', total: calculateTotal(allClients, 'Payments'), icon: <FaMoneyBillAlt size={50} />, color: colorMapping.Payments },
        ClientReview: { description: 'ClientReview', total: calculateTotal(allClients, 'ClientReview'), icon: <FaClipboardList size={50} />, color: colorMapping['ClientReview'] },
        Filing: { description: 'Filing', total: calculateTotal(allClients, 'Filing'), icon: <FaFileAlt size={50} />, color: colorMapping.Filing },
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

    const onChangeAccess = () => {
        setIsAuthenticated(!isAuthenticated)
    }

    const handleEditClick = clientId => {
        setIsEditModalOpen(!isEditModalOpen);
        setProfileId(clientId);
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
    };

    const handleMoveToClick = (client) => {
        setShowSecretCodePopup(true);
        setSelectedClient(client);

        const currentStepIndex = dataOrder.indexOf(client.current_step);
        const stepsAfterCurrent = dataOrder.slice(currentStepIndex + 1);

        setAvailableSteps(stepsAfterCurrent);
    };

    const handleStepChange = async (selectedStep) => {
        try {
            // Update the local state to reflect the change
            setSelectedClient((prevClient) => ({
                ...prevClient,
                current_step: selectedStep,
            }));
            setApiStatus(apiStatusConstants.inProgress);

            const response = await axios.post(
                `${domain.domain}/user/current-step/${selectedClient.user_id}`,
                { current_step: selectedStep, user },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            if(response){
                showAlert({
                    title: 'Client Moved Successfully!',
                    text: `${response.data}`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                getAllAssignedClients();
                setApiStatus(apiStatusConstants.success);
                setIsAuthenticated(false);
            }
            

            // Reset available steps after the move
            setAvailableSteps([]);
        } catch (error) {
            console.error('Error moving client:', error);
            setIsAuthenticated(false);
            showAlert({
                title:  'Error',
                text:  `${error.response.data.error}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setApiStatus(apiStatusConstants.failure);
        }
    };


    const onChangeCustomerResponse = (e,client) => {
        setCustomerResponse(e.target.value)
        setSelectedClient(client)
    }

    const onSendResponse = async (client) => {
        try {
            const data = {
                response: customerResponse,
                client_id: client.user_id,
                staff_id: user.user_id,
                created_by: user.first_name,
                updated_by: user.first_name,
            };

            const response = await axios.post(`${domain.domain}/customer-response`, data);

            if (response.status >= 200 && response.status < 300) {
                showAlert({
                    title: 'Success!',
                    text: 'The customer response has been created successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setCustomerResponse('')
            } else {
                showAlert({
                    title: 'Error!',
                    text: 'Failed to create the customer response. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
        } catch (error) {
            console.error('Error creating customer response:', error);
            showAlert({
                title: 'Error!',
                text: `${error.response.data.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
        }
    };

    const renderClients = () => (
        
        <ClientTable clients={clients} isAuthenticated={isAuthenticated} onChangeCustomerResponse={onChangeCustomerResponse} customerResponse={customerResponse} onSendResponse={onSendResponse} handleEditClick={handleEditClick} handleMoveToClick={handleMoveToClick} selectedClient={selectedClient} handleStepChange={handleStepChange} availableSteps={availableSteps} isEditModalOpen={isEditModalOpen} profileId={profileId} handleEditModalClose={handleEditModalClose} />
    );

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return renderClients();
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderClients();
            default:
                return null;
        }
    };

    return (
        <MainContainer>
            <h2>Welcome <CurrentUser>{currentUser} </CurrentUser><p style={{ fontSize: '18px', color: 'grey' }}>(Team: {user ? user.staff_team : "Your Not a team member"})</p></h2>
            <DashboardContainer>
                {Object.entries(data).map(([key, value]) => (
                    <SectionCard
                        key={key}
                        onClick={() => handleCardClick(key)}
                        className={selectedCard === key ? 'selected' : ''}
                        style={{
                            borderBottom: selectedCard === key ? `6px solid ${value.color}` : '',
                        }}
                    >

                        <DashboardItem title={value.description} >
                            <div className="dashboard-icon" style={{ color: value.color }}>{value.icon}</div>
                            <div className="dashboard-text">
                                <h4>{value.description}</h4>
                                <p><strong>Total: </strong>{value.total}</p>
                            </div>
                        </DashboardItem>
                    </SectionCard>
                ))}
            </DashboardContainer>

            {showSecretCodePopup && (
                <SecretCode
                    isOpen={showSecretCodePopup}
                    onRequestClose={() => setShowSecretCodePopup(false)}
                    handleOpenClick={() => setShowSecretCodePopup(true)}
                    onChangeAccess={onChangeAccess}
                    myCode={user.secret_code}
                    team={user.staff_team}
                    selectedCard={selectedCard}
                />
            )}

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
                        <H1>All customers</H1>
                        {renderComponents()}
                    </div>}
                </>
            }
        </MainContainer>
    );
};

export default StaffDashboard;
