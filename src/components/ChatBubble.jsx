import React, { useState, useEffect , useRef} from 'react';
import { ChatCircleDots } from "phosphor-react";
import Koksuś from '../assets/products/Koksuś.png';
import { useTranslation } from "react-i18next";


import './ChatBubble.css';

const ChatBubble = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { t, i18n } = useTranslation("global");
  const [messages, setMessages] = useState([
    { text: t("chat.hi"), sender: "bot" }
  ]);

  useEffect(() => {
    // Funkcja resetująca wiadomości i dodająca wiadomość powitalną
    const resetMessages = () => {
      setMessages([{ text: t("chat.hi"), sender: "bot" }]);
    };

    // Dodaj nasłuchiwacz zmiany języka
    const languageChangeHandler = () => {
      resetMessages();
    };

    i18n.on('languageChanged', languageChangeHandler);

    // Usuń nasłuchiwacz przy demontowaniu komponentu
    return () => {
      i18n.off('languageChanged', languageChangeHandler);
    };
  }, [i18n, t]);

  const toggleChatWindow = () => {
    setIsOpen(!isOpen);
  };

  const quickReplies = [
    
    { label: t("chat.payment_refunds"), message: t("chat.payment_refunds_message") },
    { label: t("chat.payment_complaints"), message: t("chat.payment_complaints_message") },
    { label: t("chat.payment"), message: t("chat.payment_message") },
    { label: t("chat.gift_voucher_teachers"), message: t("chat.gift_voucher_teachers_message") },
    
  ];
  const getBotResponse = (userMessage) => {
    let responseKey = 'bot.defaultResponse'; // Default response key

    let lowerCaseMessage = userMessage.toLowerCase();

    // Iterating over bot response keys in the current language
    Object.keys(t('bot', { returnObjects: true })).forEach(key => {
        if (lowerCaseMessage.includes(key.toLowerCase())) {
            responseKey = `bot.${key}`;
        }
    });

    return t(responseKey); // Fetching the response in the current language
};
    
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // useEffect to scroll down every time messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleQuickReplyClick = (replyMessage) => {
    if (typeof replyMessage === 'string') {
      handleSendMessage(replyMessage);
    }
  };
  
  const handleSendMessage = (msg = message) => {
    // Ensure that msg is a string
    const messageString = typeof msg === 'string' ? msg : '';
    
    if (messageString) {
      const botResponse = getBotResponse(messageString);
      setMessages([...messages, { text: messageString, sender: "user" }, { text: botResponse, sender: "bot" }]);
      setMessage('');
    }
  };
  return (
    <div className="chat-bubble-container">
      <div className={`chat-bubble-icon ${isOpen ? 'open' : ''}`} onClick={toggleChatWindow}>
        <ChatCircleDots className="chat-icon" color="white" size={32} />
      </div>
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">Czat z Botem Koksuś</div>
          <div className="messages">
          {messages.map((msg, index) => (
  <div key={index} className={`message ${msg.sender === "user" ? "user-message" : ""}`}>
          {msg.sender === "bot" && (
            <div className="message-content">
              <img src={Koksuś} alt="Koksuś" className="bot-icon" />
              <p>{msg.text}</p>
            </div>
          )}
          {msg.sender === "user" && <p>{msg.text}</p>}
          <div ref={messagesEndRef} />
        </div>
      ))}
            
          </div>
          <div className="message-input">
            <input 
              type="text" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Wpisz wiadomość..." 
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
         <button onClick={() => handleSendMessage(message)}>Wyślij</button>

          </div>
          <div className="quick-reply-container">
            {quickReplies.map((reply, index) => (
              <div 
                key={index} 
                onClick={() => handleQuickReplyClick(reply.message)}
                className="quick-reply-bubble"
              >
                {reply.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
