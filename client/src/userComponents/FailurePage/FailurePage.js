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

const PaymentFailedContent = styled.div`
  text-align: center;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FailureHeading = styled.h1`
  color: #e74c3c; /* Red color */
`;

const FailureParagraph = styled.p`
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

const FailurePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Check the payment status or any other relevant condition
        // and redirect the user accordingly
        const paymentSuccessful = false; // Replace with your actual condition

        if (paymentSuccessful) {
            // Redirect to the success route
            navigate('/tax-return/success');
        }
    }, [navigate]);

    const handleReturnHome = () => {
        // Navigate to the home page or any other desired route
        navigate('/');
    };

    return (
        <PaymentContainer>
            <PaymentFailedContent>
                <FailureHeading>Payment Failed!</FailureHeading>
                <FailureParagraph>
                    Sorry, there was an issue processing your payment. Please try again.
                </FailureParagraph>
                <ReturnHomeButton onClick={handleReturnHome}>Return Home</ReturnHomeButton>
            </PaymentFailedContent>
        </PaymentContainer>
    );
};

export default FailurePage;
