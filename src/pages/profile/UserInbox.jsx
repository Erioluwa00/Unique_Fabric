import React, { useState } from 'react';
import './UserInbox.css';
import {FaCommentDots, FaGift, FaStar} from 'react-icons/fa'
import ProfileSidebar from '../../components/ProfileSidebar';
const UserInbox = () => {
  const [activeTab, setActiveTab] = useState('all');

  const allMessagesContent = (
    <div className="messages-content">
      <div className="empty-state">
        <div className="empty-icon"><FaCommentDots/></div>
        <h3>You don't have any messages</h3>
        <p>Here you will be able to see all the messages that we send you.</p>
        <p className="stay-tuned">Stay tuned</p>
      </div>
    </div>
  );

  const importantContent = (
    <div className="messages-content">
      <div className="empty-state">
        <div className="empty-icon"><FaStar/></div>
        <h3>No important messages</h3>
        <p>You don't have any messages marked as important yet.</p>
        <p className="stay-tuned">Important updates will appear here</p>
      </div>
    </div>
  );

  const promotionsContent = (
    <div className="messages-content">
      <div className="empty-state">
        <div className="empty-icon"><FaGift/></div>
        <h3>No promotional messages</h3>
        <p>You haven't received any promotional offers yet.</p>
        <p className="stay-tuned">Great deals will show up here</p>
      </div>
    </div>
  );

  return (
         <div >
     {/* <ProfileSidebar/> */}
    <div className="inbox-page">
      <div className="inbox-container">
        <h1 className="page-title">Inbox Messages</h1>
        
        <div className="tabs-container">
          <button 
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Messages
          </button>
          <button 
            className={`tab-button ${activeTab === 'important' ? 'active' : ''}`}
            onClick={() => setActiveTab('important')}
          >
            Important
          </button>
          <button 
            className={`tab-button ${activeTab === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveTab('promotions')}
          >
            Promotions
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'all' && allMessagesContent}
          {activeTab === 'important' && importantContent}
          {activeTab === 'promotions' && promotionsContent}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserInbox;