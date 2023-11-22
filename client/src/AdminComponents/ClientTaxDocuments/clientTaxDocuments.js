import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import axios from 'axios';
import domain from '../../domain/domain';
import Sidebar from '../../userComponents/SideBar/sidebar';

import './clientTaxDocuments.css';
import showAlert from '../../SweetAlert/sweetalert';

const ClientTaxDocuments = () => {
    const [documents, setDocuments] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accessToken = localStorage.getItem('customerJwtToken');

    const fetchDocuments = async () => {
        try {
            const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const filteredData = response.data.documents.filter((document) => {
                return document.assigned_staff === user.user_id;
            });
            setDocuments(filteredData);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };



    useEffect(() => {
        fetchDocuments();
    }, []);

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
            const response = await axios.put(
                `${domain.domain}/customer-tax-document/review-status/${id}`,
                { user_id: user.user_id, review_status: status },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }

            );
            showAlert({
                title: response.data,
                text: '',
                icon: 'success',
                confirmButtonText: 'Ok'
            })
            fetchDocuments();
            setDocuments((prevDocuments) =>
                prevDocuments.map((document) =>
                    document.document_id === id
                        ? { ...document, assigned_status: status }
                        : document
                )
            );
        } catch (error) {
            console.error('Error updating document status:', error.message);
        }
    };

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="tax-interview-container">
                <h1>Tax Documents</h1>
                <p className="tax-description">
                    Welcome to our Tax Interview service! Download the tax notes below,
                    fill in the required information, and upload the necessary tax
                    documents to get started on your tax return process.
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
                                            <td className={`status-${document.review_status.toLowerCase()}`}><strong>{document.review_status}</strong></td>
                                            <td>
                                                <DropdownButton
                                                    id={`dropdown-button-${document.document_id}`}
                                                    title="Change"
                                                    variant="warning"
                                                >
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            onChangeDocumentStatus(
                                                                document.document_id,
                                                                'Pending'
                                                            )
                                                        }
                                                    >
                                                        Pending
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            onChangeDocumentStatus(
                                                                document.document_id,
                                                                'Reviewed'
                                                            )
                                                        }
                                                    >
                                                        Reviewed
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        onClick={() =>
                                                            onChangeDocumentStatus(
                                                                document.document_id,
                                                                'Rejected'
                                                            )
                                                        }
                                                    >
                                                        Rejected
                                                    </Dropdown.Item>
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

export default ClientTaxDocuments;
