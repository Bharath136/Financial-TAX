// import styled from 'styled-components';

// export const LoginMainContainer = styled.div`
//   background-image: linear-gradient(to bottom right, #f8be42 50%, #ffffff 50%);
// `;

// export const LoginContainer = styled.div`
//   margin-top: 10vh;
//   height: 90vh;
//   width: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `;

// export const LoginCard = styled.div`
//   width: 380px;
//   background-color: rgb(51, 51, 51);
//   opacity: 0.9;
//   padding: 30px;
// `;

// export const AuthHead = styled.h2`
//   font-family: 'Bree Serif';
//   font-size: 30px;
//   color: white;
// `;

// export const LoginForm = styled.form`
//   color: white;
// `;

// export const LoginInput = styled.input`
//   border: 1px solid grey;
//   border-radius: 4px;
//   outline: none;
//   padding: 2px;
//   background: #333;
//   color: white;
// `;

// export const LoginButton = styled.button`
//   border: 1px solid grey;
//   width: 100%;
//   margin-top: 10px;
// `;

// export const SignUpLink = styled.p`
//   color: white;
// `;


// import React, { useState } from 'react';

// import { NavLink } from 'react-router-dom';

// import {
//     LoginMainContainer, LoginContainer,
//     LoginCard,
//     AuthHead,
//     LoginForm,
//     LoginInput,
//     LoginButton,
//     SignUpLink
// } from './styledComponents';

// // Define styled components

// const Login = () => {
//     const initialFormFields = [
//         { label: 'Email', name: 'email', type: 'email', placeholder: 'Email' },
//         { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
//     ];

//     const [formData, setFormData] = useState({});

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle login logic here, e.g., sending the data to a server
//         console.log('Form submitted:', formData);
//     };

//     return (
//         <LoginMainContainer>
//             <LoginContainer>
//                 <LoginCard>
//                     <AuthHead>Sign In</AuthHead>
//                     <LoginForm onSubmit={handleSubmit}>
//                         {initialFormFields.map((field, index) => (
//                             <div className="mb-2 d-flex flex-column" key={index}>
//                                 <label htmlFor={field.name} className="form-label">
//                                     {field.label}
//                                 </label>
//                                 <LoginInput
//                                     type={field.type}
//                                     id={field.name}
//                                     placeholder={field.placeholder}
//                                     name={field.name}
//                                     value={formData[field.name] || ''}
//                                     onChange={handleChange}
//                                     required
//                                 />
//                             </div>
//                         ))}
//                         <LoginButton type="submit">Login</LoginButton>
//                         <SignUpLink>
//                             Don't have an account? <NavLink className="link text-primary" to="/signup">Click Here</NavLink>
//                         </SignUpLink>
//                     </LoginForm>
//                 </LoginCard>
//             </LoginContainer>
//         </LoginMainContainer>
//     );
// };

// export default Login;
