import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import 'rsuite/dist/rsuite-no-reset.min.css';

function CompanySideBar() {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  const navigate = useNavigate();
  const { companyId } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  // Verify if the current user has access to this company route
  const verifyAccess = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return false;
    }
    
    // Check if the user is an company and if they're accessing their own routes
    if (user.userType === 'company' && user.userId === userId) {
      return true;
    }
    
    // Redirect to home if unauthorized
    navigate('/');
    return false;
  };

  const handleSelect = (eventKey) => {
    if (!verifyAccess()) return;
    
    setActiveKey(eventKey);
    
    const routes = {
      '1': `/company-profile/${userId}`,
      '2': `/`, // Changed to match App.js
      '3': `/company-chat`, // Changed to match App.js
      '4': `/company-public-chat`, // Changed to match App.js
      '5': `/companys`, // Changed to match App.js
      '6': `/company-pending`, // Added a route for My Seekers
      '7': `/payment`, // Changed to match App.js for earnings
      '8': `/payment`, // Changed to get paid route
      '9-1': `/companys`, // Help section for finding seekers
      '9-2': `/company-chat`, // Help for starting chat
      '9-3': `/payment`, // Payment method help
      '9-4': `/company-update-profile/${userId}`, // Registration/profile update help
      '10-1': `/company-update-profile/${userId}`, // Settings for applications
      '10-2': `/payment`, // Settings for payments
    };

    if (routes[eventKey]) {
      navigate(routes[eventKey]);
    }
  };

  return (
    <div className="company-sidebar-main" style={{ width: 240 }}>
      <Sidenav
        className="company-sidebar-container"
        expanded={expanded}
        defaultOpenKeys={['3', '4']}
      >
        <Sidenav.Body className="company-sidebar-body">
          <Nav activeKey={activeKey} onSelect={handleSelect}>
            <Nav.Item eventKey="1" icon={<DashboardIcon />}>
              My Profile
            </Nav.Item>
            <Nav.Item eventKey="2" icon={<GroupIcon />}>
              Home
            </Nav.Item>
            <Nav.Item eventKey="3" icon={<GroupIcon />}>
              Message
            </Nav.Item>
            <Nav.Item eventKey="4" icon={<GroupIcon />}>
              Public Chat
            </Nav.Item>
            <hr />
            <Nav.Item eventKey="5" icon={<GroupIcon />}>
              Find Companys
            </Nav.Item>
            <Nav.Item eventKey="6" icon={<GroupIcon />}>
              My Seekers
            </Nav.Item>
            <Nav.Item eventKey="7" icon={<GroupIcon />}>
              My Earnings
            </Nav.Item>
            <Nav.Item eventKey="8" icon={<GroupIcon />}>
              Get Paid
            </Nav.Item>
            <hr />
            <Nav.Menu
              placement="rightStart"
              eventKey="9"
              title="Help"
              icon={<MagicIcon />}
            >
              <Nav.Item eventKey="9-1">Find Companys</Nav.Item>
              <Nav.Item eventKey="9-2">How to start Chat</Nav.Item>
              <Nav.Item eventKey="9-3">Payment Method</Nav.Item>
              <Nav.Item eventKey="9-4">How to Register</Nav.Item>
            </Nav.Menu>
            <Nav.Menu
              placement="rightStart"
              eventKey="10"
              title="Settings"
              icon={<GearCircleIcon />}
            >
              <Nav.Item eventKey="10-1">Applications</Nav.Item>
              <Nav.Item eventKey="10-2">Payments</Nav.Item>
            </Nav.Menu>
          </Nav>
        </Sidenav.Body>
      </Sidenav>
    </div>
  );
}

export default CompanySideBar;