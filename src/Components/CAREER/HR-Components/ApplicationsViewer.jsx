import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getApplications } from '../../../services/api';

const ApplicationsViewer = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await getApplications();
      setApplications(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-blue-100 text-blue-800';
      case 'Selected': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading applications...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto w-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold">Recent Applications</h2>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm">
            <th className="p-4 font-semibold border-b">Applicant Name</th>
            <th className="p-4 font-semibold border-b">Position</th>
            <th className="p-4 font-semibold border-b">Applied Date</th>
            <th className="p-4 font-semibold border-b">Status</th>
            <th className="p-4 font-semibold border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 border-b font-medium">{app.personalDetails?.fullName}</td>
              <td className="p-4 border-b">{app.jobId?.job_title || 'Unknown'}</td>
              <td className="p-4 border-b whitespace-nowrap">
                {new Date(app.createdAt).toLocaleDateString()}
              </td>
              <td className="p-4 border-b">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(app.applicationStatus)}`}>
                  {app.applicationStatus}
                </span>
              </td>
              <td className="p-4 border-b">
                <Link 
                  to={`/hr/application/${app._id}`}
                  className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded font-semibold"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
          {applications.length === 0 && (
            <tr>
              <td colSpan="5" className="p-8 text-center text-gray-500">No applications received yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsViewer;
