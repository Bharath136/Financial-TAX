import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import showAlert from '../../SweetAlert/sweetalert';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import noDoc from '../../Assets/no-documents.jpg'
import { ClientDocumentContainer, ClientsHeaderContainer, CtaSection, Description, DocumentName, DocumentTable, DocumentTableContainer, H1, NoDocuments, Select, Td, Th } from './styledComponents';

const ClientTaxDocuments = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [documents, setDocuments] = useState([]);
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState('');

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents`, { 
                headers: { Authorization: `Bearer ${accessToken}` } 
            });
            setDocuments(response.data);
            setFilteredDocuments(response.data)
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    const fetchClients = async () => {
        const response = await axios.get(`${domain.domain}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        const filteredClients = response.data.filter((client) => {
            return client.role === 'CUSTOMER'
        })
        setClients(filteredClients)
    }

    const formatDateTime = (dateTimeString) => new Date(dateTimeString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });

    const onChangeDocumentStatus = async (id, status) => {
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
        } catch (error) {
            console.error('Error updating document status:', error.message);
        }
    };


    useEffect(() => {
        fetchDocuments();
        fetchClients();
        
    }, []);

    const handleDownloadClick = async (document) => {
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
                <span style={{ height: '60px' }}>
                    📁
                </span>
            );
        }
    };


    const handleClientChange = async (e) => {
        const id = e.target.value;
        setSelectedClient(id);
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document/get-assigned-client-documents/${id}`, { 
                headers: { Authorization: `Bearer ${accessToken}` } 
            });
            if(response.status === 200){
                setFilteredDocuments(response.data)
            }else{
                setFilteredDocuments(documents);
            }
            
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };





    return (
        <div className="d-flex">
            <Sidebar />
            <ClientDocumentContainer >
                <H1>Tax Documents</H1>
                <Description >
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </Description>
                {documents.length > 0 ? <CtaSection className="shadow">
                    
                    <DocumentTableContainer >
                        <H1>Uploaded Documents</H1>
                        <ClientsHeaderContainer>
                            <label><strong>Filter by client</strong></label>
                            <Select
                                id="clientSelect"
                                name="clientSelect"
                                value={selectedClient}
                                onChange={handleClientChange}
                                required
                            >
                                <option value="">All clients</option>
                                {clients.map(client => (
                                    <option key={client.user_id} value={client.user_id}>
                                        {client.first_name}
                                    </option>
                                ))}
                            </Select>
                        </ClientsHeaderContainer>
                        {filteredDocuments.length > 0 ? <DocumentTable >
                            <thead>
                                <tr>
                                    <Th>Document</Th>
                                    <Th>Date & Time</Th>
                                    <Th>Review Status</Th>
                                    <Th>Change Status</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocuments.map((document) => (
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
                                            }}><strong>{document.review_status}</strong>
                                        </Td>
                                        <Td>
                                            <DropdownButton id={`dropdown-button-${document.document_id}`} title="Change" variant="warning">
                                                {['Pending', 'Reviewed', 'Rejected'].map((statusOption) => (
                                                    <Dropdown.Item key={statusOption} onClick={() => onChangeDocumentStatus(document.document_id, statusOption)}>
                                                        {statusOption}
                                                    </Dropdown.Item>
                                                ))}
                                            </DropdownButton>
                                        </Td>
                                    </tr>
                                ))}
                            </tbody>
                        </DocumentTable> : <div>No Documents uploaded by this client</div>}
                    </DocumentTableContainer>
                </CtaSection> :
                    <NoDocuments>
                        <img src={noDoc} alt='no-doc' className='img-fluid' />
                        <H1>No Documents!</H1>
                        <label>No documents have been uploaded by the client. Please upload relevant documents to proceed.</label>
                    </NoDocuments>}
            </ClientDocumentContainer>
        </div>
    );
};

export default ClientTaxDocuments;
