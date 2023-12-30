import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';
import PayPalLogo from '../../Assets/PayPal.svg.png';
import { message } from '../../components/Footer/footer';
import { getToken, getUserData } from '../../StorageMechanism/storageMechanism';

const PaymentSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--main-background);
`;

const PaymentForm = styled.div`
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  max-width: 400px;
  width: 100%;

  h2 {
    margin-bottom: 20px;
    color: #003087;
  }

  label {
    display: block;
    margin-bottom: 10px;
    color: #003087;
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #003087;
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    background-color: #ffc439;
    color: #003087;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    position: relative;
  }

  .loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  p {
    margin-top: 20px;
    color: #28a745;
  }

  a {
    color: #003087;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    width: 50px;
    margin-bottom: 20px;
  }
`;

const MakePayment = () => {
  const user = getUserData()
  const token = getToken()
  const [approvalUrl, setApprovalUrl] = useState('');
  const [selectedDoc, setSelectedDoc] = useState({});
  // const [amount, setAmount] = useState(selectedDoc?.payment_amount || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();

  const getTaxReturnDocumentDetails = async () => {
    try {
      const response = await axios.get(`${domain.domain}/tax-return-document/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedDoc(response.data.documents[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const createPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${domain.domain}/paypal/create-payment`, {
        user: user,
        amount: selectedDoc.payment_amount,
        document_id: selectedDoc.taxreturn_id
      });

      const { approvalUrl } = response.data;
      setApprovalUrl(approvalUrl);
    } catch (error) {
      setError('Failed to create payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (user.role === 'STAFF') {
        navigate('/staff/dashboard');
      }
      getTaxReturnDocumentDetails();
    }
  }, [navigate]);

  return (
    <PaymentSectionContainer>
      <PaymentForm>
        <img src={PayPalLogo} alt="PayPal Logo" style={{ width: '200px' }} />
        <label>
          Enter Amount:
          <input
            type="number"
            placeholder="Enter your tax amount"
            value={selectedDoc.payment_amount}
            // onChange={onChangeAmount}
          />
        </label>
        {approvalUrl ? (
          <>
            <p>Payment created successfully!</p>
            <button disabled={loading} className="w-100">
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              ) : <a href={approvalUrl} target="_self" rel="noopener noreferrer">
                Click here to approve the payment
              </a>}
            </button>
          </>
        ) : (
          <button onClick={createPayment} disabled={loading} className="w-100">
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              'Create Payment'
            )}
          </button>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </PaymentForm>
      {/* {message} */}
    </PaymentSectionContainer>
  );
};

export default MakePayment;
