import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function ChatRoom() {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const params=useParams()
    const[groupId,setGroupId]=useState('')
    const[userEmail,setUserEmail]=useState('')
    const navigate=useNavigate()
    
    useEffect(() => {

        const grId=params.id
        setGroupId(grId)
        const em=localStorage.getItem('userEmail')
        if(!em){
            navigate('/login')
        }else{
            setUserEmail(em)
        }
        socket.emit('joinGroup', groupId);

        // Listen for chat history
        socket.on('chatHistory', (history) => {
            setMessages(history);
        });

        // Listen for new messages
        socket.on('newMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Cleanup on unmount
        return () => {
            socket.off('chatHistory');
            socket.off('newMessage');
        };
    }, [groupId]);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('sendMessage', { groupId, userEmail, content: newMessage });
            setNewMessage('');  // Clear input
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.sender}:</strong> {msg.content} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
                    </div>
                ))}
            </div>
            <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Type a message..." 
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default ChatRoom
