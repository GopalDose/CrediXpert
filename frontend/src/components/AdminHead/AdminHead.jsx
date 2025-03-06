import React from 'react';
import { FaUserCircle } from 'react-icons/fa';
import './AdminHead.css';

const AdminHead = () => {
  return (
    <div className="adminHead">
      <div className="rightSide">
        <div className="user">
          <FaUserCircle className="user-icon" />
        </div>
      </div>
    </div>
  );
};

export default AdminHead;