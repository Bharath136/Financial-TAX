import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// Styled components
const PaymentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const PaymentContent = styled.div`
  text-align: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
  background-color: #3498db; /* Blue color */
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9; /* Darker blue color on hover */
  }
`;

const SuccessPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check the payment status or any other relevant condition
        // and redirect the user accordingly
        const paymentSuccessful = true; // Replace with your actual condition

        if (!paymentSuccessful) {
            // Redirect to the failure route
            navigate('/tax-return/failure');
        }
    }, [navigate]);

    const handleReturnHome = () => {
        // Navigate to the home page or any other desired route
        navigate('/');
    };

    return (
        <PaymentContainer>
            <PaymentContent>
                <SuccessHeading>Payment Successful!</SuccessHeading>
                <SuccessParagraph>
                    Thank you for your payment. Your tax return has been processed successfully.
                </SuccessParagraph>
                <ReturnHomeButton onClick={handleReturnHome}>Return Home</ReturnHomeButton>
            </PaymentContent>
        </PaymentContainer>
    );
};

export default SuccessPage;
