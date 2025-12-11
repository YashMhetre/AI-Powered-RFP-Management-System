import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../context/ApiContext';
import toast from 'react-hot-toast';
import Card from '../components/Card';
import { Sparkles, FileText, Loader2, Check } from 'lucide-react';

export default function CreateRfpPage() {
  const { api } = useApi();
  const nav = useNavigate();
  const [input, setInput] = useState('');
  const [parsing, setParsing] = useState(false);
  const [structured, setStructured] = useState(null);

  async function handleParse() {
    if (!input.trim()) {
      toast.error('Please enter RFP details');
      return;
    }

    setParsing(true);
    try {
      const res = await api.post('/rfps/parse', { 
        naturalLanguageDescription: input 
      });

      setStructured(res.data.parsedRfp);
      toast.success('Structured RFP generated');
    } catch (err) {
      toast.error('Failed to parse RFP');
    }
    setParsing(false);
  }

  async function saveRfp() {
    try {
      const res = await api.post('/rfps', {
        naturalLanguageDescription: input,
        vendorIds: []
      });

      toast.success('RFP created');
      nav(`/rfps/${res.data.rfpId}`);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save RFP');
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-4 shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Create RFP with AI
        </h1>
        <p className="mt-2 text-gray-600">Describe your needs in natural language and let AI structure it</p>
      </div>

      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="w-6 h-6 text-emerald-600" />
          <h3 className="text-lg font-bold text-gray-900">RFP Description</h3>
        </div>
        
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          rows={8}
          placeholder="Describe your RFP requirements in detail... For example: 'We need a cloud infrastructure upgrade to support 10x growth, budget $150k, timeline 3 months, requires AWS and Kubernetes expertise...'"
          className="w-full p-4 border-2 border-emerald-200 rounded-xl text-sm focus:ring-4 focus:ring-emerald-100 focus:border-emerald-400 transition-all resize-none"
        />

        <div className="mt-4 flex gap-3">
          <button
            onClick={handleParse}
            disabled={parsing || !input.trim()}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
          >
            {parsing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Parse with AI
              </>
            )}
          </button>

          {structured && (
            <button
              onClick={saveRfp}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <Check className="w-5 h-5" />
              Save RFP
            </button>
          )}
        </div>
      </Card>

      {structured && (
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">AI-Generated Structure</h3>
          </div>
          <pre className="text-xs bg-white p-4 rounded-xl overflow-auto max-h-96 border border-blue-200">
            {JSON.stringify(structured, null, 2)}
          </pre>
        </Card>
      )}
    </div>
  );
}