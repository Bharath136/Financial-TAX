// Libraries
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Components
import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';

// Assets
import pdf from '../../Assets/PDF_file_icon.svg.png';
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png';
import noDoc from '../../Assets/no-documents.jpg';

// Styled Components
import {
    ClientDocumentContainer,
    ClientTaxDocumentsHeaderContainer,
    CtaSection,
    DocumentTableContainer,
    H1,
    NoDocuments,
} from './styledComponents';
import { useNavigate } from 'react-router-dom';
import SweetLoading from '../../SweetLoading/SweetLoading';
import DocumentTableComponent from './documentTable';
import ClientTaxDocumentHeader from './documentHeader';
import formatDateTime from '../../FormatDateTime/DateTime';

// Constants for API status
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const ClientTaxDocuments = ({ clientId }) => {
    // State and variables
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');

    // Fetch documents from the server
    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (response.status === 200) {
                setDocuments(response.data);
                setFilteredDocuments(response.data);
                setApiStatus(apiStatusConstants.success)
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    // Fetch clients from the server
    const fetchClients = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        const response = await axios.get(`${domain.domain}/user`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (response.status === 200) {
            const filteredClients = response.data.filter((client) => {
                return client.role === 'CUSTOMER';
            });
            setClients(filteredClients);
            setApiStatus(apiStatusConstants.success)
        }
        if (clientId){
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents/${clientId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                if (response.status === 200) {
                    setFilteredDocuments(response.data);
                    setApiStatus(apiStatusConstants.success)
                } else {
                    setFilteredDocuments(documents);
                }
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        }

    };

    // Handle document status change
    const onChangeDocumentStatus = async (id, status) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            await axios.put(`${domain.domain}/customer-tax-document/review-status/${id}`, { user_id: user.user_id, review_status: status }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            showAlert({
                title: 'Status Updated Successfully!',
                text: '',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
            fetchDocuments();
            setApiStatus(apiStatusConstants.success)
        } catch (error) {
            console.error('Error updating document status:', error.message);
        }
    };

    // Navigation hook
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect users based on role
        if (user) {
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }
        // Fetch documents and clients
        fetchDocuments();
        fetchClients();
    }, [navigate]);

    // Handle download click
    const handleDownloadClick = async (document) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.document_id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            setApiStatus(apiStatusConstants.success)
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    // Render document thumbnail based on file type
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

        // Check if the file extension is in the supported types
        if (fileExtension in fileTypeIcons) {
            return (
                <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
            );
        } else {
            return (
                <span style={{ height: '60px' }}>
                    📁
                </span>
            );
        }
    };

    // Handle client change for filtering documents
    const handleClientChange = async (e) => {
        setApiStatus(apiStatusConstants.inProgress)
        const id = e.target.value;
        setSelectedClient(id);
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            if (response.status === 200) {
                setFilteredDocuments(response.data);
                setApiStatus(apiStatusConstants.success)
            } else {
                setFilteredDocuments(documents);
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const successRender = () => {
        return (
            <CtaSection className="shadow">
                <DocumentTableContainer >
                    <ClientTaxDocumentsHeaderContainer>
                        <H1>Uploaded Documents</H1>
                        {!clientId && <ClientTaxDocumentHeader clients={clients} selectedClient={selectedClient} handleClientChange={handleClientChange} />}
                    </ClientTaxDocumentsHeaderContainer>
                    {filteredDocuments.length > 0 ? (
                        <DocumentTableComponent onChangeDocumentStatus={onChangeDocumentStatus} documents={documents} formatDateTime={formatDateTime} handleDownloadClick={handleDownloadClick} renderDocumentThumbnail={renderDocumentThumbnail} />
                    ) : (
                        <div>No Documents uploaded by this client</div>
                    )}
                </DocumentTableContainer>
            </CtaSection>
        )
    }

    const onRenderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return successRender()
            case apiStatusConstants.failure:
                return <div>failure..</div>
            default:
                return null
        }
    }

    return (
        <ClientDocumentContainer >
            {/* <H1>Tax Documents</H1>
            <Description >
                Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
            </Description> */}
            {documents.length > 0 ?
                onRenderComponents()
                : (
                    <NoDocuments>
                        <img src={noDoc} alt='no-doc' className='img-fluid' />
                        <H1>No Documents!</H1>
                        <label>No documents have been uploaded by the client. Please upload relevant documents to proceed.</label>
                    </NoDocuments>
                )}
        </ClientDocumentContainer>
    );
};

export default ClientTaxDocuments;
