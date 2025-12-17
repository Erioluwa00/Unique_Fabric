import React from 'react';
import "./AdminSettings.css"
import AdminContactMessages from './AdminContactMessages';
import AdminFullContactMessages from './AdminFullContactMessages';
function AdminReports() {
  return (
    <div className="page">
      <h1>Manage Reports</h1>
      <p>View and process customer orders.</p>

      <AdminContactMessages/>
      {/* <AdminFullContactMessages/> */}

    </div>
  );
}

export default AdminReports