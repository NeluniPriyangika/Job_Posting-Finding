import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import HomePage from './pages/homePage/HomePage';
import LoginPage from './pages/loginPage/LoginPage';
import LoginPage1 from './pages/loginPage1/LoginPage1';
import LoginFBPage from './pages/LoginFBPage/LoginFBPage';
import SeekerHomePage from './pages/seekerHomePage/SeekerHomePage';

import CompanyUpdateProfilePage from './pages/companyUpdateProfilePage/CompanyUpdateProfilePage';
import SeekerUpdateProfilePage from './pages/seekerUpdateProfilePage/SeekerUpdateProfilePage';
import CompanyProfilePage from './pages/companyProfilePage/CompanyProfilePage';
import SeekerProfilePage from './pages/seekerProfilePage/SeekerProfilePage';
import SeekerMiddleChatPage from './pages/seekerMiddleChatPage/SeekerMiddleChatPage';
import SeekerChatPage from './pages/SeekerChatPage/SeekerChatPage';
import CompanyPendingPage from './pages/companyPendingPage/CompanyPendingPage';
import CompanyChatPage from './pages/companyChatPage/CompanyChatPage';
import CompanyPublicChatPage from './pages/companyPublicChatPage/CompanyPublicChatPage';
import PaymentPage from './pages/paymentPage/PaymentPage';
import PrivacyPolicyPage from './pages/privacyPolicyPage/PrivacyPolicyPage';
import CompanysPage from './pages/companyPage/CompanyPage';
import SeekersPage from './pages/seekersPage/SeekersPage';


// PrivateRoute component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage1 />} />
          <Route path="/login-page" element={<LoginPage />} />
          <Route path="/login-FBpage" element={<LoginFBPage />} />
          <Route path="/company-update-profile/:userId" element={<PrivateRoute><CompanyUpdateProfilePage /></PrivateRoute>} />
          <Route path="/seeker-update-profile/:userId" element={<PrivateRoute><SeekerUpdateProfilePage /></PrivateRoute>} />
          <Route path="/seeker-home" element={<PrivateRoute><SeekerHomePage /></PrivateRoute> } />
          <Route path="/company-profile/:userId" element={<PrivateRoute><CompanyProfilePage /></PrivateRoute>} />
          <Route path="/seeker-profile/:userId" element={<PrivateRoute><SeekerProfilePage /></PrivateRoute> } />
          <Route path="/seeker-middle-chat" element={<PrivateRoute><SeekerMiddleChatPage /></PrivateRoute> } />
          <Route path="/seeker-chat" element={<PrivateRoute><SeekerChatPage /></PrivateRoute> } />
          <Route path="/company-pending" element={<PrivateRoute>< CompanyPendingPage/></PrivateRoute> } />
          <Route path="/company-chat" element={<PrivateRoute>< CompanyChatPage/></PrivateRoute> } />
          <Route path="/company-public-chat" element={<PrivateRoute>< CompanyPublicChatPage/></PrivateRoute> } />
          <Route path="/payment" element={<PrivateRoute>< PaymentPage/></PrivateRoute> } />
          <Route path="/privacy-policy" element={<PrivateRoute>< PrivacyPolicyPage/></PrivateRoute> } />
          <Route path="/companys" element={<PrivateRoute>< CompanysPage/></PrivateRoute> } />

          
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;