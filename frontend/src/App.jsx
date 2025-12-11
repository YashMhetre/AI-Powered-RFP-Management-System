import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import RFPListPage from './pages/RfpListPage.jsx'
import RfpCreate from './pages/CreateRfpPage'
import RfpView from './pages/RfpViewPage'
import Vendors from './pages/VendorManagementPage'
import Proposals from './pages/ProposalsPage.jsx'
import Compare from './pages/CompareProposalsPage'
import ProposalDetailsPage from './pages/ProposalDetailsPage.jsx'
import { Toaster } from 'react-hot-toast'
import { ApiProvider } from './context/ApiContext'
import { FileText } from 'lucide-react'

export default function App() {
  return (
    <ApiProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        <Routes>
          {/* Welcome Page - No Navigation Bar */}
          <Route path="/" element={<WelcomePage />} />

          {/* All other routes with navigation */}
          <Route path="/*" element={<AppWithNav />} />
        </Routes>

        <Toaster position="top-right" />
      </div>
    </ApiProvider>
  )
}

// Component with navigation bar for all pages except welcome
function AppWithNav() {
  return (
    <>
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            RFP Manager
          </Link>

          <div className="flex gap-2">
            <Link to="/rfps" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all">
              RFPs
            </Link>
            <Link to="/vendors" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all">
              Vendors
            </Link>
            <Link to="/" className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-purple-600 transition-all">
              Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <Routes>
          <Route path="/rfps" element={<RFPListPage />} />
          <Route path="/rfps/new" element={<RfpCreate />} />
          <Route path="/rfps/:id" element={<RfpView />} />
          <Route path="/rfps/:id/proposals" element={<Proposals />} />
          <Route path="/rfps/:id/proposals/:proposalId" element={<ProposalDetailsPage />} />
          <Route path="/rfps/:id/compare" element={<Compare />} />
          <Route path="/vendors" element={<Vendors />} />
        </Routes>
      </main>
    </>
  )
}