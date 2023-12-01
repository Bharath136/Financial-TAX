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

// const routes = [
//   { path: '/', element: <Landingpage /> },
//   { path: '/login', element: <Login /> },
//   { path: '/signup', element: <Register /> },
//   { path: '/about', element: <About /> },
//   { path: '/services', element: <Services /> },
//   { path: '/contact', element: <Contact /> },
// ];

// const userRoutes = [
//   { path: '/user-dashboard', component: Profile },
//   { path: '/tax-interview', component: TaxInterview },
//   { path: '/upload-document', component: UploadDocument },
//   { path: '/my-summary', component: MySummary },
//   { path: '/make-payment', component: MakePayment },
//   { path: '/my-tax-documents', component: MyTaxDocuments },
// ];

function App() {
  const [currentToken, setCurrentToken] = useState('');
  const [hideSidebar, setHideSidebar] = useState(false);
  const [showNav,setShowNav] = useState(true)

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
    setShowNav(true)
    showAlert(popup);
    localStorage.clear();
    setCurrentToken('');
  };


  const onHideSidebar = () => {
    setHideSidebar(!hideSidebar)
  }


  const routes = [
    // Landing components 
    { path: '/', element: <Landingpage /> },
    { path: '/login', element: <Login setShowNav={setShowNav} /> },
    { path: '/signup', element: <Register /> },
    { path: '/about', element: <About /> },
    { path: '/services', element: <Services /> },
    { path: '/contact', element: <Contact /> },

    // Register user components
    { path: '/user-dashboard', element: <ProtectedRoute Component={UserDashboard} /> },
    { path: '/tax-interview', element: <ProtectedRoute Component={TaxInterview} /> },
    { path: '/upload-document', element: <ProtectedRoute Component={UploadDocument} /> },
    { path: '/comment-to-document', element: <ProtectedRoute Component={CommentDocument} /> },
    { path: '/tax-return-review', element: <ProtectedRoute Component={MySummary} /> },
    { path: '/make-payment', element: <ProtectedRoute Component={MakePayment} /> },


    //Staff components
    { path: '/staff-dashboard', element: <ProtectedRoute Component={StaffDashboard} /> },
    { path: '/staff-assigned-clients', element: <ProtectedRoute Component={AssignedClientList} /> },
    { path: '/staff-tax-documents', element: <ProtectedRoute Component={ClientDocuments} /> },
    { path: '/staff-customer-tax-return', element: <ProtectedRoute Component={TaxReturnDocument}/>},

     //admin components
    { path: '/admin-dashboard', element: <ProtectedRoute Component={AdminDashboard} /> },
    { path: '/admin-clients', element: <ProtectedRoute Component={Clients} /> },
    { path: '/admin-staff', element: <ProtectedRoute Component={Staff} /> },
    { path: '/admin-client-tax-documents', element: <ProtectedRoute Component={ClientTaxDocuments} /> },
    { path: '/admin-add-staff', element: <ProtectedRoute Component={AddStaff} /> },

    // Not Found router
    { path: "*", element: <NotFound /> }
  ];

  const onLogin = () => {
    // Trigger re-render by updating the userToken state
    const userToken = localStorage.getItem('customerJwtToken');
    const adminToken = localStorage.getItem('adminJwtToken');
    const staffToken = localStorage.getItem('staffJwtToken');

    let currentToken = null;

    // Choose the appropriate token based on your logic
    if (userToken) {
      currentToken = userToken;
    } else if (adminToken) {
      currentToken = adminToken;
    } else if (staffToken) {
      currentToken = staffToken;
    }

    setCurrentToken(currentToken);
  };


  return (
    <div className="App">
      <BrowserRouter>
        <AuthContext.Provider value={{
          hideSidebar,
          showNav,
          changeSidebar: onHideSidebar,
          changeRole: onLogout,
          changeLogin: onLogin,
        }}>
          <Header setShowNav={setShowNav} />
          <Routes>
            {routes.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    </div>
  );
}

export default App;
