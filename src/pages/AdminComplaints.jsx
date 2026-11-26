import { useEffect, useState } from 'react';
import api from '../api';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['Pending', 'In Progress', 'Resolved'];

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/complaints')
      .then(({ data }) => setComplaints(data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load complaints'));
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status });
      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status } : c))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Complaints</h1>
        <p className="text-sm text-gray-500 mt-1">
          Review and update the status of every submitted complaint
        </p>
      </div>

      {error && <div className="alert-error mb-4">{error}</div>}

      {complaints.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-gray-500">No complaints found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Complaint #</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Submitted By</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                    {c.complaint_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{c.subject}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                    <p className="line-clamp-2">{c.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {c.submitted_by_name || c.user?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={c.status} />
                      <select
                        value={c.status}
                        onChange={(e) => updateStatus(c.id, e.target.value)}
                        className="text-xs border border-gray-300 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
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