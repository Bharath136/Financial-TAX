import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import Sidebar from '../SideBar/sidebar';
import domain from '../../domain/domain';
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
    Td
} from './styledComponents';

const UploadDocument = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({});
    const [errorMsg, setErrorMsg] = useState(null);
    const [documents, setDocuments] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const filteredData = response.data.documents.filter(document => document.customer_id === user.user_id);
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
        e.preventDefault();

        try {
            if (!selectedFile) {
                setErrorMsg('Please select a file to upload.');
                return;
            }

            const formData = new FormData();
            formData.append('file', selectedFile);

            await axios.post(`${domain.domain}/customer-tax-document/upload`, { file: selectedFile });

            setSelectedFile(null);

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
                await axios.delete(`${domain.domain}/customer-tax-document/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                setDocuments((prevDocuments) => prevDocuments.filter(document => document.document_id !== id));
            } catch (error) {
                console.error('Error deleting document:', error.message);
            }
        }
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <TaxInterviewContainer onDragOver={handleDragOver} onDrop={handleDrop}>
                <H1>Upload Tax Document</H1>
                <TaxDescription>
                    Welcome to our Tax Interview service! Download the tax notes below, fill in the required information, and upload the necessary tax documents to get started on your tax return process.
                </TaxDescription>
                <CtaSection className='shadow'>
                    <H1>Enter Tax Document Details Below</H1>
                    <Form onSubmit={handleUpload} encType="multipart/form-data" >
                        <InputFieldsContainer>
                            {initialFormFields.map((field, index) => (
                                <InputFieldsSubContainer className='w-100' key={index}>
                                    <label htmlFor={field.name} >
                                        <strong>{field.label}</strong>
                                    </label>
                                    <InputField
                                        type={field.type}
                                        className="text-dark w-100"
                                        id={field.name}
                                        placeholder={field.placeholder}
                                        name={field.name}
                                        value={formData[field.name] || ''}
                                        onChange={handleChange}
                                        required
                                    />
                                </InputFieldsSubContainer>
                            ))}
                        </InputFieldsContainer>
                        <input type="file" onChange={handleFileChange} name='documents' style={{ display: 'none' }} />
                        <DragDropArea
                            onClick={() => document.querySelector('input[type="file"]').click()}
                        >
                            <p>Drag & Drop or Click to Upload</p>
                            <DocumentImage src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" />
                        </DragDropArea>
                        {errorMsg && <p className='text-danger'>{errorMsg}</p>}
                        <ButtonContainer>
                            <UploadButton type='submit'>
                                Upload Tax Documents
                            </UploadButton>
                        </ButtonContainer>
                    </Form>

                    {documents.length > 0 &&
                        <DocumentTableContainer >
                            <H1 >Uploaded Documents</H1>
                            <DocumentTable>
                                <thead>
                                    <tr>
                                        <Th>Document Name</Th>
                                        <Th>Date & Time</Th>
                                        <Th>Assigned Status</Th>
                                        <Th>Review Status</Th>
                                        <Th>Delete</Th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <Td>{document.document_path}</Td>
                                            <Td>{formatDateTime(document.created_on)}</Td>
                                            <Td className={`status-${document.assigned_status.toLowerCase()}`}><strong>{document.assigned_status}</strong></Td>
                                            <Td className={`status-${document.review_status.toLowerCase()}`}><strong>{document.review_status}</strong></Td>
                                            <Td>
                                                <button className='btn btn-light' title='delete document' onClick={() => onDeleteDocument(document.document_id)}>
                                                    {<MdDelete size={25} className='text-danger' />}
                                                </button>
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DocumentTable>
                        </DocumentTableContainer>
                    }
                </CtaSection>
            </TaxInterviewContainer>
        </div>
    );
}

export default UploadDocument;



// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const TaxInterview = () => {
//     const [fileData, setFileData] = useState(null);
//     const [fileList, setFileList] = useState([]);

//     useEffect(() => {
//         const fetchFiles = async () => {
//             try {
//                 const response = await axios.get('http://localhost:6000/uploads');
//                 setFileList(response.data.files);
//             } catch (error) {
//                 console.error('Error fetching files:', error);
//             }
//         };

//         fetchFiles();
//     }, []);


//     const handleFileChange = (e) => {
//         const file = e.target.files[0];
//         setFileData(file);
//     };

//     const uploadFile = (e) => {
//         e.preventDefault();

//         if (!fileData) {
//             alert("Please select a file to upload.");
//             return;
//         }

//         const data = new FormData();
//         data.append("file", fileData);

//         axios({
//             method: "POST",
//             url: "http://localhost:6000/upload",
//             data: data,
//         }).then((res) => {
//             alert(res.data.message);
//         });
//     };

//     console.log(fileList)

//     return (
//         <div className='mt-5 ml-5' style={{height:'100vh', paddingTop:'200px'}}>
//             <input type="file" onChange={handleFileChange} />
//             <img src="uploads/1700215171110-2023-05-15.png" alt="Uploaded"/>
//             <button onClick={uploadFile}>Upload File</button>
//             <div>
//                 <h2>Uploaded Files</h2>
//                 <ul>
//                     {fileList.map((file) => (
//                         <li key={file.filename}>
//                             <img
//                                 src={`uploads/${file.path}`}
//                                 alt={file.originalname}
//                                 style={{ maxWidth: '200px', maxHeight: '200px' }}
//                             />{file.path}
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default TaxInterview;
