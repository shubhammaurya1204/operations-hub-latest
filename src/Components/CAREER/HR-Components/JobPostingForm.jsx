import React, { useState } from 'react';
import { createJobAPI } from '../../../services/api.js';

const JobPostingForm = ({ onJobCreated }) => {
  const [formData, setFormData] = useState({
    job_title: '',
    company: 'Treebay Technology',
    department: '',
    location: '',
    jobType: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Parse requirements text area into array
    const requirementsArray = formData.requirements
      .split('\n')
      .map(req => req.trim())
      .filter(req => req !== '');

    const payload = {
  job_title: formData.job_title,
  company: formData.company,
  location: formData.location,
  jobType: formData.jobType,
  description: formData.description,
  requirements: requirementsArray,
};

    try {
      setLoading(true);
      await createJobAPI(payload);
      alert('Job created successfully!');
      if (onJobCreated) onJobCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-bold mb-4">Post a New Job</h3>
      
      {error && <div className="text-red-600 bg-red-50 p-3 rounded">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input required type="text" name="job_title" value={formData.job_title} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input required type="text" name="company" value={formData.company} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input required type="text" name="location" value={formData.location} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Type</label>
          <select name="jobType" value={formData.jobType} onChange={handleChange} className="mt-1 w-full p-2 border rounded">
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Salary (Optional)</label>
          <input type="number" name="salary" value={formData.salary} onChange={handleChange} className="mt-1 w-full p-2 border rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea required rows="4" name="description" value={formData.description} onChange={handleChange} className="mt-1 w-full p-2 border rounded"></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Requirements (One per line)</label>
        <textarea required rows="4" name="requirements" value={formData.requirements} onChange={handleChange} placeholder="e.g. 3+ years experience with React..." className="mt-1 w-full p-2 border rounded"></textarea>
      </div>

      <button disabled={loading} type="submit" className="bg-[#1c6b36] hover:bg-green-800 text-white font-bold py-2 px-6 rounded">
        {loading ? 'Submitting...' : 'Submit Job Formulation'}
      </button>
    </form>
  );
};

export default JobPostingForm;
