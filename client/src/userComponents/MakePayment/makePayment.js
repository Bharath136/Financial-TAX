import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import domain from '../../domain/domain';

// Import the PayPal logo SVG
import PayPalLogo from '../../Assets/PayPal.svg.png';

const PaymentSectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color:var(--main-background);
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
    color: #003087; /* Updated text color to white */
  }

  label {
    display: block;
    margin-bottom: 10px;
    color: #003087; /* Updated text color to white */
  }

  input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #003087; /* Updated border color to white */
    border-radius: 4px;
    box-sizing: border-box;
  }

  button {
    background-color: #ffc439; /* PayPal yellow */
    color: #003087; /* PayPal blue */
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
    color: #003087; /* Updated text color to white */
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }

  img {
    width: 50px; /* Adjust the width of the PayPal logo */
    margin-bottom: 20px;
  }
`;

const MakePayment = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const [approvalUrl, setApprovalUrl] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [payerId, setPayerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // New state for error handling

  const handleCreatePayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${domain.domain}/paypal/create-payment`, {
        user: user,
        amount: parseFloat(amount),
      });

      const { approvalUrl, paymentId, payerId } = response.data;
      setApprovalUrl(approvalUrl);
      setPaymentId(paymentId);
      setPayerId(payerId)
    } catch (error) {
      console.error('Error creating payment:', error);
      setError('Failed to create payment. Please try again.'); // Set error message
    } finally {
      setLoading(false);
    }
  };



  const handleExecutePayment = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${domain.domain}/paypal/execute-payment`, {
        params: {
          paymentId: paymentId,
          payerId: payerId,
        },
      });

      console.log('Payment executed successfully:', response.data.payment);
    } catch (error) {
      console.error('Error executing payment:', error);
      setError('Failed to execute payment. Please try again.'); // Set error message
    } finally {
      setLoading(false);
    }
  };



  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'ADMIN') {
        navigate('/admin/dashboard')
      } else if (user.role === 'STAFF') {
        navigate('/staff/dashboard')
      }
    }
  }, [navigate]);

  const onChangeAmount = (event) => {
    setAmount(event.target.value);
  };

  return (
    <PaymentSectionContainer>
      <PaymentForm>
        <img src={PayPalLogo} alt="PayPal Logo" style={{ width: '200px' }} />
        <label>
          Enter Amount:
          <input
            type="number"
            placeholder='Enter your tax amount'
            value={amount}
            onChange={onChangeAmount}
          />
        </label>
        {approvalUrl ? (
          <>
            <p>Payment created successfully!</p>
            <a href={approvalUrl} target="_blank" rel="noopener noreferrer">
              Click here to approve the payment
            </a>
            <button onClick={handleExecutePayment} disabled={loading} className='w-100'>
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only"></span>
                </div>
              ) : (
                'Execute Payment'
              )}
            </button>
          </>
        ) : (
          <button onClick={handleCreatePayment} disabled={loading} className='w-100'>
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
    </PaymentSectionContainer>
  );
};

export default MakePayment;