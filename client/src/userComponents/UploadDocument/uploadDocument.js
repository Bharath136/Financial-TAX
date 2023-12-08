import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import Sidebar from '../SideBar/sidebar';
import domain from '../../domain/domain';
import pdf from '../../Assets/PDF_file_icon.svg.png'
import doc from '../../Assets/doc.png';
import docx from '../../Assets/docx.png'
import {
    TaxInterviewContainer,
    H1,
    TaxDescription,
    CtaSection,
    InputFieldsContainer,
    InputFieldsSubContainer,
    InputField,
    UploadButton,
    DragDropArea,
    ButtonContainer,
    DocumentImage,
    DocumentTableContainer,
    DocumentTable,
    Form,
    Th,
    Td,
    DeleteButton,
    DocumentName,
    Lable,
    Select
} from './styledComponents';
import showAlert from '../../SweetAlert/sweetalert';
import SweetLoading from '../../SweetLoading/SweetLoading';
import BreadCrumb from '../../breadCrumb/breadCrumb';
import { useNavigate } from 'react-router-dom';
import { message } from '../../components/Footer/footer';

// ... (import statements)
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
}
const UploadDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [data, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');

    const navigate = useNavigate()

    useEffect(() => {
        if (user.role === 'ADMIN') {
            navigate('/admin-dashboard')
        } else if (user.role === 'STAFF') {
            navigate('/staff-dashboard')
        }
        fetchDocuments();
    }, [navigate]);

    const fetchDocuments = async () => {
        setApiStatus(apiStatusConstants.inProgress)
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            if(response.status === 200){
                const filteredData = response.data.documents.filter(document => document.customer_id === user.user_id);
                setDocuments(filteredData);
                setApiStatus(apiStatusConstants.success)
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };
    

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

    const handleFileUpload = async (e) => {
        e.preventDefault();
        setApiStatus(apiStatusConstants.inProgress)
        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('customer_id', user.user_id);
            formData.append('financial_year', data.financial_year)
            formData.append('financial_month', data.financial_month)
            formData.append('financial_quarter', data.financial_quarter)
            formData.append('document_name', data.document_name);
            formData.append('document_type', data.document_type);

            const res = await axios.post(`${domain.domain}/customer-tax-document/upload`, formData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                data: { customer_id: user.user_id }
            });

            if (res.status === 201) {
                setApiStatus(apiStatusConstants.success)
                showAlert({
                    title: 'Document Uploaded Successfully!',
                    text: 'The document has been uploaded successfully. You can now view or download the document.',
                    icon: 'success',
                    confirmButtonText: 'OK',
                });
                fetchDocuments()
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
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' }
    ];

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

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


    const renderComponents = () => {
        switch(apiStatus){
            case apiStatusConstants.failure:
                return <div>failure</div>
            case apiStatusConstants.success:
                return <CtaSection className='shadow'>
                    <H1>Enter Tax Document Details Below</H1>
                    <Form onSubmit={handleFileUpload}>
                        <InputFieldsContainer className="row">
                            {initialFormFields.map((field, index) => (
                                <InputFieldsSubContainer className="col-lg-4 col-md-6 col-sm-12" key={index}>
                                    <Lable htmlFor={field.name}>
                                        <strong>{field.label}</strong>
                                    </Lable>
                                    {field.type === 'select' ? (
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
                                    ) : (
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
                                    )}
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
                            <H1>Uploaded Documents</H1>
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
                                                    {/* <div className='d-flex align-items-center justify-content-center'> */}
                                                    <a
                                                        href={`${domain.domain}/customer-tax-document/download/${document.document_id}`}
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
                return <SweetLoading/>
            default:
                return null
        }
    }

    return (
        <div className='d-flex'>
            <Sidebar />
            <TaxInterviewContainer onDragOver={handleDragOver} onDrop={handleDrop}>
                <BreadCrumb />
                <H1>Upload Tax Document</H1>
                <TaxDescription>
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                
                {renderComponents()}
                {message}
            </TaxInterviewContainer>
        </div>
    );
}

export default UploadDocument;



