import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import Card from '../components/Card';
import toast from 'react-hot-toast';
import VendorSelectModal from '../components/VendorSelectModal';
import { FileText, TrendingUp, Users, GitCompare, Send, Sparkles, ChevronRight, X, Loader2 } from 'lucide-react';

export default function RfpView() {
  const { id } = useParams();
  const { api } = useApi();

  const [rfp, setRfp] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load RFP
  useEffect(() => {
    setLoading(true);
    api.get(`/rfps/${id}`)
      .then(res => {
        setRfp(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load RFP");
        setLoading(false);
      });
  }, [id]);

  // Load vendor list
  useEffect(() => {
    api.get('/vendors')
      .then(res => setVendors(res.data))
      .catch(() => toast.error("Failed to load vendors"));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!rfp) {
    return (
      <div className="text-center mt-10">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">RFP not found</h3>
        <Link to="/rfps" className="text-blue-600 hover:underline">Back to RFP list</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <Card className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-2 border-blue-200">
        <div className="flex justify-between flex-wrap gap-4">
          <div className="flex-1">
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              {rfp.status}
            </span>

            <h1 className="text-3xl font-bold text-gray-900">{rfp.title}</h1>

            <div className="flex items-center gap-4 mt-2 text-gray-600 flex-wrap">
              {rfp.budget && (
                <p className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Budget: ${rfp.budget.toLocaleString()}</span>
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 items-center">

  <Link
    to={`/rfps/${id}/proposals`}
    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium shadow-sm transition"
  >
    <Users className="w-4 h-4 text-blue-600" />
    Proposals
  </Link>

  <Link
    to={`/rfps/${id}/compare`}
    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-medium shadow-sm transition"
  >
    <GitCompare className="w-4 h-4 text-purple-600" />
    Compare
  </Link>

  <button
    onClick={() => setShowModal(true)}
    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md transition"
  >
    <Send className="w-4 h-4 text-white" />
    Send to Vendors
  </button>

</div>

        </div>
      </Card>

      {/* DESCRIPTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            Description
          </h3>
          <p className="text-gray-700">{rfp.description}</p>
        </Card>

        {/* REQUIREMENTS */}
        <Card>
          <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 mb-3">
            <Sparkles className="w-5 h-5 text-purple-600" />
            Requirements
          </h3>

          {Array.isArray(rfp.requirements) ? (
            <div className="space-y-2">
              {rfp.requirements.map((req, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg flex gap-2">
                  <ChevronRight className="w-4 h-4 text-purple-600 mt-1" />
                  <div>
                    <p className="font-semibold text-gray-800">{req.item}</p>
                    <p className="text-gray-600 text-sm">Quantity: {req.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No requirements available</p>
          )}
        </Card>
      </div>

      {/* SEND MODAL */}
      {showModal && (
        <VendorSelectModal
          rfpId={id}
          vendors={vendors}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
