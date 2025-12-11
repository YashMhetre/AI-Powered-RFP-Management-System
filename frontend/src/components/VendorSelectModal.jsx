import React, { useState } from 'react'
import { useApi } from '../context/ApiContext'
import toast from 'react-hot-toast'

export default function VendorSelectModal({ rfpId, vendors, onClose }) {
  const { api } = useApi()
  const [selected, setSelected] = useState([])
  const [loading, setLoading] = useState(false)

  function toggleVendor(id) {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(v => v !== id)
        : [...prev, id]
    )
  }

  async function sendRfp() {
    if (selected.length === 0) {
      toast.error("Please select at least one vendor")
      return
    }

    try {
      setLoading(true)

      // STEP 1: Save selected vendors (IMPORTANT)
      await api.put(`/rfps/${rfpId}/vendors`, {
        vendorIds: selected
      })

      // STEP 2: Send the RFP email (NO vendorIds passed here)
      await api.post(`/rfps/${rfpId}/send`)

      toast.success("RFP sent successfully!")
      onClose()
      setSelected([])

    } catch (err) {
      console.error(err)
      toast.error("Failed to send RFP")
    }

    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Select Vendors</h2>

        <div className="max-h-64 overflow-auto border rounded p-3 space-y-2">
          {vendors.length === 0 && (
            <p className="text-sm text-gray-500">No vendors available</p>
          )}

          {vendors.map(v => (
            <label key={v.id} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selected.includes(v.id)}
                onChange={() => toggleVendor(v.id)}
              />
              {v.name} ({v.email})
            </label>
          ))}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm bg-gray-200 rounded"
          >
            Cancel
          </button>

          <button
            onClick={sendRfp}
            disabled={loading}
            className="px-3 py-2 text-sm bg-green-600 text-white rounded"
          >
            {loading ? "Sending..." : "Send RFP"}
          </button>
        </div>
      </div>
    </div>
  )
}
