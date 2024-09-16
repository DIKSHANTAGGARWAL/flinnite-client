import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import io from 'socket.io-client';
import '../css/chatRoom.css'
const socket = io(`${process.env.REACT_APP_server_url}`);

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [members, setMembers] = useState([]);
    const { id: groupId } = useParams();
    const [groupName, setGroupName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [showMembers, setShowMembers] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();
    const params=useParams()
    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (!email) {
            navigate('/login');
        } else {
            setUserEmail(email);
        }

        socket.emit('joinGroup', groupId);

        socket.on('chatHistory', (history) => {
            setMessages(history);
            scrollToBottom();
        });

        socket.emit('getGroupDetails', groupId);
        socket.on('groupDetails', ({ name, members }) => {
            setGroupName(name);
            setMembers(members);
        });

        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
            scrollToBottom();
        });

        return () => {
            socket.off('chatHistory');
            socket.off('newMessage');
            socket.off('groupDetails');
        };
    }, [groupId, navigate]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('sendMessage', { groupId, userEmail, content: newMessage });
            setNewMessage('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const toggleMembers = () => {
        setShowMembers(!showMembers);
    };

    const toVc=()=>{
        navigate(`/group/vc/${params.id}`)
    }

    return (
        <div className="chat-room">
            <div className="chat-header">
                <h2>{groupName}</h2>
                <button className="members-btn" onClick={toVc}>VideoCall</button>

                <button className="members-btn" onClick={toggleMembers}>Show Members</button>
            </div>

            <div className="messages-container">
                {messages.map((msg, index) => {
                    const showDate = index === 0 || formatDate(messages[index - 1].timestamp) !== formatDate(msg.timestamp);
                    return (
                        <React.Fragment key={index}>
                            {showDate && <div className="date-separator">{formatDate(msg.timestamp)}</div>}
                            <div className={`message ${msg.sender === userEmail ? 'self' : 'other'}`}>
                                <strong>{msg.sender === userEmail ? 'You' : msg.sender}:</strong> {msg.content}
                                <div className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                            </div>
                        </React.Fragment>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="input-container">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                />
                <button className="send-btn" onClick={sendMessage}>Send</button>
            </div>

            {showMembers && (
                <div className="members-popup">
                    <div className="popup-content">
                        <h3>Group Members</h3>
                        <ul>
                            {members.map((member, index) => (
                                <li key={index}>{member.email}</li>
                            ))}
                        </ul>
                        <button className="close-btn" onClick={toggleMembers}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChatRoom;
