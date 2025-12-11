import React, { useEffect, useState } from "react";
import { useApi } from "../context/ApiContext";
import Card from "../components/Card";
import toast from "react-hot-toast";
import { Building2, Mail, Phone, Plus, Sparkles, Loader2 } from 'lucide-react';

export default function Vendors() {
  const { api } = useApi();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  function load() {
    setLoading(true);
    api
      .get("/vendors")
      .then((r) => {
        setVendors(r.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load vendors");
        setLoading(false);
      });
  }

  function validate() {
    const e = {};
    if (!form.name.trim()) {
      e.name = "Name is required";
    } else if (form.name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    }
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        e.email = "Enter a valid email";
      }
    }
    if (!form.phone.trim()) {
      e.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(form.phone)) {
      e.phone = "Phone must be exactly 10 digits";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function create() {
    if (!validate()) {
      toast.error("Fix form errors before submitting");
      return;
    }
    setCreating(true);
    try {
      await api.post("/vendors", form);
      toast.success("Vendor created successfully");
      setForm({ name: "", email: "", phone: "" });
      setErrors({});
      load();
    } catch (e) {
      toast.error("Failed to create vendor");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <Building2 className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Vendor Management
        </h1>
        <p className="mt-2 text-gray-600">Build and manage your trusted vendor network</p>
      </div>

      <Card className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-indigo-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Plus className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Add New Vendor</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Vendor Name"
                className={`pl-10 p-3 text-sm border-2 rounded-xl w-full bg-white focus:ring-4 transition-all ${
                  errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.name}</p>}
          </div>

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address"
                type="email"
                className={`pl-10 p-3 text-sm border-2 rounded-xl w-full bg-white focus:ring-4 transition-all ${
                  errors.email ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.email}</p>}
          </div>

          <div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                value={form.phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setForm({ ...form, phone: val });
                }}
                placeholder="Phone Number"
                maxLength={10}
                className={`pl-10 p-3 text-sm border-2 rounded-xl w-full bg-white focus:ring-4 transition-all ${
                  errors.phone ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:ring-indigo-100 focus:border-indigo-400"
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.phone}</p>}
          </div>

          <button
            onClick={create}
            disabled={creating}
            className="flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {creating ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Creating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Create Vendor
              </>
            )}
          </button>
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <Loader2 className="animate-spin w-12 h-12 text-indigo-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading vendors...</p>
          </div>
        </div>
      ) : vendors.length === 0 ? (
        <Card className="text-center py-16 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No vendors yet</h3>
          <p className="text-gray-600">Add your first vendor using the form above to get started.</p>
        </Card>
      ) : (
        <>
          <div className="flex items-center justify-between px-2">
            <h2 className="text-2xl font-bold text-gray-900">All Vendors</h2>
            <div className="flex items-center gap-2 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-900">
                {vendors.length} vendor{vendors.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((v) => (
              <Card key={v.id} className="hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 transform hover:-translate-y-1 group">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                    {v.name?.charAt(0) || "V"}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{v.name}</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        <span>{v.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="w-4 h-4 text-purple-500" />
                        <span>{v.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}