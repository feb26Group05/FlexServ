import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import API from '../../api/adminApi'; // Axios instance with withCredentials
import '../../pages/User/UserProfile.css'; // Reuses your glassmorphism styles

const ChatWidget = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const rawUser = useSelector((state) => state.auth?.user);

  // Extract user object in case it's nested
  const currentUser = rawUser?.user ? rawUser.user : rawUser;

  // LoginResponse uses 'userId', UserResponse uses 'id'/'email'
  const activeUserId =
    currentUser?.userId ||
    currentUser?.id ||
    currentUser?.email ||
    currentUser?.username ||
    (currentUser?.name ? `name_${currentUser.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}` : null);

  const isGuest = !activeUserId;
  const storageKey = isGuest ? 'flexbot_chat_guest' : `flexbot_chat_user_${activeUserId}`;

  const getInitialGreeting = () => {
    const greetingName = currentUser?.name || currentUser?.username || currentUser?.firstName;
    return [
      {
        sender: 'bot',
        text: greetingName
          ? `Hi ${greetingName}! I am FlexBot. How can I help you find home services today?`
          : 'Hi! I am FlexBot. How can I help you find home services today?'
      }
    ];
  };

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    if (isGuest) return getInitialGreeting();
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return getInitialGreeting();
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const widgetRef = useRef(null);

  // Switch chat storage when user account changes or logs out
  useEffect(() => {
    if (isGuest) {
      setMessages(getInitialGreeting());
      try {
        sessionStorage.removeItem('flexbot_chat_guest');
      } catch (e) { }
    } else {
      try {
        const saved = sessionStorage.getItem(storageKey);
        if (saved) {
          setMessages(JSON.parse(saved));
        } else {
          setMessages(getInitialGreeting());
        }
      } catch (e) {
        setMessages(getInitialGreeting());
      }
    }
    setIsOpen(false);
  }, [activeUserId, storageKey, isGuest]);

  // Persist messages per logged-in user account
  useEffect(() => {
    if (!isGuest && messages && messages.length > 0) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(messages));
      } catch (e) { }
    }
  }, [messages, storageKey, isGuest]);

  // Collapse chat widget whenever user navigates to another page
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Collapse chat widget when user clicks outside the chat window
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, loading, isOpen]);

  // Helper function to render text with clickable recommendation links
  const renderFormattedMessage = (text) => {
    if (!text) return null;
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = markdownLinkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      const label = match[1];
      const targetUrl = match[2];

      parts.push(
        <a
          key={match.index}
          href={targetUrl}
          onClick={(e) => {
            e.preventDefault();
            setIsOpen(false);
            navigate(targetUrl);
          }}
          style={{
            color: '#ff9f43',
            fontWeight: 'bold',
            textDecoration: 'underline',
            cursor: 'pointer',
            display: 'inline-block',
            margin: '2px 0'
          }}
        >
          🔗 {label}
        </a>
      );
      lastIndex = markdownLinkRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  // Role and route visibility filtering
  const userRole = (currentUser?.role || rawUser?.role || '').toString().toUpperCase();
  const currentPath = location.pathname.toLowerCase();

  // Hide chatbot on login and registration pages
  if (currentPath === '/login' || currentPath === '/register') {
    return null;
  }

  // Hide chatbot for ADMIN or PROVIDER roles, or on admin/provider portal routes
  if (
    userRole === 'ADMIN' ||
    userRole === 'PROVIDER' ||
    currentPath.startsWith('/admin') ||
    currentPath.startsWith('/provider')
  ) {
    return null;
  }

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chat/recommend', { message: userMsg });
      if (res.data && res.data.success && res.data.data) {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.data.reply || 'No recommendation received.' }]);
      } else {
        setMessages((prev) => [...prev, { sender: 'bot', text: res.data.message || 'Unable to retrieve recommendation.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={widgetRef} style={{ position: 'fixed', bottom: '25px', right: '25px', zIndex: 3000 }}>
      {!isOpen ? (
        <button className="home-btn-orange" onClick={() => setIsOpen(true)}>
          💬 AI Assistant
        </button>
      ) : (
        <div className="home-modal-box" style={{ width: '360px', height: '480px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div className="home-modal-header" style={{ paddingBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, color: 'white' }}>FlexBot Recommendations</h4>
            <button className="home-modal-close" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', margin: '10px 0', paddingRight: '4px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? '#ff6b00' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  padding: '8px 14px',
                  borderRadius: '12px',
                  maxWidth: '85%',
                  fontSize: '13px',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.4'
                }}
              >
                {renderFormattedMessage(m.text)}
              </div>
            ))}
            {loading && <div style={{ fontSize: '12px', color: '#aaa', fontStyle: 'italic' }}>FlexBot is thinking...</div>}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={sendMessage} style={{ display: 'flex', gap: '8px' }}>
            <input
              className="home-input-field"
              style={{ flex: 1, padding: '8px 12px' }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about repairs, cleaning..."
              disabled={loading}
            />
            <button type="submit" className="home-btn-orange" style={{ padding: '8px 16px', opacity: loading ? 0.6 : 1 }} disabled={loading}>
              {loading ? '...' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;