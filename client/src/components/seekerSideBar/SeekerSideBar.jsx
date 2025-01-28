// SeekerSideBar.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sidenav, Nav } from 'rsuite';
import DashboardIcon from '@rsuite/icons/legacy/Dashboard';
import GroupIcon from '@rsuite/icons/legacy/Group';
import MagicIcon from '@rsuite/icons/legacy/Magic';
import GearCircleIcon from '@rsuite/icons/legacy/GearCircle';
import 'rsuite/dist/rsuite-no-reset.min.css';

function SeekerSideBar() {
  const [expanded, setExpanded] = React.useState(true);
  const [activeKey, setActiveKey] = React.useState('1');
  const navigate = useNavigate();
  const { seekerId } = useParams();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Get the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserId(user.userId);
    }
  }, []);

  // Verify if the current user has access to this seeker route
  const verifyAccess = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      navigate('/login');
      return false;
    }
    
    // Check if the user is a seeker and if they're accessing their own routes
    if (user.userType === 'seeker' && user.userId === userId) {
      return true;
    }
    
    // Redirect to home if unauthorized
    navigate('/');
    return false;
  };

  const handleSelect = (eventKey) => {
    if (!verifyAccess()) return;
    
    setActiveKey(eventKey);
    
    // Use userId instead of seekerId for routes
    const routes = {
      '1': `/seeker-profile/${userId}`,
      '2': `/seeker-home/${userId}`,
      '3': `/seeker-messages/${userId}`,
      '4': `/seeker-public-chat/${userId}`,
      '5': `/seeker-find-companys/${userId}`,
      '6': `/seeker-my-companys/${userId}`,
      '7': `/seeker-expenses/${userId}`,
      '8': `/seeker-notes/${userId}`,
      '9-1': `/seeker-help/find-companys/${userId}`,
      '9-2': `/seeker-help/start-chat/${userId}`,
      '9-3': `/seeker-help/payment-method/${userId}`,
      '9-4': `/seeker-help/registration/${userId}`,
      '10-1': `/seeker-settings/applications/${userId}`,
      '10-2': `/seeker-settings/payments/${userId}`,
    };

    if (routes[eventKey]) {
      navigate(routes[eventKey]);
    }
  };

  return (
    <div className="seeker-sidebar-main" style={{ width: 240 }}>
      <Sidenav
        className="seeker-sidebar-container"
        expanded={expanded}
        defaultOpenKeys={['3', '4']}
      >
        <Sidenav.Body className="seeker-sidebar-body">
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
              My Companys
            </Nav.Item>
            <Nav.Item eventKey="7" icon={<GroupIcon />}>
              My Expenses
            </Nav.Item>
            <Nav.Item eventKey="8" icon={<GroupIcon />}>
              Notes
            </Nav.Item>
            <hr />
            <Nav.Menu
              placement="rightStart"
              eventKey="9"
              title="Help"
              icon={<MagicIcon />}
            >
              <Nav.Item eventKey="9-1">How to Find Companys</Nav.Item>
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

export default SeekerSideBar;