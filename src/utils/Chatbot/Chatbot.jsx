import React, { useState, useRef, useEffect } from 'react';
import styles from './Chatbot.module.scss';
import { requestChatbot } from '../../config/request';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("chatHistory");
        if (saved) {
            const parsed = JSON.parse(saved);
            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000; 

            if (now - parsed.savedAt < oneDay) {
                return parsed.messages;
            } else {
                localStorage.removeItem("chatHistory"); 
            }
        }
        return [{ text: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?', sender: 'bot' }];
    });

    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    
    useEffect(() => {
        localStorage.setItem("chatHistory", JSON.stringify({
            messages,
            savedAt: Date.now()
        }));
    }, [messages]);

    useEffect(() => {
    const interval = setInterval(() => {
        const saved = localStorage.getItem("chatHistory");
        if (saved) {
            const parsed = JSON.parse(saved);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (now - parsed.savedAt >= twentyFourHours) {
                localStorage.removeItem("chatHistory");
                setMessages([{ text: 'Xin chào! Tôi là trợ lý ảo. Tôi có thể giúp gì cho bạn?', sender: 'bot' }]);
            }
        }
    }, 5000);

    return () => clearInterval(interval);
}, []);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputMessage.trim() && !isLoading) {
            const userMessage = inputMessage.trim();
            setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
            setInputMessage('');
            setIsLoading(true);

            try {
                const response = await requestChatbot({ question: userMessage });
                setMessages((prev) => [...prev, { text: response, sender: 'bot' }]);
            } catch (error) {
                setMessages((prev) => [
                    ...prev,
                    {
                        text: 'Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau.',
                        sender: 'bot',
                    },
                ]);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>
            <button className={styles.chatButton} onClick={() => setIsOpen(true)} aria-label="Mở chat">
                Chatbot
            </button>

            {isOpen && (
                <div className={styles.chatbotContainer}>
                    <div className={styles.chatHeader}>
                        <h2>Chatbot</h2>
                        <button className={styles.closeButton} onClick={() => setIsOpen(false)} aria-label="Đóng chat">
                            <FontAwesomeIcon icon={faTimes} />
                        </button>
                    </div>
                    <div className={styles.messageList}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${
                                    message.sender === 'user' ? styles.userMessage : styles.botMessage
                                }`}
                            >
                                <div className={styles.messageContent}>
                                    <ReactMarkdown>{message.text}</ReactMarkdown>
                                </div>

                            </div>
                        ))}
                        {isLoading && (
                            <div className={`${styles.message} ${styles.botMessage}`}>
                                <div className={styles.messageContent}>
                                    <span className={styles.typingIndicator}>Đang nhập...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    <form onSubmit={handleSubmit} className={styles.inputForm}>
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhập tin nhắn của bạn..."
                            className={styles.input}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={isLoading}>
                            Gửi
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
