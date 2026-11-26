import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function SubmitComplaint() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!description.trim() && !subject.trim() ) {
      setError(' Subject and Description are required and must be max 150 and 2,000 characters respectively.');
      return;

    }
    if (!subject.trim()) {
      setError('Subject is required and must be max 150 characters.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required and must be max 2,000 characters.');
      return;

    }

    try {
      await api.post('/complaints', { subject, description });
      navigate('/complaints');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit complaint.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Submit Complaint</h2>

        {error && <div className="alert-error mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              className="input-field"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={150}
              
              placeholder="Short title for your issue"
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {subject.length}/150
            </p>
          </div>

          <div>
            <label className="form-label">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="input-field resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={2000}
              rows={8}
              
              placeholder="Describe the problem in detail…"
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {description.length}/2000
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-primary">
              Submit
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/complaints')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}