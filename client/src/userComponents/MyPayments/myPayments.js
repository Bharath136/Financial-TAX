import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import domain from '../../domain/domain';
import formatDateTime from '../../FormatDateTime/DateTime';
import { useNavigate } from 'react-router-dom';
import { Description } from '../../AdminComponents/ClientTaxDocuments/styledComponents';
import FailureComponent from '../../FailureComponent/failureComponent';
import SweetLoading from '../../SweetLoading/SweetLoading';
import { H1 } from '../CommentDocument/styledComponents';
import { message } from '../../components/Footer/footer';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const TableWrapper = styled.div`
  padding:20px;
  margin-top:10vh;
  width:100%;
  height:90vh;
  overflow:auto;
  background-color:var(--main-background);
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

const NoPaymentsContainer = styled.div`
    min-height:80vh;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    text-align:center;
`

const apiStatusConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    failure: 'FAILURE',
    inProgress: 'IN_PROGRESS',
};

const MyPaymentDetails = () => {
    
    const [paymentDetails, setPaymentDetails] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)

    const user = getUserData();
    const token = getToken();

    const navigate = useNavigate()

    useEffect(() => {
        if (user) {
            ;
            if (user.role === 'STAFF') {
                navigate('/staff/dashboard');
            } else if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            }
        }
        const getDetails = async () => {
            setApiStatus(apiStatusConstants.inProgress)
           setInterval(async () => {
               try {
                   const response = await axios.get(`${domain.domain}/paypal/payment-details`, {
                       headers: {
                           Authorization: `Bearer ${token}`
                       }
                   })
                   const fiteredDocuments = response.data.filter((document) => document.payer_id !== null)
                   setPaymentDetails(fiteredDocuments)
                   setApiStatus(apiStatusConstants.success)
               } catch (error) {
                   setApiStatus(apiStatusConstants.failure)
                   setErrorMsg(error)
               }
           },1000)
        }
        getDetails()
    }, []);


    const renderPayments = () => {
        return(
            <TableWrapper>
                <H1>Payments</H1>
                {paymentDetails.length > 0 ? <Table>
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
                </Table> : <NoPaymentsContainer>
                    <H1>No Payments</H1>
                    <Description>No payment details are available at the moment.</Description>
                </NoPaymentsContainer>}
                {message}
            </TableWrapper>
        )
    }

    const onRenderComponents = () => {
        switch(apiStatus){
            case apiStatusConstants.inProgress:
                return <SweetLoading/>;
            case apiStatusConstants.success:
                return renderPayments();
            case apiStatusConstants.failure:
                return <FailureComponent errorMsg={errorMsg} />;
            default:
                return null;
        }
    }

    return (
        onRenderComponents()
    );
};

export default MyPaymentDetails;
