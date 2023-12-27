
import { useEffect, useState } from 'react';
import { FaCalendarAlt, FaClock, FaFileAlt, FaTasks, FaClipboardList, FaMoneyBillAlt, FaCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';
import noClient from '../../Assets/no-customers.jpg'
import { H1, NoClientContainer } from '../../staffComponents/AssignedClients/styledComponents';
import SweetLoading from '../../SweetLoading/SweetLoading';
import { CurrentUser, DashboardContainer, DashboardItem, DetailsContainer, MainContainer, SectionCard } from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import ClientTable from './clientTable';
import { ClientsHeaderContainer, ExecuteButton } from '../Staff/styledComponents';


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const dataOrder = [
    'Scheduling',
    'TaxInterview',
    'Documents',
    'TaxPreparation',
    'Review',
    'Payments',
    'ClientReview',
    'Filing',
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

    const [staffList, setStaff] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState({})
    const [selectedRange, setSelectedRange] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

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

            const filteredClients = allClients.data.filter(client => client.role === 'CUSTOMER');

            setAllClients(filteredClients)

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
        getStaff()
        if (user) {
            setCurrentUser(user.first_name);
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }

    }, [navigate]);

    const getStaff = async () => {
        try {
            const response = await axios.get(`${domain.domain}/user/staff`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setStaff(response.data)
        } catch (error) {
            console.log(error)
        }
    }

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
        setAvailableSteps([])
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

        getAllAssignedClients();

        setApiStatus(apiStatusConstants.inProgress);

        try {
            const response = await axios.post(
                `${domain.domain}/user/current-step/${selectedClient.user_id}`,
                { current_step: selectedStep, user },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data) {
                showAlert({
                    title: 'Client Moved Successfully!',
                    text: 'The client has been moved to the further step.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                getAllAssignedClients();
                setAvailableSteps([])
                setApiStatus(apiStatusConstants.success);
            } else {
                // Handle the case where the response does not contain data
                console.error('Unexpected response format:', response);
                setApiStatus(apiStatusConstants.error);
            }
        } catch (error) {
            showAlert({
                title: 'Error',
                // text: `No staff with the ${selectedStep} team is available. Please try again.`,
                text: `${error.response.data.error}.  Please try again.`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setApiStatus(apiStatusConstants.error);
            setAvailableSteps([])
        }
    };


    // Handle staff deletion
    const onDeleteClient = async (id) => {


        const isConfirmed = window.confirm('Are you sure you want to delete?');
        if (isConfirmed) {
            setApiStatus(apiStatusConstants.inProgress);
            try {
                await axios.delete(`${domain.domain}/user/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                getAllAssignedClients()
                setApiStatus(apiStatusConstants.success);

                // Show success alert
                showAlert({
                    title: 'Staff Deleted Successfully!',
                    text: 'The staff member has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            } catch (error) {
                console.error('Error Deleting staff:', error);
                setApiStatus(apiStatusConstants.failure);

                // Show error alert
                showAlert({
                    title: 'Error Deleting Staff',
                    text: 'An error occurred while deleting the staff member.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                });
            }
            getAllAssignedClients();
        }
    };

    const onAssignAll = async () => {
        
        try {
            setApiStatus(apiStatusConstants.inProgress)
            const res = await axios.post(
                `${domain.domain}/staff-customer-assignments/auto-assign-clients`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res) {
                showAlert({
                    title: 'Clients Assigned Successfully!',
                    text: 'The clients have been successfully assigned to staff members.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                setApiStatus(apiStatusConstants.success)
                getAllAssignedClients();
            }
        } catch (error) {
            console.error('Error assigning clients:', error);
            showAlert({
                title: 'Error Assigning Clients',
                text: `${error.response.data.message}`,
                icon: 'error',
                confirmButtonText: 'OK',
            });
            setApiStatus(apiStatusConstants.failure)
        }
    };


    const renderClients = () => (
        <ClientTable clients={clients} onDeleteClient={onDeleteClient} handleEditClick={handleEditClick} handleMoveToClick={handleMoveToClick} selectedClient={selectedClient} handleStepChange={handleStepChange} availableSteps={availableSteps} isEditModalOpen={isEditModalOpen} profileId={profileId} handleEditModalClose={handleEditModalClose} />
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

    // Get client label
    const getStaffLabel = (staff) => {
        return `${staff.first_name} ${staff.last_name}`;
    };

    // Handle action change
    const handleStaffChange = async (selectedStaff) => {
        setSelectedStaff(selectedStaff)     
        try {
            // Ensure selectedRange is within a valid range
            if (selectedRange < 1 || selectedRange > clients.length) {
                return setErrorMsg("Invalid range selected.");
            } else {
                setErrorMsg('')
            }

            // Slice the clients array based on the selectedRange
            const selectedClients = clients.slice(0, selectedRange);

            // Check if there are no clients selected
            if (selectedClients.length < 1) {
                return setErrorMsg("There are no clients selected.");
            } else {
                setErrorMsg('')
            }

            // Make the API request to assign clients to staff
            if (Object.keys(selectedStaff).length !== 0) {
                const response = await axios.post(
                    `${domain.domain}/staff-customer-assignments/assign-clients`,
                    { selectedStaff, selectedClients },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (response.status === 200) {
                    getAllAssignedClients();
                    setSelectedRange('');
                }
            }

           
        } catch (error) {
            console.error('Error assigning clients to staff:', error);
            setErrorMsg("An error occurred while assigning clients to staff.");
        }   
    };

    const onChangeRange = (e) => {
        setSelectedRange(e.target.value)
        setErrorMsg('')
    }


    return (
        <MainContainer>
            <h2>Welcome <CurrentUser>{currentUser}</CurrentUser></h2>
            <DashboardContainer>
                {Object.entries(data).map(([key, value]) => (
                    <SectionCard
                        key={key}
                        onClick={() => handleCardClick(key)}
                        className={selectedCard === key ? 'selected' : ''}
                        style={{
                            borderBottom: selectedCard === key ? `6px solid ${value.color}` : '1px solid blue',
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
            {selectedCard ? (
                <DetailsContainer id="details-container">
                    <ClientsHeaderContainer className=' p-3 d-flex align-items-center justify-content-between'>
                        <H1>{data[selectedCard].description} Details:</H1>
                        {clients.length > 0 && <div>
                            <h6>Number of customer assign to a staff</h6>
                            <div className='d-flex' style={{ gap: '10px' }}>
                                <input placeholder="Enter a range" value={selectedRange} onChange={onChangeRange} className="range-input ml-2" />
                                <select
                                    className='p-2'
                                    onChange={(e) => handleStaffChange(JSON.parse(e.target.value))}
                                    defaultValue="Select Staff"
                                >
                                    <option value={JSON.stringify({})}>Select staff</option>
                                    {staffList.map((staff) => (
                                        <option key={staff.user_id} value={JSON.stringify(staff)}>
                                            {getStaffLabel(staff)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errorMsg && <span className='text-danger'>{errorMsg}</span>}
                        </div>}
                    </ClientsHeaderContainer>
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
                <div className='bg-light'>
                    {clients.length > 0 && <div>
                        <div style={{ backgroundColor: `var(--main-background-shade)` }} className='d-flex align-items-center justify-content-between p-3'>
                            <H1>Unassigned clients</H1>
                            <button className='btn bg-success text-light' onClick={onAssignAll} title='Auto assign all to Scheduling'>Assign All</button>
                        </div>
                        {renderComponents()}

                    </div>}
                </div>
            }
        </MainContainer>
    );
};

export default AdminDashboard;
