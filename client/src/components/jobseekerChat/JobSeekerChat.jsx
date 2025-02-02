import React, { useEffect, useState, useCallback } from 'react';
import { useTimer } from 'react-timer-hook';
import './jobseekerChat.css';
import Navbar2 from '../navbar2/Navbar2';
import JobSeekerSideBar from '../jobseekerSideBar/JobSeekerSideBar';
import Footer from '../footer/Footer';
import Company2 from '../../assets/Company2.jpg';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:5000';
const API_URL = 'http://localhost:5000/api/chat';

// Custom hook for chat session management
const useChatSession = (userId, companyId) => {
  const [session, setSession] = useState(null);
  const [error, setError] = useState(null);

  const initializeSession = useCallback(async () => {
    try {
      const response = await axios.post(`${API_URL}/session/initialize`, {
        jobSeekerId: userId,
        companyId
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
  }, [userId, companyId]);

  return { session, error, initializeSession };
};

// Custom hook for chat messages
const useChatMessages = (userId, socket) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const sendMessage = async (sessionId, text) => {
    try {
      const response = await axios.post(`${API_URL}/message/${userId}`, {
        sessionId,
        text,
        position: 'left'
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

      socket.on('sessionEnded', ({ sessionId, duration }) => {
        console.log(`Session ended. Duration: ${duration} seconds`);
      });
    }
  }, [socket]);

  return { messages, setMessages, sendMessage, error };
};

function JobSeekerChat() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = React.useRef();

  // Timer setup
  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds() + 3600);
  
  const { seconds, minutes, hours } = useTimer({
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

  // Get current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userId = sessionStorage.getItem('userId');
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/users/${userId}`);
        setCurrentUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  // Initialize chat session
  const companyId = sessionStorage.getItem('currentCompanyId');
  const { session, error: sessionError, initializeSession } = 
    useChatSession(currentUser?.userId, companyId);

  // Handle messages
  const { messages, setMessages, sendMessage, error: messageError } = 
    useChatMessages(currentUser?.userId, socket);

  // Load chat history
  const loadChatHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/history/${currentUser?.userId}`);
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

  const handleTyping = () => {
    if (socket && session?._id) {
      socket.emit('typing', {
        sessionId: session._id,
        user: { id: currentUser?.userId, name: currentUser?.name }
      });

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', {
          sessionId: session._id,
          user: { id: currentUser?.userId, name: currentUser?.name }
        });
      }, 1000);
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !session?._id) return;

    const message = await sendMessage(session._id, messageInput);
    if (message) {
      setMessageInput('');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentUser || currentUser.userType !== 'jobSeeker') {
    return <div>Access denied. Only jobSeekers can access this page.</div>;
  }

  return (
    <div className="JobSeekerChat-main">
      <Navbar2 />
      <div className="JobSeekerChat-container">
        <div className="JobSeekerChat--sidebar">
          <JobSeekerSideBar />
        </div>
        <hr />
        <div className="JobSeekerChat-Middlecontainer">
          <div className="JobSeekerChat-Middlecontainer-top">
            <div className="JobSeekerChat-Middlecontainer-top1">
              <img 
                className="JobSeekerChat-Middlecontainer-proPick" 
                src={currentCompany?.profilePhotoUrl || Company2} 
                alt="Company" 
              />
              <h2>{currentCompany?.name || 'Select an Company'}</h2>
              <div className="JobSeekerChat-Status">
                {session ? 'Active' : 'Inactive'}
              </div>
            </div>
            <div className="JobSeekerChat-Middlecontainer-top2">
              <div className="JobSeeker-timer">
                {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
              </div>
            </div>
          </div>
          <hr />
          <div className="JobSeekerChat-Middlecontainer-bottom">
            <div className="JobSeekerChat-chatwindow">
              {messages.map((message, index) => (
                <MessageBox
                  key={index}
                  position={message.position}
                  type={message.type}
                  text={message.text}
                  date={new Date(message.timestamp)}
                />
              ))}
              {isTyping && <div className="typing-indicator">Company is typing...</div>}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleTyping}
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
        <div className="JobSeekerChat-RightContainer">
          <h3>Chat History</h3>
          <div className="JobSeekerChat-chat-history-content">
            {chatHistory.map((session, index) => (
              <div key={index} className="JobSeekerChat-chat-history">
                <div className="JobSeekerChat-chat-history-content1">
                  <img 
                    src={session.company.profilePhotoUrl || Company2} 
                    alt={session.company.name} 
                  />
                </div>
                <div className="JobSeekerChat-chat-history-content2">
                  <h6>{session.company.name}</h6>
                  <p className="JobSeekerChat-chat-history-desc">
                    Status: {session.status}
                  </p>
                  <p className="JobSeekerChat-chat-history-desc">
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

export default JobSeekerChat;