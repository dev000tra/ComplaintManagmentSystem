import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StatusBadge from '../components/StatusBadge';

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/complaints')
      .then(({ data }) => setComplaints(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load complaints'));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Complaints</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track the status of your submitted complaints
          </p>
        </div>
        <Link to="/complaints/new" className="btn-primary">
          + New Complaint
        </Link>
      </div>

      {error && <div className="alert-error mb-4">{error}</div>}

      {complaints.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-500">No complaints yet.</p>
          <Link to="/complaints/new" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
            Submit your first complaint
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Complaint #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                    {c.complaint_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.subject}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}