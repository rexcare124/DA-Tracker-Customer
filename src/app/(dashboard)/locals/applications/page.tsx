"use client";

import Header from "@/components/Header";
import { FileText, Search, BarChart3 } from "lucide-react";
import React from "react";

const Applications = () => {
  return (
    <div className="dashboard-container">
      <Header
        title="Data Applications"
        subtitle="Manage your data access and analysis requests"
      />
      
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          This feature is coming soon. You&apos;ll be able to submit data access requests and track their status here.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            Browse Data
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center">
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default Applications;
