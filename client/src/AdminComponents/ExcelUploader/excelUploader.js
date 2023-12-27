import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styled from 'styled-components';
import { H1 } from '../ClientTaxDocuments/styledComponents';
import domain from '../../domain/domain';
import { useNavigate } from 'react-router-dom';

const ExcelUploaderContainer = styled.div`
    margin-top: 10vh;
    width: 100%;
    padding: 20px;
      background-color:var(--main-background);
`;

const DropzoneContainer = styled.div`
    display:flex;
    align-items:center;
    justify-content:center;
    border: 2px dashed #cccccc;
    border-radius: 4px;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    margin: 20px 0;
    height:200px;
`;

const UploadButton = styled.button`
    background-color: #4caf50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
`;

const ExcelUploader = () => {
    // const [file, setFile] = useState(null);
    // const token = localStorage.getItem('customerJwtToken')

    // const onDrop = (acceptedFiles) => {
    //     setFile(acceptedFiles[0]);
    // };

    // const { getRootProps, getInputProps } = useDropzone({
    //     onDrop,
    //     accept: '.xlsx, .xls', // Double-check and validate these MIME types
    //     multiple: false,
    // });


    // const handleUpload = async () => {
    //     if (!file) {
    //         console.error('No file selected.');
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append('file', file);
    //     console.log(file)

    //     try {
    //         const response = await axios.post(`${domain.domain}/dummy-users/from-excel`, formData, {
    //             headers: {
    //                 Authorization:`Bearer ${token}`,
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });

    //         console.log('Response:', response.data);
    //         // Display a success message to the user
    //     } catch (error) {
    //         console.error('Error uploading file:', error);
    //         // Display an error message to the user
    //     }
    // };

    // return (
    //     <ExcelUploaderContainer>
    //         <H1>Excel Uploader</H1>
    //         <DropzoneContainer {...getRootProps()} style={dropzoneStyle}>
    //             <input {...getInputProps()} aria-labelledby="dropzone-title" />
    //             <p>Drag 'n' drop an Excel file here, or click to select one</p>
    //         </DropzoneContainer>
    //         {file && (
    //             <div>
    //                 <p>Selected File: {file.name}</p>
    //                 <UploadButton onClick={handleUpload}>Upload</UploadButton>
    //             </div>
    //         )}
    //     </ExcelUploaderContainer>
    // );

    const [file, setFile] = useState(null);
    const user = JSON.parse(localStorage.getItem('currentUser'))

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const navigate = useNavigate()
    

    useEffect(() => {
        if (user) {;
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }
    },[navigate])

    const handleUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            await axios.post(`${domain.domain}/excel-uploader`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('File uploaded successfully');
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    return (
        <ExcelUploaderContainer>
            <H1>Excel Uploader</H1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </ExcelUploaderContainer>
    );

};

const dropzoneStyle = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    margin: '20px 0',
};

export default ExcelUploader;
