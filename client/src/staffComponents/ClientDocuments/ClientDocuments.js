import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import showAlert from '../../SweetAlert/sweetalert';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import { ClientDocumentContainer, CtaSection, Description, DocumentName, DocumentTable, DocumentTableContainer, H1, NoDocumentsContainer, Td, Th } from './styledComponents';
import SweetLoading from '../../SweetLoading/SweetLoading';
import noDocuments from '../../Assets/no-documents.jpg'

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const ClientDocuments = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [documents, setDocuments] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (response.status === 200) {
                const filteredData = response.data.filter(
                    (document) => document.staff_id === user.user_id
                );
                setApiStatus(apiStatusConstants.success)
                setDocuments(filteredData);
            }

        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const onChangeDocumentStatus = async (id, status) => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            await axios.put(
                `${domain.domain}/customer-tax-document/review-status/${id}`,
                { user_id: user.user_id, review_status: status },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setApiStatus(apiStatusConstants.success)
            showAlert({
                title: 'Status Updated Successfully!',
                text: '',
                icon: 'success',
                confirmButtonText: 'Ok',
            });
            fetchDocuments();
        } catch (error) {
            console.error('Error updating document status:', error.message);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const handleDownloadClick = async (document) => {
        try {
            const downloadUrl = `http://localhost:8000/customer-tax-document/download/${document.document_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };

            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

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
                <span>
                    📁
                </span>
            );
        }
    };

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <div>failure</div>
            case apiStatusConstants.success:
                return <CtaSection className="shadow">

                    <DocumentTableContainer className="document-table-container">
                        <H1>Uploaded Documents</H1>
                        <DocumentTable className="document-table">
                            <thead>
                                <tr>
                                    <Th>Document</Th>
                                    <Th>Date & Time</Th>
                                    <Th>Review Status</Th>
                                    <Th>Change Status</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {documents.map((document) => (
                                    <tr key={document.document_id}>
                                        <Td>
                                            <div className='d-flex flex-column'> <a
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
                                        <Td style={{
                                            color:
                                                document.review_status === 'Pending' ? 'orange' :
                                                    document.review_status === 'Rejected' ? 'red' :
                                                        document.review_status === 'Reviewed' ? 'green' :
                                                            'inherit'
                                        }}>

                                            <strong>{document.review_status}</strong>
                                        </Td>
                                        <Td>
                                            <DropdownButton
                                                id={`dropdown-button-${document.document_id}`}
                                                title="Change"
                                                variant="warning"
                                            >
                                                {['Pending', 'Reviewed', 'Rejected'].map((statusOption) => (
                                                    <Dropdown.Item
                                                        key={statusOption}
                                                        onClick={() => onChangeDocumentStatus(document.document_id, statusOption)}
                                                    >
                                                        {statusOption}
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </DocumentTable>
                    </DocumentTableContainer>
                </CtaSection>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            default:
                return null
        }
    }
    return (
        <div className="d-flex">
            <Sidebar />
            <ClientDocumentContainer >
                <H1>Tax Documents</H1>
                <Description >
                    Welcome to our Tax Interview service! Download the tax notes below, fill in
                    the required information, and upload the necessary tax documents to get
                    started on your tax return process.
                </Description>
                {documents.length > 0 ? renderComponents() : 
                    <NoDocumentsContainer>
                        <img src={noDocuments} alt='img' className='img-fluid' />
                        <H1>No Clients Assigned</H1>
                        <p>Oops! It seems there are no clients assigned to you.</p>
                    </NoDocumentsContainer>
                }
            </ClientDocumentContainer>
        </div>
    );
};

export default ClientDocuments;
