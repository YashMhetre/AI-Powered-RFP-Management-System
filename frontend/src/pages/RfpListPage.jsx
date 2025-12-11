import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import Card from '../components/Card';
import toast from 'react-hot-toast';
import { FileText, Plus, TrendingUp, Eye, Users, GitCompare } from 'lucide-react';

export default function RFPListPage() {
  const { api } = useApi();
  const [rfps, setRfps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/rfps')
      .then(res => {
        setRfps(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load RFPs');
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Request for Proposals
          </h1>
          <p className="mt-2 text-gray-600">Manage and track all your RFPs in one place</p>
        </div>
        <Link 
          to="/rfps/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          New RFP
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : rfps.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No RFPs yet</h3>
          <p className="text-gray-600 mb-4">Create your first RFP to get started.</p>
          <Link 
            to="/rfps/new"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            Create RFP
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rfps.map(r => (
            <Card key={r.id} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group border-2 border-transparent hover:border-blue-200">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Active
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                {r.title}
              </h2>
              
              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">
                  Budget: {r.budget ? `$${r.budget.toLocaleString()}` : 'TBD'}
                </span>
              </div>

              <div className="flex gap-2">
  <Link 
    to={`/rfps/${r.id}`}
    className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-all"
  >
    <Eye className="w-4 h-4" />
    View
  </Link>
  <Link 
    to={`/rfps/${r.id}/proposals`}
    className="flex-1 flex items-center justify-center gap-2 bg-purple-50 text-purple-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-purple-100 transition-all"
  >
    <Users className="w-4 h-4" />
    Proposals
  </Link>
  <Link 
    to={`/rfps/${r.id}/compare`}
    className="flex-1 flex items-center justify-center gap-2 bg-orange-50 text-orange-600 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-100 transition-all"
  >
    <GitCompare className="w-4 h-4" />
    Compare
  </Link>
</div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}