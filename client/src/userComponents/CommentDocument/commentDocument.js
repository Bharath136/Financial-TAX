import React, { useEffect, useState } from 'react';
import './commentDocument.css';
import Sidebar from '../SideBar/sidebar';
import axios from 'axios';
import domain from '../../domain/domain';
import showAlert from '../../SweetAlert/sweetalert';
import { MdDelete } from 'react-icons/md';

const CommentDocument = () => {
    const [documents, setDocuments] = useState([]);
    const [formData, setFormData] = useState({});
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState({});
    const [comments, setComments] = useState([]);
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('customerJwtToken');
                const response = await axios.get(`${domain.domain}/customer-tax-document`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const filteredData = response.data.documents.filter((doc) => doc.customer_id === user.user_id);
                setDocuments(filteredData);
            } catch (error) {
                console.error('Error fetching documents:', error);
            }
        };
        fetchData();
    }, [user]);

    const handleToggleCommentInput = (document) => {
        setShowCommentInput(!showCommentInput);
        setSelectedDocument(document);
    };

    const handleCommentSubmit = async () => {
        try {
            const token = localStorage.getItem('customerJwtToken');
            const newComment = {
                customer_id: user.user_id,
                staff_id: selectedDocument.assigned_staff,
                document_id: selectedDocument.document_id,
                comment: formData.comment,
                financial_year: formData.financial_year,
                financial_quarter: formData.financial_quarter,
                financial_month: formData.financial_month,
            };
            await axios.post(`${domain.domain}/customer-tax-comment/create`, newComment, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            showAlert({ title: 'Comment Submitted Successfully!', icon: 'success' });
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
        setShowCommentInput(false);
    };

    const handleGetComments = async (document) => {
        try {
            const token = localStorage.getItem('customerJwtToken');
            const response = await axios.get(`${domain.domain}/customer-tax-comment/`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const filteredData = response.data.filter((comment) => comment.document_id === document.document_id);
            setComments(filteredData);
            setShowComments(!showComments)
            setSelectedDocument(document)
        } catch (error) {
            console.error('Error getting comments:', error);
        }
    };

    const onDeleteDocumentComment = async (id) => {
        try {
            const token = localStorage.getItem('customerJwtToken');
            await axios.delete(`${domain.domain}/customer-tax-comment/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            handleGetComments(selectedDocument);
            showAlert({ title: 'Comment Deleted Successfully!', icon: 'success' });
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const initialFormFields = [
        { label: 'Year', name: 'financial_year', type: 'number', placeholder: 'Ex:- 2023' },
        { label: 'Month', name: 'financial_month', type: 'number', placeholder: 'Ex:- 5' },
        { label: 'Quarter', name: 'financial_quarter', type: 'number', placeholder: 'Ex:- 1' }
    ];

    return (
        <div className="d-flex">
            <Sidebar />
            <div className="comment-document-container">
                <h3>Comment on Document</h3>
                <p className="document-description">
                    Welcome to our Comment Document service! Add comments to the documents for your tax return process.
                </p>
                <div className="cta-section w-100 border shadow">
                    <form className="w-100">
                        {documents.length > 0 && (
                            <div className="document-table-container">
                                <h4 className="text-dark">Documents with Comments</h4>
                                <table className="document-table">
                                    <thead>
                                        <tr>
                                            <th>Document Name</th>
                                            <th>Date & Time</th>
                                            <th>Assigned Status</th>
                                            <th>Review Status</th>
                                            <th>Add Comment</th>
                                            <th>Comments</th>
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
                                                    <button type="button" className='button' onClick={() => handleToggleCommentInput(document)}>
                                                        Comment
                                                    </button>
                                                </td>
                                                <td>
                                                    <button type="button" onClick={() => handleGetComments(document)} className="view-button button">
                                                        View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {showCommentInput && selectedDocument && (
                            <div className="mt-5">
                                <label><strong>Comment for Document:</strong> {documents.find((doc) => doc.document_id === selectedDocument.document_id)?.document_path}</label>
                                <div className="d-flex flex-column flex-md-row">
                                    {initialFormFields.map((field, index) => (
                                        <div className="mb-2 d-flex flex-column m-2 mt-4" key={index}>
                                            <div className="d-flex justify-content-between">
                                                <label htmlFor={field.name} className="form-label text-dark m-0">
                                                    <strong>{field.label}</strong>
                                                </label>
                                            </div>
                                            <input
                                                type={field.type}
                                                className="p-2 text-dark w-100"
                                                style={{ border: '1px solid grey', borderRadius: '4px', outline: 'none' }}
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
                                <textarea
                                    id="commentInput"
                                    rows={6}
                                    value={formData.comment || ''}
                                    placeholder="Write your comment to the document..."
                                    onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                />
                                <button type="button" className='button' onClick={handleCommentSubmit}>
                                    Send Comment
                                </button>
                            </div>
                        )}

                        {showComments && comments.length >= 0 && (
                            <div className="document-table-container mt-5">
                                <label><strong>Comments for Document:</strong> {selectedDocument.document_path}</label>
                                <table className="document-table">
                                    <thead>
                                        <tr>
                                            <th>Comment ID</th>
                                            <th>Customer ID</th>
                                            <th>Staff ID</th>
                                            <th>Document ID</th>
                                            <th>Comment</th>
                                            <th>Comment Status</th>
                                            <th>Created On</th>
                                            <th>Updated On</th>
                                            <th>Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.map((comment) => (
                                            <tr key={comment.comment_id}>
                                                <td>{comment.comment_id}</td>
                                                <td>{comment.customer_id}</td>
                                                <td>{comment.staff_id}</td>
                                                <td>{comment.document_id}</td>
                                                <td>{comment.comment}</td>
                                                <td className={`status-${comment.comment_status.toLowerCase()}`}>
                                                    <strong>{comment.comment_status}</strong>
                                                </td>
                                                <td>{formatDateTime(comment.created_on)}</td>
                                                <td>{formatDateTime(comment.updated_on)}</td>
                                                <td>
                                                    <button className="btn btn-light ml-2" title="delete document" onClick={() => onDeleteDocumentComment(comment.comment_id)}>
                                                        <MdDelete size={25} className="text-danger" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CommentDocument;
