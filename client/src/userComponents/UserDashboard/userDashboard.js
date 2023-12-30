import React, { useEffect, useState } from 'react';
import { FaUser, FaFileUpload, FaComment, FaClipboardCheck, FaMoneyBillAlt } from "react-icons/fa";
import { setToken, getToken, setUserData, getUserData } from '../../StorageMechanism/storageMechanism';

import { FaAnglesRight } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { CardBody, CardText, CardTitle, CardsContainer, CurrentUser, DashboardContainer, H1, IntroText, StepCard, StepDetails } from './styledComponents';
import { message } from '../../components/Footer/footer';
import SweetLoading from '../../SweetLoading/SweetLoading';


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const UserDashboard = () => {
    const [currentUser, setCurrentUser] = useState('');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const user = getUserData()

    const navigate = useNavigate()

    useEffect(() => {
        setApiStatus(apiStatusConstants.inProgress)
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard')
            } else if (user.role === 'STAFF') {
                navigate('/staff/dashboard')
            }
            setCurrentUser(user.first_name);
            setInterval(() => {
                setApiStatus(apiStatusConstants.success)
            },500)
        }
    }, [navigate]);

    const steps = [
        {
            name: 'Tax Interview',
            step: 1,
            description: 'Complete your tax interview to provide necessary information.',
            link: '/user/tax-interview',
            icon: <FaUser size={30} />
        },
        {
            name: 'Upload Document',
            step: 2,
            description: 'Upload the required documents for tax filing.',
            link: '/user/upload-document',
            icon: <FaFileUpload size={30} />
        },
        {
            name: 'Add Comment',
            step: 3,
            description: 'Add comments if needed to provide additional details.',
            link: '/user/comment-to-document',
            icon: <FaComment size={30} />
        },
        {
            name: 'Tax Return Review',
            step: 4,
            description: 'Review your tax return for accuracy and completeness.',
            link: '/user/tax-return-review',
            icon: <FaClipboardCheck size={30} />
        },
        {
            name: 'Payments',
            step: 5,
            description: 'Complete the payment process for your tax filing.',
            link: '/user/make-payment',
            icon: <FaMoneyBillAlt size={30} />
        },
    ];



    const renderSuccess = () => {
        return (
            <DashboardContainer>
                <H1>Welcome <CurrentUser>{currentUser}</CurrentUser> <p style={{ fontSize: '14px', color: 'grey' }}>(Current Step: {user ? user.current_step : "Null"})</p></H1>
                <div>
                    <IntroText>
                        Embark on a hassle-free tax filing journey with us. Our user-friendly platform ensures a seamless experience
                        as you navigate through the various steps. Take control of your financial responsibilities and complete your
                        tax filing effortlessly in 5 simple steps.
                    </IntroText>
                </div>

                <div className='container p-0 m-0'>
                    <CardsContainer>
                        {steps.map((step) => (
                            <div key={step.step} className='col-12 col-lg-4 col-md-6'>
                                <StepCard>
                                    <CardBody>
                                        <CardTitle>
                                            {step.icon} {step.name}
                                        </CardTitle>
                                        <CardText>{step.description}</CardText>
                                        <StepDetails>
                                            <div>Step: {step.step}</div>
                                            <Link className='d-flex align-items-center justify-content-center p-2 text-light btn' to={step.link} style={{ textDecoration: 'none', backgroundColor: `var(--accent-background)`, }}>
                                                Continue <FaAnglesRight />
                                            </Link>
                                        </StepDetails>
                                    </CardBody>
                                </StepCard>
                            </div>
                        ))}
                    </CardsContainer>
                </div>
                {message}
            </DashboardContainer>
        )
    }

    const onRenderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <SweetLoading />;
            case apiStatusConstants.success:
                return renderSuccess();
            case apiStatusConstants.failure:
                return null;
            default:
                return null;
        }
    }

    return (
        onRenderComponents()
    );
};

export default UserDashboard;
