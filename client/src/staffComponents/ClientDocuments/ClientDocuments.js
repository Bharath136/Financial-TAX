import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';
import showAlert from '../../SweetAlert/sweetalert';
import './clientDocuments.css';

const ClientDocuments = () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');
    const [documents, setDocuments] = useState([]);

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            const filteredData = response.data.documents.filter(
                (document) => document.assigned_staff === user.user_id
            );
            setDocuments(filteredData);
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
        try {
            await axios.put(
                `${domain.domain}/customer-tax-document/review-status/${id}`,
                { user_id: user.user_id, review_status: status },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
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

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="tax-interview-container">
                <h1>Tax Documents</h1>
                <p className="tax-description">
                    Welcome to our Tax Interview service! Download the tax notes below, fill in
                    the required information, and upload the necessary tax documents to get
                    started on your tax return process.
                </p>
                <div className="cta-section shadow">
                    {documents.length > 0 && (
                        <div className="document-table-container">
                            <h4 className="text-dark">Uploaded Documents</h4>
                            <table className="document-table">
                                <thead>
                                    <tr>
                                        <th>Document Name</th>
                                        <th>Date & Time</th>
                                        <th>Assigned Status</th>
                                        <th>Review Status</th>
                                        <th>Change Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map((document) => (
                                        <tr key={document.document_id}>
                                            <td>{document.document_path}</td>
                                            <td>{formatDateTime(document.created_on)}</td>
                                            <td>{document.assigned_status}</td>
                                            <td className={`status-${document.review_status.toLowerCase()}`}>
                                                <strong>{document.review_status}</strong>
                                            </td>
                                            <td>
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClientDocuments;
