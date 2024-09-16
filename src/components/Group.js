import React, { useState } from 'react';
import TasksPage from './Tasks'; 
import ChatPage from './ChatRoom';   
import '../css/group.css';           

const GroupPage = () => {
  const [activeTab, setActiveTab] = useState('tasks');

  return (
    <div className="group-page-container">
      {/* Tab Navigation */}
      <div className="tabs-container">
        <div 
          className={`tab ${activeTab === 'tasks' ? 'active' : ''}`} 
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </div>
        <div 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`} 
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </div>
      </div>

      {/* Content Area */}
      <div className="content-container">
        {activeTab === 'tasks' ? (
          <div className="tasks-section">
            <TasksPage />
          </div>
        ) : (
          <div className="chat-section">
            <ChatPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupPage;
