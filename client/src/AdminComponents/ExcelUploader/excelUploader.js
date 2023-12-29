import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styled from 'styled-components';
import { H1 } from '../ClientTaxDocuments/styledComponents';
import domain from '../../domain/domain';
import { useNavigate } from 'react-router-dom';
import UnregisteredClients from './Clients/clients';

const ExcelUploaderContainer = styled.div`
  margin-top: 10vh;
  width: 100%;
  padding: 20px;
  height: 90vh;
  background-color: var(--main-background);
  overflow: auto;
`;

const DropzoneContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 8px dashed #cccccc;
  background-color:var(--background-white);
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  margin: 20px 0;
  height: 200px;
`;

const UploadButton = styled.button`
  background-color: #4caf50;
  color: #fff;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
`;

const ExcelUploader = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('customerJwtToken');

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: '.xlsx, .xls',
        multiple: false,
    });

    const handleUpload = async () => {
        if (!file) {
            console.error('No file selected.');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${domain.domain}/dummy-users/from-excel`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

        } catch (error) {
            console.error('Error uploading file:', error);
            // Display an error message to the user
        } finally {
            setLoading(false);
        }
    };

    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }
    }, [navigate]);

    return (
        <ExcelUploaderContainer>
            <H1>Excel Uploader</H1>
            <DropzoneContainer {...getRootProps()} style={dropzoneStyle}>
                <input {...getInputProps()} aria-labelledby="dropzone-title" />
                <p>Drag 'n' drop an Excel file here, or click to select one</p>
            </DropzoneContainer>
            {file && (
                <div>
                    <p>Selected File: {file.name}</p>
                    <UploadButton onClick={handleUpload} disabled={loading}>
                        {loading ? 'Uploading...' : 'Upload'}
                    </UploadButton>
                </div>
            )}
            <UnregisteredClients />
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
