import React, { useState, useEffect, useRef } from 'react';
import { MessageBox } from 'react-chat-elements';
import io from 'socket.io-client';

const Chat = ({ userType, currentUser, currentContact, sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef();
  const typingTimeoutRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    if (sessionId) {
      socketRef.current.emit('join', sessionId);
    }

    socketRef.current.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('typing', (user) => {
      setIsTyping(user.id !== currentUser.userId);
    });

    socketRef.current.on('sessionEnded', ({ sessionId, duration }) => {
      // Handle session end
    });

    return () => socketRef.current.disconnect();
  }, [sessionId]);

  const handleTyping = () => {
    socketRef.current.emit('typing', {
      sessionId,
      user: { id: currentUser.userId, name: currentUser.name }
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('stopTyping', {
        sessionId,
        user: { id: currentUser.userId, name: currentUser.name }
      });
    }, 1000);
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const response = await fetch(`/api/chat/message/${currentUser.userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          text: messageInput,
          position: 'right'
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setMessageInput('');
    } catch (error) {
      setError('Failed to send message');
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <MessageBox
            key={index}
            position={message.position}
            type={message.type}
            text={message.text}
            date={new Date(message.timestamp)}
          />
        ))}
        {isTyping && <div className="typing-indicator">Typing...</div>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Chat;