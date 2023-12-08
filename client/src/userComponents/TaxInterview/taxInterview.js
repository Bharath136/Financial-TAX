// Libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';

// Components
import Sidebar from '../SideBar/sidebar';
import domain from '../../domain/domain';
import SweetLoading from '../../SweetLoading/SweetLoading';
import BreadCrumb from '../../breadCrumb/breadCrumb';
import { useNavigate } from 'react-router-dom';
import { message } from '../../components/Footer/footer';
import { EmptyDocumentContainer } from '../CommentDocument/styledComponents';

// Assets
import pdf from '../../Assets/PDF_file_icon.svg.png';
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png';
import noDoc from '../../Assets/no-documents.jpg';

import {
    TaxInterviewContainer,
    H1,
    TaxDescription,
    CtaSection,
    DocumentTableContainer,
    DocumentTable,
    Th,
    Td,
    DeleteButton,
    DocumentName
} from './styledComponents';

// Constants for API status
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}

// Functional component for TaxInterview
const TaxInterview = () => {
    // State variables
    const [documents, setDocuments] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [showFooter, setShowFooter] = useState(false)
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');

    const navigate = useNavigate()

    // useEffect to handle redirection based on user role and fetch documents
    useEffect(() => {
        if (user.role === 'ADMIN') {
            navigate('/admin-dashboard')
        } else if (user.role === 'STAFF') {
            navigate('/staff-dashboard')
        }
        fetchDocuments();
    }, [navigate]);

    // Function to fetch user's tax documents
    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            if (response.status === 200) {
                const filteredData = response.data.documents.filter(document => document.customer_id === user.user_id);
                setDocuments(filteredData);
                setApiStatus(apiStatusConstants.success)
                setShowFooter(true)
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    // Function to format date and time
    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    // Event handler for document deletion
    const onDeleteDocument = async (id) => {
        setApiStatus(apiStatusConstants.inProgress)
        const result = window.confirm("Are you sure you want to delete this document?");
        if (result) {
            try {
                await axios.delete(`${domain.domain}/customer-tax-document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setApiStatus(apiStatusConstants.success)
                setDocuments((prevDocuments) => prevDocuments.filter(document => document.document_id !== id));
            } catch (error) {
                console.error('Error deleting document:', error.message);
            }
        }
    };

    // Event handler for document download
    const handleDownloadClick = async (document) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            setApiStatus(apiStatusConstants.success)
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.document_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    // Function to render document thumbnail based on file type
    const renderDocumentThumbnail = (document) => {
        const fileExtension = document.document_path.split('.').pop().toLowerCase();

        const fileTypeIcons = {
            pdf: <img src={pdf} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            doc: <img src={doc} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            docx: <img src={docx} alt='pdf' className='img-fluid' style={{ height: '60px' }} />,
            jpg: '🖼️',
            jpeg: '🖼️',
            png: '🖼️',
        };

        return fileExtension in fileTypeIcons ? (
            <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
        ) : (
            <span>📁</span>
        );
    };

    // Function to render different components based on API status
    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>
            case apiStatusConstants.success:
                return <CtaSection className='shadow'>
                    {documents.length > 0 && (
                        <DocumentTableContainer>
                            <H1>Your Tax Notes Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Review Status</Th>
                                        <Th>Delete</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>
                                                <div className='d-flex flex-column'>
                                                    <a
                                                        href={`${domain.domain}/customer-tax-document/download/${document.document_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        onClick={(e) => handleDownloadClick(document)}
                                                    >
                                                        {renderDocumentThumbnail(document)}
                                                    </a>
                                                    <DocumentName>{document.document_path.split('-')[1]}</DocumentName>
                                                </div>

                                            </Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td className={`status-${document.review_status.toLowerCase()}`}>
                                                <strong>{document.review_status}</strong>
                                            </Td>
                                            <Td>
                                                <DeleteButton title='delete document' onClick={() => onDeleteDocument(document.document_id)}>
                                                    {<MdDelete size={25} className='text-danger' />}
                                                </DeleteButton>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    )}
                </CtaSection>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            default:
                return null
        }
    }

    // Component for empty documents state
    const EmptyDocumentsState = () => (
        <EmptyDocumentContainer>
            <img src={noDoc} alt="Empty Documents State" />
            <H1>No Documents available</H1>
            <p>No tax documents notes available. Please wait for agent reply.</p>
        </EmptyDocumentContainer>
    );

    // Return JSX for the component
    return (
        <div className='d-flex'>
            <Sidebar />
            <TaxInterviewContainer >
                <BreadCrumb />
                <H1>Tax Interview</H1>
                <TaxDescription>
                    Welcome to our Tax Interview service! Download the tax notes below, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>

                {documents.length > 0 ? renderComponents() : EmptyDocumentsState()}
                {showFooter && message}
            </TaxInterviewContainer>
        </div>
    );
}

// Export the component
export default TaxInterview;
