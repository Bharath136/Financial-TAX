import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import styled from 'styled-components';
import { H1 } from '../ClientTaxDocuments/styledComponents';
import domain from '../../domain/domain';
import { useNavigate } from 'react-router-dom';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';
import { ViewButton } from '../Clients/styledComponents';
import FailureComponent from '../../FailureComponent/failureComponent';
import SweetLoading from '../../SweetLoading/SweetLoading';
import showAlert from '../../SweetAlert/sweetalert';
import { DocumentImage, DragDropArea } from '../../userComponents/TaxreturnReview/styledComponents';

const ExcelUploaderContainer = styled.div`
  width: 100%;
  padding-botton:100px;
`;

const DropzoneContainer = styled.div`
  display: flex;
  flex-direction:column;
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


// Constants for API status
const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const ExcelUploader = ({fetchClients}) => {
    const [file, setFile] = useState(null);
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);
    const [errorMsg, setErrorMsg] = useState('')
    const token = getToken();
    const user = getUserData();

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

        setApiStatus(apiStatusConstants.inProgress)

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post(`${domain.domain}/dummy-users/from-excel`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            showAlert({
                title: 'File Uploaded Successful!',
                text: "",
                icon: 'success',
                confirmButtonText: 'OK',
            });
            setFile(null)
            setApiStatus(apiStatusConstants.success)

        } catch (error) {
            setApiStatus(apiStatusConstants.failure)
            setErrorMsg(error)
        }
    };

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

    const renderSuccess = () => {
        return(
            
                <>
                <ExcelUploaderContainer>
                    <H1>Excel Uploader</H1>
                    <DropzoneContainer {...getRootProps()} style={dropzoneStyle}>
                        <input {...getInputProps()} aria-labelledby="dropzone-title" />
                        {/* <DocumentImage src='https://www.computerhope.com/jargon/d/doc.png' alt="Document" /> */}
                        <p>Drag 'n' drop an Excel file here, or click to select one</p>
                    </DropzoneContainer>
                </ExcelUploaderContainer>
                {file && (
                    <div className='d-flex align-items-center justify-content-between'>
                        <p>Selected File: {file.name}</p>
                        <ViewButton onClick={handleUpload} >
                            Upload
                        </ViewButton>
                    </div>
                )}
                </>
           
        )
    }

    const renderComponents = () => {
        switch (apiStatus) {
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} fetchData={fetchClients}/>
            case apiStatusConstants.inProgress:
                return <SweetLoading />
            case apiStatusConstants.success:
                return renderSuccess();
            default:
                return renderSuccess();
        }
    }


    return (
        renderComponents()
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
