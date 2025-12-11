import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useApi } from "../context/ApiContext";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ProposalDetailsPage() {
  const { proposalId } = useParams();
  const { api } = useApi();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/proposals/${proposalId}`)
      .then((res) => {
        setProposal(res.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load proposal");
        setLoading(false);
      });
  }, [proposalId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!proposal)
    return <p className="text-center text-gray-600">Proposal not found.</p>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-0">

      {/* HEADER */}
      <div className="flex items-center gap-3">
        <Link
          to={`/rfps/${proposal.rfpId}/proposals`}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
        >
          <ArrowLeft size={18} />
          Back
        </Link>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h1 className="text-3xl font-bold text-amber-700">
          {proposal.vendorName}
        </h1>
        <p className="text-gray-600 mt-1">Proposal #{proposal.id}</p>

        {/* AI Score (if available) */}
        {proposal.aiScore && (
          <div className="mt-4 inline-block bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
            AI Score: {proposal.aiScore}/100
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
          AI Summary
        </h2>
        <p className="text-gray-700 leading-relaxed">{proposal.aiSummary}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Items</h2>

        <div className="grid gap-4">
          {proposal.items.map((item) => (
            <div
              key={item.id}
              className="border border-gray-200 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div className="flex justify-between mb-2">
                <div className="font-semibold text-gray-900 text-lg">
                  {item.itemName}
                </div>
                <div className="text-amber-700 font-semibold">
                  ${item.unitPrice}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-1">
                Quantity: {item.quantity}
              </p>

              {item.specifications && (
                <p className="text-sm text-gray-500 italic">
                  {item.specifications}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
