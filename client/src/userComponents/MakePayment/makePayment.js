import React, { useState } from 'react';
import styled from 'styled-components';
import Sidebar from '../SideBar/sidebar';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import BreadCrumb from '../../breadCrumb/breadCrumb';

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
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvc, setCvc] = useState('');

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        // Add your payment processing logic here
        console.log('Payment submitted:', { cardNumber, expiryDate, cvc });
    };

    return (
        <div className='d-flex'>
            <Sidebar />
            <PaymentSectionContainer>
            {/* <BreadCrumb/> */}
                <PaymentForm onSubmit={handlePaymentSubmit}>
                    <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#333' }}>Payment Details</h2>
                    <FormGroup>
                        <Label>Card Number</Label>
                        <Input
                            type="text"
                            placeholder="Enter card number"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>Expiry Date</Label>
                        <Input
                            type="text"
                            placeholder="MM/YY"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label>CVC</Label>
                        <Input
                            type="text"
                            placeholder="CVC"
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                        />
                    </FormGroup>
                    <Button type="submit">Submit Payment</Button>
                </PaymentForm>
            </PaymentSectionContainer>
        </div>
    );
};

export default MakePayment;
