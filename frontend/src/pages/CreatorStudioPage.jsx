import React, { useState, useEffect } from 'react';
import {
  User,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  Film,
  AlertCircle,
  X,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function CreatorStudioPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' | 'profile'

  // Profile State
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experienceYears, setExperienceYears] = useState(3);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [skillTags, setSkillTags] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Portfolio State
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [itemTitle, setItemTitle] = useState('');
  const [itemDesc, setItemDesc] = useState('');
  const [itemType, setItemType] = useState('video');
  const [itemUrl, setItemUrl] = useState('');
  const [itemRatio, setItemRatio] = useState('16:9');
  const [itemFormat, setItemFormat] = useState('ProRes 422 HQ');
  const [itemWorkflow, setItemWorkflow] = useState('');
  const [itemCommercialStatus, setItemCommercialStatus] = useState('Commercial Ready');
  const [itemToolName, setItemToolName] = useState('Runway Gen-3 Alpha');
  const [itemToolUsage, setItemToolUsage] = useState('Cinematic motion and camera pans');
  const [savingItem, setSavingItem] = useState(false);
  const [error, setError] = useState(null);
  const [itemFile, setItemFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [mediaInputMode, setMediaInputMode] = useState('url'); // 'url' | 'file'

  const loadData = async () => {
    setLoading(true);
    try {
      const [profData, portData] = await Promise.all([
        api.getMyProfile(),
        api.getMyPortfolio(),
      ]);
      setProfile(profData);
      setDisplayName(profData.display_name || '');
      setBio(profData.bio || '');
      setSpecialization(profData.specialization || '');
      setExperienceYears(profData.experience_years || 1);
      setAvatarUrl(profData.avatar_url || '');
      setSkillTags(profData.skills?.map((s) => s.name) || []);
      setPortfolioItems(portData || []);
    } catch (err) {
      console.error('Failed to load creator data:', err);
      setError(err.message || 'Could not load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setError(null);
    setProfileSuccess(false);

    try {
      const updated = await api.updateMyProfile({
        display_name: displayName,
        bio,
        specialization,
        experience_years: parseInt(experienceYears, 10),
        avatar_url: avatarUrl,
        skill_names: skillTags,
      });
      setProfile(updated);
      setProfileSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (clean && !skillTags.includes(clean)) {
      setSkillTags([...skillTags, clean]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (name) => {
    setSkillTags(skillTags.filter((s) => s !== name));
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setItemFile(file);
    setUploadingFile(true);
    setError(null);
    try {
      const result = await api.uploadPortfolioMedia(file);
      setItemUrl(result.url);
    } catch (err) {
      setError(err.message || 'Failed to upload file.');
      setItemFile(null);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleCreatePortfolioItem = async (e) => {
    e.preventDefault();
    setSavingItem(true);
    setError(null);

    try {
      const payload = {
        title: itemTitle,
        description: itemDesc,
        content_type: itemType,
        media_url: itemUrl,
        aspect_ratio: itemRatio,
        output_format: itemFormat,
        workflow_description: itemWorkflow,
        commercial_use_status: itemCommercialStatus,
        tools: itemToolName
          ? [{ tool_name: itemToolName, usage_description: itemToolUsage }]
          : [],
      };

      const created = await api.createPortfolioItem(payload);
      setPortfolioItems([created, ...portfolioItems]);
      setIsAddingItem(false);
      // Reset form
      setItemTitle('');
      setItemDesc('');
      setItemUrl('');
      setItemWorkflow('');
      setItemFile(null);
      setMediaInputMode('url');
    } catch (err) {
      setError(err.message || 'Failed to create portfolio item.');
    } finally {
      setSavingItem(false);
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this portfolio item?')) return;
    try {
      await api.deletePortfolioItem(id);
      setPortfolioItems(portfolioItems.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete portfolio item.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Creator Studio & Portfolio Manager
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Manage your AI filmmaker credentials, generative models, workflow evidence, and portfolio work.
          </p>
        </div>

        {/* Studio Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'portfolio' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-600'
            }`}
          >
            Portfolio Work ({portfolioItems.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'profile' ? 'bg-white text-gray-950 shadow-2xs' : 'text-gray-600'
            }`}
          >
            Profile & Skills
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {profileSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Creator Profile successfully saved to database!</span>
        </div>
      )}

      {/* TAB 1: PORTFOLIO MANAGER */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Your AI Showcase Works
            </h2>
            <button
              onClick={() => setIsAddingItem(true)}
              className="px-4 py-2 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Work</span>
            </button>
          </div>

          {portfolioItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs text-gray-500 space-y-3">
              <p>No creative works in your portfolio yet.</p>
              <button
                onClick={() => setIsAddingItem(true)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white font-bold cursor-pointer"
              >
                Add Your First AI Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-16/10 bg-gray-950 overflow-hidden">
                    <img
                      src={item.media_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white font-semibold uppercase">
                      {item.content_type}
                    </div>
                  </div>

                  <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-gray-950">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-500 text-xs line-clamp-2 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {item.commercial_use_status || 'Commercial Ready'}
                      </span>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-gray-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                        title="Delete work"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROFILE EDITOR */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 max-w-3xl space-y-6">
          <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
            Edit Creator Profile Details
          </h2>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Creative Specialization
                </label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  placeholder="e.g. AI Filmmaking & Cinematic Commercials"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Biography & Creative Background
              </label>
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your creative experience, background with generative diffusion models, and client work..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Production Experience (Years)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-32 px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
              />
            </div>

            {/* Skills Tag Manager */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-gray-700">
                Skills & Production Competencies
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {skillTags.map((sk) => (
                  <span
                    key={sk}
                    className="px-2.5 py-1 rounded-lg bg-[#EEEAFE] text-[#5848E5] text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>{sk}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-black"
                      onClick={() => handleRemoveSkill(sk)}
                    />
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  placeholder="Add skill (e.g. Prompt Engineering, Animatics)..."
                  className="px-3 py-2 rounded-xl border border-gray-200 text-xs flex-1 focus:outline-none focus:border-[#6D5EF7]"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-800"
                >
                  Add Skill
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-2.5 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all shadow-md shadow-[#6D5EF7]/20 flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{profileSaving ? 'Saving Profile...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Add Portfolio Item */}
      {isAddingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h2 className="text-xl font-bold text-gray-950">Add Portfolio Work</h2>
              <button
                onClick={() => setIsAddingItem(false)}
                className="text-gray-400 hover:text-gray-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePortfolioItem} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={itemTitle}
                  onChange={(e) => setItemTitle(e.target.value)}
                  placeholder="e.g. Lumina Aura: Hypercar Commercial"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-gray-700">
                    Media URL (Image / Video preview)
                  </label>
                  <div className="flex bg-gray-100 rounded-lg p-0.5 text-[10px] font-bold">
                    <button
                      type="button"
                      onClick={() => setMediaInputMode('url')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        mediaInputMode === 'url' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Paste URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setMediaInputMode('file')}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        mediaInputMode === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                      }`}
                    >
                      Choose File
                    </button>
                  </div>
                </div>

                {mediaInputMode === 'url' ? (
                  <input
                    type="url"
                    required={mediaInputMode === 'url'}
                    value={itemUrl}
                    onChange={(e) => setItemUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  />
                ) : (
                  <div className="space-y-2">
                    <label
                      htmlFor="portfolio-media-file"
                      className={`flex items-center gap-3 w-full px-3.5 py-3 rounded-xl border-2 border-dashed cursor-pointer transition-all text-xs ${
                        uploadingFile
                          ? 'border-[#6D5EF7] bg-[#6D5EF7]/5 text-[#6D5EF7]'
                          : itemFile
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 bg-gray-50 text-gray-500 hover:border-[#6D5EF7] hover:bg-[#6D5EF7]/5'
                      }`}
                    >
                      <Film className="w-4 h-4 shrink-0" />
                      <span className="truncate flex-1">
                        {uploadingFile
                          ? 'Uploading...'
                          : itemFile
                          ? itemFile.name
                          : 'Click to choose an image or video file'}
                      </span>
                      {uploadingFile && (
                        <span className="shrink-0 w-3 h-3 border-2 border-[#6D5EF7] border-t-transparent rounded-full animate-spin" />
                      )}
                      {!uploadingFile && itemFile && itemUrl && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                    </label>
                    <input
                      id="portfolio-media-file"
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime,video/x-msvideo"
                      className="sr-only"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) handleFileUpload(f);
                      }}
                    />
                    {itemFile && itemUrl && !uploadingFile && (
                      <p className="text-[10px] text-emerald-700 font-medium truncate">
                        ✓ Uploaded — saved as: <span className="font-mono">{itemUrl}</span>
                      </p>
                    )}
                    {/* Hidden required field so form validation fires correctly */}
                    <input
                      type="text"
                      required
                      value={itemUrl}
                      readOnly
                      className="sr-only"
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Content Type
                  </label>
                  <select
                    value={itemType}
                    onChange={(e) => setItemType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  >
                    <option value="video">Video & Film</option>
                    <option value="animation">Animation</option>
                    <option value="image">Image Stills</option>
                    <option value="motion_graphics">Motion Graphics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={itemRatio}
                    onChange={(e) => setItemRatio(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  >
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:5">4:5 (Portrait)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Primary AI Tool / Model Used
                </label>
                <input
                  type="text"
                  required
                  value={itemToolName}
                  onChange={(e) => setItemToolName(e.target.value)}
                  placeholder="e.g. Runway Gen-3 Alpha, Flux.1 Pro, Kling"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tool Usage Description
                </label>
                <input
                  type="text"
                  value={itemToolUsage}
                  onChange={(e) => setItemToolUsage(e.target.value)}
                  placeholder="e.g. Kinetic camera motion and atmospheric lighting synthesis"
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Production Pipeline & Workflow Description
                </label>
                <textarea
                  rows={3}
                  value={itemWorkflow}
                  onChange={(e) => setItemWorkflow(e.target.value)}
                  placeholder="Describe your prompt process, depth conditioning, node graph, upscaling, or color grading..."
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="px-5 py-2 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold shadow-md shadow-[#6D5EF7]/20"
                >
                  {savingItem ? 'Saving Work...' : 'Add to Portfolio'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
