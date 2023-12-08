import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../SideBar/sidebar';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';

const PaymentSectionContainer = styled.div`
  display: flex;
  flex-direction:column;
  width:100%;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const PaymentForm = styled.form`
  background-color: #ffffff;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  padding: 40px;
  border-radius: 10px;
  width: 400px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  transition: border-color 0.3s;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 15px;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const MakePayment = () => {
  const user = JSON.parse(localStorage.getItem('currentUser'))

  const navigate = useNavigate()

  useEffect(() => {
    if (user.role === 'ADMIN') {
      navigate('/admin-dashboard')
    } else if (user.role === 'STAFF') {
      navigate('/staff-dashboard')
    }
  })

  return (
    <div className='d-flex'>
      <Sidebar />
      <PaymentSectionContainer>
        <div>
          <h2>Pay Tax with PayPal</h2>
          <PayPalScriptProvider options={{ 'client-id': 'YOUR_PAYPAL_CLIENT_ID' }}>
            <PayPalButtons
              style={{ layout: 'horizontal' }}
              createOrder={(data, actions) => {
                // Implement logic to create tax payment order on the server
                return actions.order.create({
                  purchase_units: [
                    {
                      description: 'Tax Payment',
                      amount: {
                        currency_code: 'USD',
                        value: '100.00', // Set your tax payment amount
                      },
                    },
                  ],
                });
              }}
              onApprove={(data, actions) => {
                // Implement logic to capture the tax payment on the server
                return actions.order.capture().then(details => {
                  console.log('Tax Payment completed by ' + details.payer.name.given_name);
                  // Call your backend to save the tax payment details
                });
              }}
            />
          </PayPalScriptProvider>
        </div>
      </PaymentSectionContainer>
    </div>
  );
};

export default MakePayment;



// {/* <PaymentSectionContainer>
//                 <PaymentForm onSubmit={handlePaymentSubmit}>
//                     <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>Payment Details</h2>
//                     <FormGroup>
//                         <Label>Card Number</Label>
//                         <Input
//                             type="text"
//                             placeholder="Enter card number"
//                             value={cardNumber}
//                             onChange={(e) => setCardNumber(e.target.value)}
//                         />
//                     </FormGroup>
//                     <FormGroup>
//                         <Label>Expiry Date</Label>
//                         <Input
//                             type="text"
//                             placeholder="MM/YY"
//                             value={expiryDate}
//                             onChange={(e) => setExpiryDate(e.target.value)}
//                         />
//                     </FormGroup>
//                     <FormGroup>
//                         <Label>CVC</Label>
//                         <Input
//                             type="text"
//                             placeholder="CVC"
//                             value={cvc}
//                             onChange={(e) => setCvc(e.target.value)}
//                         />
//                     </FormGroup>
//                     <Button type="submit">Submit Payment</Button>
//                 </PaymentForm>
//             </PaymentSectionContainer>
//          */}