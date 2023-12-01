import React, { useEffect, useState } from 'react';
import axios from 'axios';
import domain from '../../domain/domain';
// import { MdDelete } from 'react-icons/md';
import Sidebar from '../../userComponents/SideBar/sidebar';
import { ButtonContainer, CtaSection, DocumentImage, DocumentTable, DocumentTableContainer, DragDropArea, Form, H1, InputField, InputFieldsContainer, InputFieldsSubContainer, Select, TaxDescription, TaxDocumentContainer, Td, Th, UploadButton } from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import { DocumentName, Lable } from '../../userComponents/CommentDocument/styledComponents';
import { DeleteButton } from '../../userComponents/UploadDocument/styledComponents';
import { MdDelete } from 'react-icons/md';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'

const TaxReturnDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [myClients, setMyClients] = useState([]);
    const [selectedClient, setSelectedClient] = useState({});
    const [documents, setDocuments] = useState([]);
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');


    const handleChange = (e) => {
        setFormData({ ...data, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };


    const fetchDocuments = async () => {
        // setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/tax-return-document`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            if (response.status === 200) {
                const filteredData = response.data.documents.filter(document => document.staff_id === currentUser.user_id);
                setDocuments(filteredData);
                // setApiStatus(apiStatusConstants.success)
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };




    const handleFileUpload = async (e) => {
        e.preventDefault();
        console.log(data)

        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('customer_id', selectedClient);
            formData.append('staff_id', currentUser.user_id);
            formData.append('financial_year', data.financial_year)
            formData.append('financial_month', data.financial_month)
            formData.append('financial_quarter', data.financial_quarter)
            formData.append('document_name', data.document_name);
            formData.append('document_type', data.document_type);
            formData.append('payment_amount', data.payment_amount)


            const res = await axios.post(`${domain.domain}/tax-return-document/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: { customer_id: currentUser.user_id }
            });

            if (res.status === 201) {
                showAlert({
                    title: 'Tax Return Document Uploaded Successfully!',
                    text: 'The document has been uploaded successfully. You can now view or download the document.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
            }

            setSelectedFile(null);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const documentTypes = [
        { value: 'homeLoan', label: 'Home Loan' },
        { value: 'goldLoan', label: 'Gold Loan' },
        { value: 'carLoan', label: 'Car Loan' },
        { value: 'personalLoan', label: 'Personal Loan' },
        { value: 'educationLoan', label: 'Education Loan' },
        { value: 'businessLoan', label: 'Business Loan' },
        { value: 'mortgage', label: 'Mortgage' },
        { value: 'autoLoan', label: 'Auto Loan' },
        { value: 'creditCard', label: 'Credit Card' }
    ];

    const initialFormFields = [
        { label: 'Document Name', name: 'document_name', type: 'text', placeholder: 'Enter Document Name' },
        { label: 'Document Type', name: 'document_type', type: 'select', options: documentTypes, placeholder: 'Document Type' },
        { label: 'Select Client', name: 'client', type: 'select', options: myClients, placeholder: 'Select a Client' },
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' },
        { label: 'Payment Amount', name: 'payment_amount', type: 'number', placeholder: 'Ex:- $120' }
    ];


    const getAllAssignedClients = async () => {
        try {
            const assignedClientsResponse = await axios.get(`${domain.domain}/user/staff-clients`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            const filteredClients = assignedClientsResponse.data.filter(client => client.staff_id === currentUser.user_id);
            setMyClients(filteredClients);
        } catch (error) {
            console.error('Error fetching assigned clients:', error);
        }
    };

    useEffect(() => {
        getAllAssignedClients();
        fetchDocuments()
    }, [])



    const handleClientChange = (e) => {
        const id = e.target.value;
        setSelectedClient(id);
    };


    const renderInputFields = (field) => {
        if (field.type === 'select' && field.name === 'document_type') {
            return (
                <Select
                    className="text-dark w-100"
                    id={field.name}
                    name={field.name}
                    value={data[field.name] || ''}
                    onChange={handleChange}
                    required
                >
                    <option value="">{field.placeholder}</option>
                    {field.options.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                </Select>
            );
        } else if (field.type === 'select' && field.name === 'client') {
            return (
                <Select
                    className="text-dark w-100"
                    id={field.name}
                    name={field.name}
                    value={selectedClient}
                    onChange={handleClientChange}
                    required
                >
                    <option value="">Select a client</option>
                    {myClients.map(client => (
                        <option key={client.user_id} value={client.user_id}>
                            {client.first_name}
                        </option>
                    ))}
                </Select>
            );
        } else {
            return (
                <InputField
                    type={field.type}
                    className="text-dark w-100"
                    id={field.name}
                    placeholder={field.placeholder}
                    name={field.name}
                    value={data[field.name] || ''}
                    onChange={handleChange}
                    required
                />
            );
        }
    };


    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const onDeleteDocument = async (id) => {
        // setApiStatus(apiStatusConstants.inProgress)
        const result = window.confirm("Are you sure you want to delete this document?");
        if (result) {
            try {
                await axios.delete(`${domain.domain}/tax-return-document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                // setApiStatus(apiStatusConstants.success)
                setDocuments((prevDocuments) => prevDocuments.filter(document => document.taxreturn_id !== id));
            } catch (error) {
                console.error('Error deleting document:', error.message);
            }
        }
    };

    const handleDownloadClick = async (document) => {
        // setApiStatus(apiStatusConstants.inProgress)
        try {
            const downloadUrl = `${domain.domain}/tax-return-document/download/${document.taxreturn_id}`;
            const headers = {
                Authorization: `Bearer ${accessToken}`,
            };
            const response = await fetch(downloadUrl, { headers });
            const blob = await response.blob();

            // setApiStatus(apiStatusConstants.success)
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${document.taxreturn_id}.pdf`);
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

        return fileExtension in fileTypeIcons ? (
            <span style={{ fontSize: '24px' }}>{fileTypeIcons[fileExtension]}</span>
        ) : (
            <span>📁</span>
        );
    };


    return (
        <div className='d-flex'>
            <Sidebar />
            <TaxDocumentContainer className="tax-interview-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                <H1>Upload Tax Return Document</H1>
                <TaxDescription className='tax-description'>
                    Welcome to our Tax Return service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                <CtaSection className='cta-section shadow'>
                    <H1>Enter Tax Return Document Details Below</H1>
                    <Form onSubmit={handleFileUpload}>
                        <InputFieldsContainer className="row">
                            {initialFormFields.map((field, index) => (
                                <InputFieldsSubContainer className="col-lg-4 col-md-6 col-sm-12" key={index}>
                                    <Lable htmlFor={field.name}>
                                        <strong>{field.label}</strong>
                                    </Lable>
                                    {renderInputFields(field)}
                                </InputFieldsSubContainer>
                            ))}
                        </InputFieldsContainer>
                        <input type="file" onChange={handleFileChange} name='documents' style={{ display: 'none' }} />
                        <DragDropArea onClick={() => document.querySelector('input[type="file"]').click()}>
                            <p>Drag & Drop or Click to Upload</p>
                            <DocumentImage src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" />
                        </DragDropArea>
                        {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                        <ButtonContainer>
                            <UploadButton type='submit'>Upload Tax Documents</UploadButton>
                        </ButtonContainer>
                    </Form>

                    {documents.length > 0 && (
                        <DocumentTableContainer>
                            <H1>Uploaded Tax Return Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Payment Amount</Th>
                                        <Th>Payment Status</Th>
                                        <Th>Delete</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.taxreturn_id}>
                                            <Td>
                                                <div className='d-flex flex-column'>
                                                    {/* <div className='d-flex align-items-center justify-content-center'> */}
                                                    <a
                                                        href={`${domain.domain}/tax-return-document/download/${document.taxreturn_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download
                                                        onClick={(e) => handleDownloadClick(document)}
                                                    >
                                                        {renderDocumentThumbnail(document)}
                                                    </a>
                                                    {/* <FaDownload size={25} />
                                                    </div> */}
                                                    <DocumentName>{document.document_path.split('-')[1]}</DocumentName>
                                                </div>

                                            </Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td style={{
                                                color:
                                                    document.payment_status === 'Pending' ? 'orange' :
                                                        document.payment_status === 'Rejected' ? 'red' :
                                                            document.payment_status === 'Reviewed' ? 'green' :
                                                                'inherit'
                                            }}><strong>{document.payment_status}</strong></Td>
                                            <Td>{document.payment_amount}</Td>
                                            {/* <Td style={{
                                                color:
                                                    document.review_status === 'Pending' ? 'orange' :
                                                        document.review_status === 'Rejected' ? 'red' :
                                                            document.review_status === 'Reviewed' ? 'green' :
                                                                'inherit'
                                            }}>
                                                <strong>{document.review_status}</strong>
                                            </Td> */}
                                            
                                            <Td>
                                                <DeleteButton title='delete document' onClick={() => onDeleteDocument(document.taxreturn_id)}>
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
            </TaxDocumentContainer>
        </div>
    );
}

export default TaxReturnDocument;
