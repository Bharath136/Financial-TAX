import React, { useEffect, useState } from 'react';
import '../../userComponents/TaxInterview/taxInterview.css'
import axios from 'axios';
import domain from '../../domain/domain';
import { MdDelete } from 'react-icons/md';
import Sidebar from '../../userComponents/SideBar/sidebar';

const TaxReturnDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [documents, setDocuments] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'))
    const accessToken = localStorage.getItem('customerJwtToken');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                })
                const filteredData = response.data.documents.filter(document => {
                    return document.customer_id === user.user_id
                })
                setDocuments(filteredData);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };

        fetchDocuments();
    }, [user.user_id, accessToken]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

    const handleUpload = async (e) => {
        e.preventDefault(); // Prevent form submission

        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            // Implement your upload logic here, e.g., send the file to the server
            // const formData = new FormData();
            formData.append('file', selectedFile);

            console.log(formData);

            const response = await axios.post(`${domain.domain}/customer-tax-document/upload`, { file: selectedFile });

            console.log(response)
            // Clear selected file after successful upload
            setSelectedFile(null);

            // Refetch the updated document list
            const updatedDocuments = await axios.get(`${domain.domain}/customer-tax-document`);
            setDocuments(updatedDocuments.data.documents);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const initialFormFields = [
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' }
    ];

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const onDeleteDocument = async (id) => {
        const result = window.confirm("Are you sure you want to delete this document?");
        if (result) {
            try {
                const response = await axios.delete(`${domain.domain}/customer-tax-document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                console.log(response);
                setDocuments((prevDocuments) => prevDocuments.filter(document => document.document_id !== id));
            } catch (error) {
                console.error('Error deleting document:', error.message);
            }
        }
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <div className="tax-interview-container" onDragOver={handleDragOver} onDrop={handleDrop}>
                <h1>Upload Tax Return Document</h1>
                <p className='tax-description'>
                    Welcome to our Tax Return service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </p>
                <div className='cta-section shadow'>
                    <h1>Enter Tax Return Document Details Below</h1>
                    <form onSubmit={handleUpload} encType="multipart/form-data" className='form-container document-form-container p-md-4'>

                        <div className='d-flex flex-column flex-md-row'>
                            {initialFormFields.map((field, index) => (
                                <div className="mb-2 d-flex flex-column m-2" key={index}>
                                    <div className='d-flex justify-content-between'>
                                        <label htmlFor={field.name} className="form-label text-dark m-0">
                                            <strong>{field.label}</strong>
                                        </label>
                                    </div>
                                    <input
                                        type={field.type}
                                        className="p-2 text-dark w-100" style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            ))}
                        </div>
                        <input type="file" onChange={handleFileChange} name='documents' style={{ display: 'none' }} />
                        <div
                            className='drag-drop-area'
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            <p>Drag & Drop or Click to Upload</p>
                            <img src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" className="document-image" />
                        </div>
                        {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                        <div className='w-100 text-center'>
                            <button className='upload-button' type='submit'>
                                Upload Tax Return Documents
                            </button>
                        </div>
                    </form>

                    {documents.length > 0 &&
                        <div className="document-table-container">
                            <h4 className='text-dark'>Uploaded Tax Return Documents</h4>
                            <table className="document-table">
                                <thead>
                                    <tr>
                                        <th>Document Name</th>
                                        <th>Date & Time</th>
                                        <th>Assigned Status</th>
                                        <th>Review Status</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <td>{document.document_path}</td>
                                            <td>{formatDateTime(document.created_on)}</td>
                                            <td className={`status-${document.assigned_status.toLowerCase()}`}><strong>{document.assigned_status}</strong></td>
                                            <td className={`status-${document.review_status.toLowerCase()}`}><strong>{document.review_status}</strong></td>
                                            <td>
                                                <button className='btn btn-light ml-2' title='delete document' onClick={() => {
                                                    onDeleteDocument(document.document_id)
                                                }}>{<MdDelete size={25} className='text-danger' />}</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default TaxReturnDocument;
