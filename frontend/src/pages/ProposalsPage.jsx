import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import Card from '../components/Card';
import toast from 'react-hot-toast';
import { Users, Eye, ChevronRight, Loader2 } from 'lucide-react';

export default function Proposals() {
  const { id } = useParams();
  const { api } = useApi();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/proposals/rfp/${id}`)
      .then(r => {
        setProposals(r.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Failed to load proposals');
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl mb-4 shadow-lg">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          Vendor Proposals
        </h1>
        <p className="mt-2 text-gray-600">Review and compare proposals from vendors</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="animate-spin w-12 h-12 text-amber-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading proposals...</p>
          </div>
        </div>
      ) : proposals.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No proposals yet</h3>
          <p className="text-gray-600">Vendors haven't submitted any proposals for this RFP.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {proposals.map(p => (
            <Card key={p.id} className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-amber-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {p.vendorName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{p.vendorName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`w-2 h-2 rounded-full ${p.aiScore >= 90 ? 'bg-green-500' : p.aiScore >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}></div>
                      <span className="text-xs text-gray-500">AI Scored</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Price</span>
                  <span className="text-xl font-bold text-green-700">
                    {p.totalPrice ? `$${p.totalPrice.toLocaleString()}` : 'N/A'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">AI Score</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${p.aiScore >= 90 ? 'bg-green-500' : p.aiScore >= 80 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                        style={{ width: `${p.aiScore}%` }}
                      ></div>
                    </div>
                    <span className="text-xl font-bold text-blue-700">{p.aiScore ?? 'N/A'}</span>
                  </div>
                </div>
              </div>

              <Link
                to={`/rfps/${id}/proposals/${p.id}`}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <Eye className="w-4 h-4" />
                View Details
                <ChevronRight className="w-4 h-4" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}