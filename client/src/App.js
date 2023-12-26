import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/header';
import Login from './components/Login/login';
import Register from './components/Register/register';
import About from './components/About/about';
import Services from './components/Services/services';
import Contact from './components/Contact/contact';
import CommentDocument from './userComponents/CommentDocument/commentDocument';
import MySummary from './userComponents/TaxreturnReview/taxreturnReview';
import MakePayment from './userComponents/MakePayment/makePayment';
import TaxInterview from './userComponents/TaxInterview/taxInterview';
import Landingpage from './components/Landingpage/landingpage';
import ProtectedRoute from './userComponents/ProtectedRoute/protectedRoute';
import AuthContext from './AuthContext/AuthContext';
import showAlert from './SweetAlert/sweetalert';
import StaffDashboard from './staffComponents/StaffDashboard/staffDashboard';
import UserDashboard from './userComponents/UserDashboard/userDashboard';
import AssignedClientList from './staffComponents/AssignedClients/assignedClients';
import ClientDocuments from './staffComponents/ClientDocuments/ClientDocuments';
import TaxReturnDocument from './staffComponents/TaxReturnDocument/taxReturnDocument';
import Clients from './AdminComponents/Clients/clients';
import Staff from './AdminComponents/Staff/staff';
import ClientTaxDocuments from './AdminComponents/ClientTaxDocuments/clientTaxDocuments';
import NotFound from './NotFound/notFound';
import AddStaff from './AdminComponents/AddStaff/addStaff';
import UploadDocument from './userComponents/UploadDocument/uploadDocument';
import AdminDashboard from './AdminComponents/AdminDashboard/adminDashboard';
import ForgotPassword from './components/ForgotPassword/forgotPassword';
import FailurePage from './userComponents/FailurePage/FailurePage';
import SuccessPage from './userComponents/SuccessPage/successPage';
import ContactView from './AdminComponents/Messages/message';
import Sidebar from './userComponents/SideBar/sidebar';
import PaymentDetails from './AdminComponents/Payments/payments';
import MyPaymentDetails from './userComponents/MyPayments/myPayments';
import AddCustomer from './AdminComponents/AddCustomer/addCustomer';
import ExcelUploader from './AdminComponents/ExcelUploader/excelUploader';

function App() {
  const [currentToken, setCurrentToken] = useState('');
  const [hideSidebar, setHideSidebar] = useState(false);
  const [showNav, setShowNav] = useState(true);

  useEffect(() => {
    const userToken = localStorage.getItem('customerJwtToken');
    setCurrentToken(userToken);
  }, [currentToken]);

  const onLogout = async () => {
    const popup = {
      title: 'Logout Successful!',
      text: 'You have successfully logged out. Thank you for using our financial tax app!',
      icon: 'success',
      confirmButtonText: 'OK'
    };
    setShowNav(true);
    showAlert(popup);
    localStorage.removeItem('customerJwtToken');
    localStorage.removeItem('currentUser');
    setCurrentToken('');
  };

  const onHideSidebar = () => {
    setHideSidebar(!hideSidebar);
  };

  const routes = [
    { path: '/', element: <Landingpage /> },
    { path: '/accounts/login', element: <Login setShowNav={setShowNav} /> },
    { path: '/accounts/forgot-password', element: <ForgotPassword setShowNav={setShowNav} /> },
    { path: '/accounts/signup', element: <Register /> },
    { path: '/about', element: <About /> },
    { path: '/services', element: <Services /> },
    { path: '/contact', element: <Contact /> },
    {
      path: '/user/*',
      element: <UserSection />,
      children: [
        { path: '*', element: <NotFound /> } // Handle bad paths within UserSection
      ]
    },
    {
      path: '/staff/*',
      element: <StaffSection />,
      children: [
        { path: '*', element: <NotFound /> } // Handle bad paths within StaffSection
      ]
    },
    {
      path: '/admin/*',
      element: <AdminSection />,
      children: [
        { path: '*', element: <NotFound /> } // Handle bad paths within AdminSection
      ]
    },
    { path: '*', element: <NotFound /> } // Catch-all for unmatched routes
  ];



  const onLogin = () => {
    const userToken = localStorage.getItem('customerJwtToken');
    setCurrentToken(userToken);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            hideSidebar,
            showNav,
            changeSidebar: onHideSidebar,
            changeRole: onLogout,
            changeLogin: onLogin,
          }}
        >
          <Header setShowNav={setShowNav} />
          <Routes>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
            <Route path="/user/*" element={<UserSection />} />
            <Route path="/staff/*" element={<StaffSection />} />
            <Route path="/admin/*" element={<AdminSection />} />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

function UserSection() {
  // const navigate = useNavigate();

  // const isRouteMatch = !!navigate()?.routes?.find(route => route.matched);

  return (
    <div className='d-flex'>
      {/* {isRouteMatch && <Sidebar />} */}
      <Sidebar />
      <Routes>
        <Route path="dashboard" element={<ProtectedRoute Component={UserDashboard} />} />
        <Route path="tax-interview" element={<ProtectedRoute Component={TaxInterview} />} />
        <Route path="upload-document" element={<ProtectedRoute Component={UploadDocument} />} />
        <Route path="comment-to-document" element={<ProtectedRoute Component={CommentDocument} />} />
        <Route path="tax-return-review" element={<ProtectedRoute Component={MySummary} />} />
        <Route path="make-payment/:id" element={<ProtectedRoute Component={MakePayment} />} />
        <Route path="my-payments" element={<ProtectedRoute Component={MyPaymentDetails} />} />
        <Route path="tax-return/success" element={<ProtectedRoute Component={SuccessPage} />} />
        <Route path="tax-return/failure" element={<ProtectedRoute Component={FailurePage} />} />
        <Route path= '*' element={<NotFound />} />
      </Routes>
    </div>
  );
}

function StaffSection() {
  return (
    <div className='d-flex'>
      <Sidebar/>
      <Routes>
        <Route path="dashboard" element={<ProtectedRoute Component={StaffDashboard} />} />
        <Route path="assigned-clients" element={<ProtectedRoute Component={AssignedClientList} />} />
        <Route path="tax-documents" element={<ProtectedRoute Component={ClientDocuments} />} />
        <Route path="customer-tax-return" element={<ProtectedRoute Component={TaxReturnDocument} />} />
      </Routes>
    </div>
  );
}

function AdminSection() {
  return (
    <div className='d-flex'>
    <Sidebar/>
      <Routes>
        <Route path="dashboard" element={<ProtectedRoute Component={AdminDashboard} />} />
        <Route path="clients" element={<ProtectedRoute Component={Clients} />} />
        <Route path="staff" element={<ProtectedRoute Component={Staff} />} />
        <Route path="client-tax-documents" element={<ProtectedRoute Component={ClientTaxDocuments} />} />
        <Route path="add-staff" element={<ProtectedRoute Component={AddStaff} />} />
        <Route path="add-customer" element={<ProtectedRoute Component={AddCustomer} />} />
        <Route path="excel-uploader" element={<ProtectedRoute Component={ExcelUploader} />} />
        <Route path="payments" element={<ProtectedRoute Component={PaymentDetails} />} />
        <Route path="user-contact/info" element={<ProtectedRoute Component={ContactView} />} />
      </Routes>
    </div>
  );
}

export default App;