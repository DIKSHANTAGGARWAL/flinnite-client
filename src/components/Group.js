import React, { useState } from 'react';
import TasksPage from './Tasks'; // import your task component
import ChatPage from './ChatRoom';   // import your chat component
import '../css/group.css';           // Import your CSS

const GroupPage = () => {
  // State to track the current active tab (either 'tasks' or 'chat')
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
