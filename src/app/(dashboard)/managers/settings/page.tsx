"use client";

import Header from "@/components/Header";
import { Settings, User, Mail, Phone } from "lucide-react";
import React from "react";

const ManagerSettings = () => {
  return (
    <div className="dashboard-container">
      <Header
        title="Settings"
        subtitle="Manage your government official account settings"
      />
      
      <div className="text-center py-12">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Settings Coming Soon</h3>
        <p className="mt-1 text-sm text-gray-500">
          Account settings and preferences will be available here soon.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">Profile Management</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <Mail className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">Email Preferences</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center">
            <Phone className="w-4 h-4 mr-2 text-gray-600" />
            <span className="text-sm text-gray-600">Contact Settings</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSettings;
