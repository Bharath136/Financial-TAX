import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import domain from '../../domain/domain';
import formatDateTime from '../../FormatDateTime/DateTime';
import { H1 } from '../ClientTaxDocuments/styledComponents';
import { useNavigate } from 'react-router-dom';

const TableWrapper = styled.div`
  padding:20px;
  margin-top:10vh;
  width:100%;
  overflow:auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHead = styled.thead`
  background-color: #f5f5f5;
`;

const TableBody = styled.tbody`
  & tr:nth-child(odd) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableHeaderCell = styled.th`
  padding: 10px;
  border: 1px solid #ddd;
`;

const PaymentDetails = () => {
    const token = localStorage.getItem('customerJwtToken');
    const [paymentDetails, setPaymentDetails] = useState([]);

    const user = JSON.parse(localStorage.getItem('currentUser'))

    const navigate = useNavigate()


    useEffect(() => {
        if (user) {
            ;
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'CUSTOMER') {
                navigate('/user/dashboard');
            }
        }
        const getDetails = async () => {
            try {
                const response = await axios.get(`${domain.domain}/paypal/payment-details`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setPaymentDetails(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        getDetails()
    }, []);

    return (
        <TableWrapper>
        <H1>Payments</H1>
            <Table>
                <TableHead>
                    <tr>
                        <TableHeaderCell>User ID</TableHeaderCell>
                        <TableHeaderCell>Document ID</TableHeaderCell>
                        <TableHeaderCell>Payment ID</TableHeaderCell>
                        <TableHeaderCell>Payer ID</TableHeaderCell>
                        <TableHeaderCell>Amount</TableHeaderCell>
                        <TableHeaderCell>Date</TableHeaderCell>
                    </tr>
                </TableHead>
                <TableBody>
                    {paymentDetails.map((payment) => (
                        <tr key={payment.payment_id}>
                            <TableCell>{payment.user_id}</TableCell>
                            <TableCell>{payment.document_id}</TableCell>
                            <TableCell>{payment.payment_id}</TableCell>
                            <TableCell>{payment.payer_id}</TableCell>
                            <TableCell>{payment.amount}</TableCell>
                            <TableCell>{formatDateTime(payment.date)} </TableCell>
                        </tr>
                    ))}
                </TableBody>
            </Table>
        </TableWrapper>
    );
};

export default PaymentDetails;
