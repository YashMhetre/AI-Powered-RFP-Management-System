import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// Helper function to format markdown text
function formatMarkdownText(text) {
  if (!text) return null;
  
  // Split by lines
  const lines = text.split('\n');
  
  return lines.map((line, index) => {
    // Handle headers (###)
    if (line.startsWith('### ')) {
      return <h3 key={index} className="text-xl font-bold mt-4 mb-2">{line.replace('### ', '')}</h3>;
    }
    
    // Handle bold text (**text**)
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formatted = parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    
    // Handle bullet points (- text)
    if (line.trim().startsWith('- ')) {
      return (
        <div key={index} className="flex items-start ml-4 mb-2">
          <span className="mr-2">•</span>
          <span>{formatted}</span>
        </div>
      );
    }
    
    // Regular paragraphs
    if (line.trim()) {
      return <p key={index} className="mb-2">{formatted}</p>;
    }
    
    return <br key={index} />;
  });
}

export default function CompareProposalsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/api/proposals/rfp/${id}/compare`)
      .then(r => {
        setData(r.data);
        setLoading(false);
      })
      .catch((error) => {
        toast.error('Failed to get comparison');
        setLoading(false);
        console.error('Comparison error:', error);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Analyzing proposals...</p>
        </div>
      </div>
    );
  }
  
  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Failed to load data</h3>
          <p className="mt-2 text-gray-600">Please try again later</p>
          <Link to={`/rfps/${id}`} className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to RFP
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <Link to={`/rfps/${id}`} className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to RFP
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Proposal Comparison
            </span>
          </h1>
          <p className="mt-2 text-gray-600">AI-powered analysis and recommendations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Proposals</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{data.comparison?.totalProposals || 0}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Price Range</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  ${(data.comparison?.priceRange?.min || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  to ${(data.comparison?.priceRange?.max || 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Average Score</p>
                <p className="mt-2 text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {data.comparison?.avgScore?.toFixed(1) || 'N/A'}
                </p>
                <p className="text-sm text-gray-500">out of 100</p>
              </div>
              <div className="bg-purple-100 rounded-full p-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h2 className="text-2xl font-bold mb-3">AI Recommendation</h2>
              <div className="text-blue-50 leading-relaxed">
                {formatMarkdownText(data.aiRecommendation)}
              </div>
            </div>
          </div>
        </div>

        {/* Winner Card */}
        {data.recommendedProposal && (
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full p-3 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <h2 className="ml-4 text-3xl font-bold text-gray-900">Recommended Vendor</h2>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{data.recommendedProposal.vendorName}</h3>
                  <p className="text-gray-600 flex items-center mt-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {data.recommendedProposal.vendorEmail}
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full">
                    <span className="text-3xl font-bold text-green-700">{data.recommendedProposal.aiScore}</span>
                    <span className="text-green-600 ml-1">/100</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Total Price</p>
                  <p className="text-xl font-bold text-gray-900">${data.recommendedProposal.totalPrice?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Delivery</p>
                  <p className="text-xl font-bold text-gray-900">{data.recommendedProposal.deliveryDays} days</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Payment</p>
                  <p className="text-sm font-semibold text-gray-900">{data.recommendedProposal.paymentTerms}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Warranty</p>
                  <p className="text-sm font-semibold text-gray-900">{data.recommendedProposal.warranty}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Proposals */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">All Proposals</h2>
            <p className="text-gray-600 mt-1">Detailed comparison of all submitted proposals</p>
          </div>

          <div className="divide-y divide-gray-200">
            {data.proposals?.map((proposal, index) => (
              <div key={proposal.id} className="p-8 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{proposal.vendorName}</h3>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {proposal.vendorEmail}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${
                      proposal.aiScore >= 80 ? 'bg-green-100' :
                      proposal.aiScore >= 60 ? 'bg-yellow-100' :
                      'bg-red-100'
                    }`}>
                      <span className={`text-2xl font-bold ${
                        proposal.aiScore >= 80 ? 'text-green-700' :
                        proposal.aiScore >= 60 ? 'text-yellow-700' :
                        'text-red-700'
                      }`}>
                        {proposal.aiScore || 'N/A'}
                      </span>
                      <span className={`ml-1 ${
                        proposal.aiScore >= 80 ? 'text-green-600' :
                        proposal.aiScore >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      }`}>/100</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">AI Score</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                    <p className="text-xs font-medium text-blue-700 uppercase mb-1">Total Price</p>
                    <p className="text-lg font-bold text-blue-900">${proposal.totalPrice?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                    <p className="text-xs font-medium text-purple-700 uppercase mb-1">Delivery</p>
                    <p className="text-lg font-bold text-purple-900">{proposal.deliveryDays} days</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                    <p className="text-xs font-medium text-green-700 uppercase mb-1">Payment</p>
                    <p className="text-sm font-semibold text-green-900">{proposal.paymentTerms}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                    <p className="text-xs font-medium text-orange-700 uppercase mb-1">Warranty</p>
                    <p className="text-sm font-semibold text-orange-900">{proposal.warranty}</p>
                  </div>
                </div>

                {proposal.aiSummary && (
                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">AI Analysis:</p>
                    <p className="text-sm text-gray-800 leading-relaxed">{proposal.aiSummary}</p>
                  </div>
                )}

                {proposal.items && proposal.items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Itemized Breakdown
                    </h4>
                    <div className="space-y-2">
                      {proposal.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white rounded-lg p-3 border border-gray-200">
                          <span className="text-sm text-gray-700">
                            <span className="font-medium">{item.itemName}</span>
                            <span className="text-gray-500 ml-2">(Qty: {item.quantity})</span>
                          </span>
                          <span className="text-sm font-bold text-gray-900">${item.totalPrice?.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}