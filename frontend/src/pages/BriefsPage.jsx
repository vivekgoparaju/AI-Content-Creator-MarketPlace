import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Wand2,
  Calendar,
  Layers,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function BriefsPage({ onOpenStudio }) {
  const { user, isBrand } = useAuth();
  const [briefs, setBriefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrief, setSelectedBrief] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editObjective, setEditObjective] = useState('');
  const [editStatus, setEditStatus] = useState('DRAFT');
  const [error, setError] = useState(null);

  const fetchBriefs = async () => {
    setLoading(true);
    try {
      const data = await api.listBriefs();
      setBriefs(data || []);
    } catch (err) {
      console.error('Failed to load briefs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this creative brief?')) return;
    try {
      await api.deleteBrief(id);
      setBriefs(briefs.filter((b) => b.id !== id));
      if (selectedBrief?.id === id) {
        setSelectedBrief(null);
      }
    } catch (err) {
      setError(err.message || 'Could not delete brief.');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedBrief) return;
    try {
      const updated = await api.updateBrief(selectedBrief.id, {
        title: editTitle,
        objective: editObjective,
        status: editStatus,
      });
      setBriefs(briefs.map((b) => (b.id === updated.id ? updated : b)));
      setSelectedBrief(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Could not update brief.');
    }
  };

  const openEdit = (brief) => {
    setSelectedBrief(brief);
    setEditTitle(brief.title);
    setEditObjective(brief.objective || '');
    setEditStatus(brief.status);
    setIsEditing(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Creative Campaign Briefs
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your AI marketing briefs, commercial usage specifications, and production requirements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenStudio}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6D5EF7] to-[#8C7EFF] hover:from-[#5848E5] hover:to-[#6D5EF7] text-white text-xs font-bold transition-all shadow-md shadow-[#6D5EF7]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Wand2 className="w-4 h-4 text-amber-300" />
            <span>Build with AI Studio</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Briefs Grid / List */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500">
          Loading campaign briefs from database...
        </div>
      ) : briefs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EEEAFE] text-[#6D5EF7] flex items-center justify-center mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-gray-900">No Creative Briefs Found</h3>
          <p className="text-xs text-gray-500">
            You haven't created any campaign briefs yet. Use the AI Brief Studio to turn your concept into a structured brief in seconds.
          </p>
          <button
            onClick={onOpenStudio}
            className="px-5 py-2.5 rounded-xl bg-[#6D5EF7] text-white text-xs font-bold cursor-pointer"
          >
            Launch AI Brief Studio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief) => (
            <div
              key={brief.id}
              className="bg-white rounded-2xl border border-gray-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      brief.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {brief.status}
                  </span>
                  <span className="text-[11px] text-gray-400">
                    {new Date(brief.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-gray-950 leading-snug">
                  {brief.title}
                </h3>

                {brief.objective && (
                  <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                    {brief.objective}
                  </p>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {brief.content_type?.map((ct, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-[#EEEAFE] text-[#5848E5] text-[10px] font-semibold uppercase"
                    >
                      {ct}
                    </span>
                  ))}
                  {brief.aspect_ratio && (
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-medium">
                      {brief.aspect_ratio}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedBrief(brief)}
                  className="text-xs font-semibold text-[#6D5EF7] hover:text-[#5848E5] flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(brief)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
                    title="Edit Brief"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(brief.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete Brief"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail / Edit Modal */}
      {selectedBrief && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs font-bold text-[#6D5EF7] uppercase tracking-wider">
                  Campaign Brief Specification
                </span>
                <h2 className="text-xl font-bold text-gray-950 mt-0.5">
                  {selectedBrief.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setSelectedBrief(null);
                  setIsEditing(false);
                }}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Objective
                  </label>
                  <textarea
                    rows={3}
                    value={editObjective}
                    onChange={(e) => setEditObjective(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PUBLISHED">PUBLISHED</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#6D5EF7] text-white text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-gray-400 block mb-1">Original Idea Prompt</span>
                  <p className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-800 leading-relaxed">
                    {selectedBrief.original_idea}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-gray-400 block mb-1">Objective</span>
                  <p className="text-gray-800 leading-relaxed">{selectedBrief.objective}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <span className="font-bold text-gray-400 block">Deliverables</span>
                    <span className="text-gray-950 font-semibold">
                      {selectedBrief.quantity} asset(s) · {selectedBrief.content_type?.join(', ')}
                    </span>
                  </div>
                  <div>
                    <span className="font-bold text-gray-400 block">Format & Aspect Ratio</span>
                    <span className="text-gray-950 font-semibold">
                      {selectedBrief.aspect_ratio} ({selectedBrief.output_format || 'ProRes 422'})
                    </span>
                  </div>
                </div>

                {selectedBrief.target_audience && (
                  <div>
                    <span className="font-bold text-gray-400 block mb-1">Target Audience</span>
                    <p className="text-gray-800">{selectedBrief.target_audience}</p>
                  </div>
                )}

                {selectedBrief.licensing_requirements && (
                  <div>
                    <span className="font-bold text-gray-400 block mb-1">Licensing Terms</span>
                    <p className="text-gray-800">{selectedBrief.licensing_requirements}</p>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <button
                    onClick={() => openEdit(selectedBrief)}
                    className="px-4 py-2 rounded-xl bg-gray-100 text-gray-800 font-bold hover:bg-gray-200"
                  >
                    Edit Brief
                  </button>
                  <button
                    onClick={() => setSelectedBrief(null)}
                    className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
