import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';
import pdf from '../../Assets/PDF_file_icon.svg.png';
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png';
import noDoc from '../../Assets/no-documents.png';

import {
    ClientDocumentContainer,
    ClientTaxDocumentsHeaderContainer,
    CtaSection,
    DocumentTableContainer,
    H1,
    NoDocuments,
} from './styledComponents';

import SweetLoading from '../../SweetLoading/SweetLoading';
import DocumentTableComponent from './documentTable';
import ClientTaxDocumentHeader from './documentHeader';
import formatDateTime from '../../FormatDateTime/DateTime';
import FailureComponent from '../../FailureComponent/failureComponent';


const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const ClientTaxDocuments = ({ clientId }) => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const navigate = useNavigate();

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                setDocuments(response.data);
                setFilteredDocuments(response.data);
                setApiStatus(apiStatusConstants.success);
            } else {
                setApiStatus(apiStatusConstants.failure);
            }
        } catch (error) {
            setErrorMsg(error)
            setApiStatus(apiStatusConstants.failure);
        }
    };

    const fetchClients = async () => {
        setApiStatus(apiStatusConstants.inProgress);
        try {
            const response = await axios.get(`${domain.domain}/user`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (response.status === 200) {
                const filteredClients = response.data.filter((client) => {
                    return client.role === 'CUSTOMER';
                });
                setClients(filteredClients);
                setApiStatus(apiStatusConstants.success);
            } else {
                setApiStatus(apiStatusConstants.failure);
            }
        } catch (error) {
            setErrorMsg(error)
            setApiStatus(apiStatusConstants.failure);
        }

        if (clientId) {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents/${clientId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });

                if (response.status === 200) {
                    setFilteredDocuments(response.data);
                    setApiStatus(apiStatusConstants.success);
                } else {
                    setFilteredDocuments(documents);
                }
            } catch (error) {
                setErrorMsg(error)
                setApiStatus(apiStatusConstants.failure);
            }
        }
    };

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
            setErrorMsg(error)
            setApiStatus(apiStatusConstants.failure)
        }
    };

    useEffect(() => {
        if (user) {
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }
        fetchDocuments();
        fetchClients();
    }, [navigate]);

    const handleDownloadClick = async (document) => {

        try {
            const downloadUrl = `${domain.domain}/customer-tax-document/download/${document.document_id}`;
            const headers = { Authorization: `Bearer ${accessToken}` };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');

            link.href = url;
            link.download = `${document.document_id}.pdf`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };


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

    const onDeleteDocument = async (id) => {
        console.log(id)
        setApiStatus(apiStatusConstants.inProgress)
        try{
            const response = await axios.delete(`${domain.domain}/customer-tax-document/${id}`, {
                headers:{
                    Authorization:`Bearer ${accessToken}`
                }
            })
            if(response){
                setApiStatus(apiStatusConstants.success)
                showAlert({
                    title: 'Document deleted Successfully!',
                    text: '',
                    icon: 'success',
                    confirmButtonText: 'Ok',
                });
            }
        }catch(error){
            setErrorMsg(error)
            setApiStatus(apiStatusConstants.failure)
        }
    }

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
            setApiStatus(apiStatusConstants.failure)
        }
    };

    const successRender = () => {
        return (
            <ClientDocumentContainer >
                <H1>Tax Documents</H1>
                {documents.length > 0 ?
                    <CtaSection className="shadow">
                        <DocumentTableContainer >
                            <ClientTaxDocumentsHeaderContainer>
                                <H1>Uploaded Documents</H1>
                                {!clientId && <ClientTaxDocumentHeader clients={clients} selectedClient={selectedClient} handleClientChange={handleClientChange} />}
                            </ClientTaxDocumentsHeaderContainer>
                            {filteredDocuments.length > 0 ? (
                                <DocumentTableComponent onDeleteDocument={onDeleteDocument} onChangeDocumentStatus={onChangeDocumentStatus} documents={documents} formatDateTime={formatDateTime} handleDownloadClick={handleDownloadClick} renderDocumentThumbnail={renderDocumentThumbnail} />
                            ) : (
                                <div>No Documents uploaded by this client</div>
                            )}
                        </DocumentTableContainer>
                    </CtaSection> : (
                        <NoDocuments>
                            <img src={noDoc} alt='no-doc' className='img-fluid' />
                            <H1>No Documents!</H1>
                            <label>No documents have been uploaded by the client. Please upload relevant documents to proceed.</label>
                        </NoDocuments>
                    )}
            </ClientDocumentContainer>
        )
    }

    const onRenderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return successRender()
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />
            default:
                return null
        }
    }

    return (
        onRenderComponents()
    );
};

export default ClientTaxDocuments;
