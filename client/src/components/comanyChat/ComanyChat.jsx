import React, { useEffect, useState, useCallback } from 'react';
import { useTimer } from 'react-timer-hook';
import './comanyChat.css';
import Navbar2 from '../navbar2/Navbar2';
import CompanySideBar from '../comanySideBar/ComanySideBar';
import Footer from '../footer/Footer';
import JobSeeker1 from '../../assets/jobseeker1.png';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api';

// Custom hook for chat session management
const useChatSession = (userId, jobSeekerId) => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  const initializeSession = useCallback(async () => {
    try {
      const response = await axios.post(`${API_URL}/chat/session/initialize`, {
        companyId: userId,
        jobSeekerId
      });
      setSession(response.data);
      return response.data;
    } catch (error) {
      if (error.response?.data?.error === 'Active session exists') {
        setSession({ _id: error.response.data.sessionId });
      } else {
        setError('Failed to initialize chat session');
      }
    }
  }, [userId, jobSeekerId]);

  const endSession = useCallback(async (sessionId) => {
    try {
      const response = await axios.put(`${API_URL}/chat/session/${sessionId}/end`);
      setSession(null);
      return response.data;
    } catch (error) {
      setError('Failed to end session');
    }
  }, []);

  return { session, error, initializeSession, endSession };
};

// Custom hook for chat messages
const useChatMessages = (userId, socket) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const sendMessage = async (sessionId, text) => {
    try {
      const response = await axios.post(`${API_URL}/chat/message/${userId}`, {
        sessionId,
        text,
        position: 'right'
      });
      return response.data;
    } catch (error) {
      setError('Failed to send message');
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('message', (newMessage) => {
        setMessages(prev => [...prev, newMessage]);
      });
    }
  }, [socket]);

  return { messages, setMessages, sendMessage, error };
};

function CompanyChat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);

  // Timer setup
  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds() + 3600); // 1 hour timer
  
  const { seconds, minutes, hours, restart, pause } = useTimer({
    expiryTimestamp: initialTime,
    onExpire: () => console.warn("Timer expired"),
    autoStart: false,
  });

  // Initialize socket
  useEffect(() => {
    const socketInstance = io(SOCKET_URL);
    setSocket(socketInstance);
    return () => socketInstance.disconnect();
  }, []);

  // Get current user from session storage
  useEffect(() => {
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        if (response.data.userType === 'company') {
          setCurrentUser(response.data);
        } else {
          // Redirect to home or show an error message
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Initialize chat session
  const jobSeekerId = sessionStorage.getItem('currentJobSeekerId');
  const { session, error: sessionError, initializeSession, endSession } = 
    useChatSession(currentUser?.userId, jobSeekerId);

  // Handle messages
  const { messages, setMessages, sendMessage, error: messageError } = 
    useChatMessages(currentUser?.userId, socket);

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/history/${currentUser?.userId}`);
      setChatHistory(response.data);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  useEffect(() => {
    if (currentUser?.userId) {
      loadChatHistory();
    }
  }, [currentUser]);

  // Join chat session
  useEffect(() => {
    if (session?._id && socket) {
      socket.emit('join', session._id);
    }
  }, [session, socket]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !session?._id) return;

    const message = await sendMessage(session._id, messageInput);
    if (message) {
      setMessageInput('');
    }
  };

  const handleTimerToggle = async () => {
    if (!session?._id) {
      await initializeSession();
      const newTime = new Date();
      newTime.setSeconds(newTime.getSeconds() + 3600);
      restart(newTime);
    } else {
      await endSession(session._id);
      pause();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || currentUser.userType !== 'company') {
    return <div>Access denied. Only companys can access this page.</div>;
  }

  return (
    <div className="CompanyChat-main">
      <Navbar2 />
      <div className="CompanyChat-container">
        <div className="CompanyChat--sidebar">
          <CompanySideBar />
        </div>
        <hr />
        <div className="CompanyChat-Middlecontainer">
          <div className="CompanyChat-Middlecontainer-top">
            <div className="CompanyChat-Middlecontainer-top1">
              <img 
                className="CompanyChat-Middlecontainer-proPick" 
                src={currentUser.profilePhotoUrl || JobSeeker1} 
                alt="Company" 
              />
              <h2>{currentUser.name}</h2>
              <div className="CompanyChat-Status">
                {session ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="CompanyChat-Middlecontainer-top2">
              <div className="Company-timer">
                {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
              </div>
              <button 
                className="Company-timer-controller" 
                onClick={handleTimerToggle}
              >
                {session ? "End Session" : "Start Session"}
              </button>
            </div>
          </div>
          <hr />
          <div className="CompanyChat-Middlecontainer-bottom">
            <div className="CompanyChat-chatwindow">
              {messages.map((message, index) => (
                <MessageBox
                  key={index}
                  position={message.position}
                  type={message.type}
                  text={message.text}
                  date={new Date(message.timestamp)}
                />
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!session}
              />
              <button 
                onClick={handleSendMessage}
                disabled={!session || !messageInput.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
        <hr />
        <div className="CompanyChat-RightContainer">
          <h3>Chat History</h3>
          <div className="CompanyChat-chat-history-content">
            {chatHistory.map((session, index) => (
              <div key={index} className="CompanyChat-chat-history">
                <div className="CompanyChat-chat-history-content1">
                  <img 
                    src={session.jobSeeker.profilePhotoUrl || JobSeeker1} 
                    alt={session.jobSeeker.name} 
                  />
                </div>
                <div className="CompanyChat-chat-history-content2">
                  <h6>{session.jobSeeker.name}</h6>
                  <p className="CompanyChat-chat-history-desc">
                    Status: {session.status}
                  </p>
                  <p className="CompanyChat-chat-history-desc">
                    Duration: {session.duration ? `${Math.floor(session.duration / 60)} minutes` : 'Ongoing'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CompanyChat;