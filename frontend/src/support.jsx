import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send } from 'lucide-react';
import './support.css';

function Support() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Check authentication and load chat history on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Load chat history
    const fetchChatHistory = async () => {
      try {
        const response = await fetch('/api/support/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    fetchChatHistory();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const userMessage = {
      content: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/support', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: currentMessage
        }),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.response) {
        const botMessage = {
          content: data.response,
          sender: 'bot',
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('No response received from server');
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        content: error.message === 'No response received from server' 
          ? "Sorry, no response was received from the support system. Please try again."
          : "Sorry, I'm having trouble connecting. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-focus input when component mounts
  useEffect(() => {
    const inputElement = document.querySelector('.message-input');
    if (inputElement) {
      inputElement.focus();
    }
  }, []);

  return (
    <div className="support-page">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: "#727D73" }}>
        <div className="container">
          <Link to="/home" className="navbar-brand d-flex align-items-center me-auto">
            <img
              src="/650c7525713f5d255e612a01_Best-places-to-buy-websites.jpg"
              alt="Buy&Sell Icon"
              className="navbar-icon"
            />
            Buy&Sell
          </Link>
          <div className="navbar-links">
            <Link to="/home" className="nav-link">Home</Link>
            <Link to="/search-items" className="nav-link">Search-Items</Link>
            <Link to="/order-history" className="nav-link">Order-History</Link>
            <Link to="/deliver-items" className="nav-link">Deliver-Items</Link>
            <Link to="/cart" className="nav-link">My Cart</Link>
            <Link to="/support" className="nav-link">Support</Link>
            <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="chat-container">
        <div className="chat-interface">
          <div className="chat-header">
            <h3>Customer Support</h3>
          </div>

          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-message">
                Send a message to start the conversation!
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
              >
                <div className="message-content">
                  {message.content}
                </div>
                <div className="message-timestamp">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot-message">
                <div className="message-content">
                  <span className="typing-indicator">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="message-input-form">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !inputMessage.trim()}
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Support;