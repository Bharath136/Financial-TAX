import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import domain from '../../domain/domain';
import axios from 'axios';

// Styled components
const PaymentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  padding: 20px;
  background-color:var(--main-background);
`;

const PaymentContent = styled.div`
  text-align: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  @media screen and (min-width:768px){
    width:500px;
  }
`;

const SuccessHeading = styled.h1`
  color: #2ecc71; /* Green color */
`;

const SuccessParagraph = styled.p`
  margin-top: 10px;
  color: #333;
`;

const ReturnHomeButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: var(--accent-background); /* Blue color */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--button-hover); /* Darker blue color on hover */
  }
`;

const Button = styled.button`
  background-color: #ffc439; /* PayPal yellow */
  color: #003087; /* PayPal blue */
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  position: relative;
`;

const InProgressHeading = styled.h1`
  color: #ffc439; /* Green color */
`;

const InProgressParagraph = styled.p`
  margin-top: 10px;
  color: #333;
`;


const SuccessPage = () => {
  const navigate = useNavigate();

  const [showReturnButton, setShowReturnButton] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const paymentSuccessful = true;

    if (!paymentSuccessful) {
      navigate('/tax-return/failure');
    }
  }, [navigate]);

  const handleReturnHome = () => {
    navigate('/user/tax-return-review');
  };

  const handleExecutePayment = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(window.location.search);
      const payerId = params.get('PayerID') ?? '';
      const paymentId = params.get('paymentId') ?? '';

      if (!payerId || !paymentId) {
        throw new Error('PayerID or paymentId not found in the URL');
      }

      const response = await axios.get(`${domain.domain}/paypal/execute-payment`, {
        params: {
          paymentId,
          payerId,
        },
      });
      setShowReturnButton(true);

      console.log('Payment executed successfully:', response.data.payment);
    } catch (error) {
      console.error('Error executing payment:', error);
    }
  };

  return (
    <PaymentContainer>
      <PaymentContent>
        {!showReturnButton ? (
          <>
            <InProgressHeading>Payment in Progress</InProgressHeading>
            <InProgressParagraph>
              Your payment is being processed. Please click below execute button to complete the transaction.
            </InProgressParagraph>
          </>
        ) : (
          <>
            <SuccessHeading>Payment Successful!</SuccessHeading>
            <SuccessParagraph>
              Thank you for your payment. Your tax return has been processed successfully.
            </SuccessParagraph>
          </>
        )}
        {showReturnButton ? (
          <ReturnHomeButton onClick={handleReturnHome}>Return Back</ReturnHomeButton>
        ) : (
          <Button onClick={handleExecutePayment} disabled={loading} className='w-100'>
            {loading ? (
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              'Execute Payment'
            )}
          </Button>
        )}
      </PaymentContent>
    </PaymentContainer>
  );
};

export default SuccessPage;
