import React, { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import './comanyPublicChat.css';
import Navbar2 from '../navbar2/Navbar2'
import CompanySideBar from '../comanySideBar/ComanySideBar';
import Footer from '../footer/Footer';
import JobSeeker1 from '../../assets/jobseeker1.png';
import io from 'socket.io-client';
import { MessageBox } from 'react-chat-elements';
import 'react-chat-elements/dist/main.css';

const CompanyPublicChatHistory = ({ imgUrl, title, message1, message2 }) => (
  <div className="chat-history">
    <img src={imgUrl} alt={title} className="chat-history-img" />
    <div className="chat-history-text">
      <h6>{title}</h6>
      <p className="chat-history-desc">{message1}</p>
      <p className="chat-history-desc">{message2}</p>
    </div>
  </div>
);

const CompanyPublicChatHistoryContainer = ({ reviews }) => (
  <div className="chat-history-container">
    {reviews.map((review) => (
      <CompanyPublicChatHistory
        key={review.id}
        title={review.title}
        imgUrl={review.imgUrl}
        message1={review.message1}
        message2={review.message2}
      />
    ))}
  </div>
);

const socket = io('http://localhost:5000');

function CompanyPublicChat() {
  const [messages, setMessages] = useState([
    { position: 'left', type: 'text', text: 'Hi, Hello Kasuni.', date: new Date(), isCompany: false },
    { position: 'right', type: 'text', text: 'Hello! How can I help you today?', date: new Date(), isCompany: true },
    { position: 'left', type: 'text', text: 'I need some advice regarding my career.', date: new Date(), isCompany: false },
  ]);

  const [messageInput, setMessageInput] = useState('');
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [replyMessage, setReplyMessage] = useState(null);

  const initialTime = new Date();
  initialTime.setSeconds(initialTime.getSeconds());

  const { seconds, minutes, hours, restart, pause } = useTimer({
    expiryTimestamp: initialTime,
    onExpire: () => console.warn("Timer expired"),
    autoStart: false,
  });

  const handleTimerToggle = () => {
    if (isTimerActive) {
      pause();
    } else {
      const newTime = new Date();
      newTime.setSeconds(newTime.getSeconds() + 3600);
      restart(newTime);
    }
    setIsTimerActive(!isTimerActive);
  };

  useEffect(() => {
    socket.on('message', (msg) => setMessages((prevMessages) => [...prevMessages, msg]));
    return () => socket.off('message');
  }, []);

  const sendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        position: 'right',
        type: 'text',
        text: messageInput,
        date: new Date(),
        isCompany: true,
        replyTo: replyMessage ? replyMessage.text : null,
      };
      socket.emit('message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput('');
      setReplyMessage(null);
    }
  };

  const handleReply = (message) => {
    setReplyMessage(message);
  };

  const CompanyPublicChatsHis = [
    { id: 1, title: 'Serenity Stone', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/200' },
    { id: 2, title: 'Michel Jackson', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/201/200' },
    { id: 3, title: 'Serenity Stone', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/201' },
    { id: 4, title: 'Leo Doe', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/199' },
    { id: 5, title: 'Jony Dep', message1: "Hello, I'm Shanaya", message2: 'How can I help you?', imgUrl: 'https://unsplash.it/200/198' },
  ];

  return (
    <div className="CompanyPublicChat-main">
      <Navbar2 />
      <div className="CompanyPublicChat-container">
        <CompanySideBar />
        <div className="chat-middle-container">
          <h3>Public Chat</h3>
          <div className="chat-window">
            {messages.map((message, index) => (
              <div key={index} className={`chat-message ${message.isCompany ? 'company-message' : 'jobSeeker-message'}`}>
                {message.isCompany && (
                  <div className="company-info">
                    <img src={JobSeeker1} alt="Company" className="company-pic" />
                    <span className="company-name">Company</span>
                  </div>
                )}
                <MessageBox
                  position={message.position}
                  type={message.type}
                  text={message.text}
                  date={message.date}
                  replyButton
                  onReplyClick={() => handleReply(message)}
                />
                {message.replyTo && <div className="reply-to">Replying to: {message.replyTo}</div>}
              </div>
            ))}
          </div>
          <div className="chat-input">
            {replyMessage && (
              <div className="reply-preview">
                Replying to: {replyMessage.text}
                <button onClick={() => setReplyMessage(null)}>Cancel</button>
              </div>
            )}
            <input
              type="text"
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
        <div className="chat-history-section">
          <h3>Chat History</h3>
          <CompanyPublicChatHistoryContainer reviews={CompanyPublicChatsHis} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CompanyPublicChat;
