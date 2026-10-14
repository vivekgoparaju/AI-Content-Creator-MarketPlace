import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Save,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Film,
  Compass,
  FileCheck,
  RefreshCw,
  Info,
  Building2,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export function AIBriefStudioPage({ onBriefSaved, onOpenAuth }) {
  const { user, isAuthenticated, isBrand } = useAuth();

  const [prompt, setPrompt] = useState(
    'Create a premium 20-second cinematic product video for a new luxury electric hypercar launch with futuristic lighting for YouTube widescreen.'
  );
  const [aspectRatioHint, setAspectRatioHint] = useState('16:9');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generatedData, setGeneratedData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Editable fields state
  const [title, setTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [contentTypes, setContentTypes] = useState(['video']);
  const [visualStyle, setVisualStyle] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [outputFormat, setOutputFormat] = useState('ProRes 422 HQ');
  const [quantity, setQuantity] = useState(1);
  const [targetAudience, setTargetAudience] = useState('');
  const [commercialUseRequired, setCommercialUseRequired] = useState(true);
  const [licensingRequirements, setLicensingRequirements] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [missingInfo, setMissingInfo] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState({});

  const samplePrompts = [
    {
      label: '⚡ Hypercar Commercial',
      text: 'Create a premium 20-second cinematic product video for a new luxury electric hypercar launch with futuristic lighting for YouTube widescreen.',
      ratio: '16:9',
    },
    {
      label: '✨ Luxe Skincare Teaser',
      text: 'Create a 15-second ethereal macro beauty video for a hydration serum launch. Clean minimalist visual style for Instagram Reels.',
      ratio: '9:16',
    },
    {
      label: '🦾 Cyberpunk Watch 3D',
      text: 'High-energy 3D motion graphics teaser showing mechanical disintegration of a cybernetic smartwatch for a viral TikTok campaign.',
      ratio: '9:16',
    },
  ];

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await api.generateAIBrief({
        idea: prompt,
        additional_context: {
          aspect_ratio: aspectRatioHint,
        },
      });

      const b = res.suggested_brief;
      setGeneratedData(b);
      setTitle(b.title || '');
      setObjective(b.objective || '');
      setContentTypes(b.content_type?.length ? b.content_type : ['video']);
      setVisualStyle(b.visual_style || '');
      setAspectRatio(b.aspect_ratio || aspectRatioHint || '16:9');
      setOutputFormat(b.output_format || 'ProRes 422 HQ');
      setQuantity(b.quantity || 1);
      setTargetAudience(b.target_audience || '');
      setCommercialUseRequired(b.commercial_use_required ?? true);
      setLicensingRequirements(b.licensing_requirements || 'Full commercial broadcast and social usage rights for 12 months.');
      setAdditionalRequirements(b.additional_requirements || '');
      setMissingInfo(b.missing_information || []);
      setAiSuggestions(b.ai_suggestions || {});
    } catch (err) {
      console.error('Error generating brief:', err);
      setError(err.message || 'Generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrief = async (briefStatus = 'PUBLISHED') => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    if (!isBrand) {
      setError('Please sign in or switch to a Brand/Agency account to save creative briefs.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        title: title || 'Untitled Campaign Brief',
        original_idea: prompt,
        objective,
        content_type: contentTypes,
        visual_style: visualStyle,
        aspect_ratio: aspectRatio,
        output_format: outputFormat,
        quantity: parseInt(quantity, 10) || 1,
        target_audience: targetAudience,
        commercial_use_required: commercialUseRequired,
        licensing_requirements: licensingRequirements,
        additional_requirements: additionalRequirements,
        status: briefStatus,
      };

      const saved = await api.createBrief(payload);
      setSaveSuccess(true);
      if (onBriefSaved) {
        onBriefSaved(saved);
      }
    } catch (err) {
      console.error('Error saving brief:', err);
      setError(err.message || 'Failed to save brief to database.');
    } finally {
      setSaving(false);
    }
  };

  const toggleContentType = (type) => {
    if (contentTypes.includes(type)) {
      if (contentTypes.length > 1) {
        setContentTypes(contentTypes.filter((t) => t !== type));
      }
    } else {
      setContentTypes([...contentTypes, type]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEEAFE] text-[#5848E5] text-xs font-bold mb-2">
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Brief Builder Studio</span>
          </div>
          <h1 className="text-3xl font-black text-gray-950 tracking-tight">
            Prompt-to-Brief Generator
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-2xl mt-1">
            Transform high-level campaign ideas into structured, editable creative briefs. Review AI suggestions, confirm missing parameters, and publish.
          </p>
        </div>

        {/* Brand Account Status Callout */}
        <div className="flex items-center gap-2">
          {isAuthenticated && isBrand ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Brand Account Active</span>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-indigo-300" />
              <span>Sign in as Brand to Save</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold">Creative Brief successfully persisted to MySQL database!</span>
          </div>
          <span className="text-[11px] text-emerald-700">Available in Campaign Briefs tab</span>
        </div>
      )}

      {/* Two-Panel Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Panel: Prompt & Context Input */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-7 shadow-xs space-y-6 text-left">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-950 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6D5EF7]" />
              <span>Describe Your Campaign Vision</span>
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              State what you want to create, the mood, visual elements, target audience, or platform.
            </p>
          </div>

          {/* Prompt Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Try Example Ideas:
            </span>
            <div className="flex flex-col gap-1.5">
              {samplePrompts.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(s.text);
                    setAspectRatioHint(s.ratio);
                  }}
                  className="text-left p-2.5 rounded-xl border border-gray-100 hover:border-[#6D5EF7]/40 bg-gray-50/70 hover:bg-[#EEEAFE]/50 text-xs text-gray-700 hover:text-[#5848E5] transition-all cursor-pointer font-medium leading-snug"
                >
                  <span className="font-bold block text-gray-900 mb-0.5">{s.label}</span>
                  <span className="line-clamp-1 text-[11px] text-gray-500">{s.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Natural Language Textarea */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              Natural Language Prompt
            </label>
            <textarea
              rows={5}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Create a 30-second luxury perfume commercial featuring flowing holographic petals and high-speed fluid camera transitions for YouTube..."
              className="w-full p-3.5 rounded-2xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE] leading-relaxed"
            />
          </div>

          {/* Aspect Ratio Target Hint */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-800">
              Target Delivery Aspect Ratio
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['16:9', '9:16', '1:1', '4:5'].map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatioHint(ratio)}
                  className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    aspectRatioHint === ratio
                      ? 'border-[#6D5EF7] bg-[#EEEAFE] text-[#5848E5]'
                      : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={loading || !prompt.trim()}
            onClick={handleGenerate}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#6D5EF7] to-[#8C7EFF] hover:from-[#5848E5] hover:to-[#6D5EF7] text-white font-bold text-xs tracking-wider uppercase transition-all shadow-md shadow-[#6D5EF7]/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                <span>Extracting Creative Brief Schema...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-300" />
                <span>Generate Creative Brief with AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Structured & Editable Brief Editor */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 shadow-xs space-y-6 text-left">
          {!generatedData && !loading ? (
            /* Pre-generation empty state */
            <div className="p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#EEEAFE] text-[#6D5EF7] flex items-center justify-center mx-auto">
                <Wand2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Awaiting Creative Prompt
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                Click "Generate Creative Brief with AI" on the left to extract structured deliverables, visual styles, and licensing requirements.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-950 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <span>Structured Brief (Editable)</span>
                  </h3>
                  <p className="text-xs text-gray-400">
                    Review and tailor every field before publishing to persistent storage.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveBrief('DRAFT')}
                    className="px-3.5 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleSaveBrief('PUBLISHED')}
                    className="px-4 py-2 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all shadow-md shadow-[#6D5EF7]/20 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{saving ? 'Saving...' : 'Publish Brief'}</span>
                  </button>
                </div>
              </div>

              {/* Missing Information Banner (Mandatory Rule) */}
              {missingInfo.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold text-amber-950">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Required User Review: Unspecified Requirements Detected</span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    The AI engine never invents unconfirmed campaign rules. Please verify the following highlighted fields below:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-[11px] text-amber-900 font-medium">
                    {missingInfo.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Campaign Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-900 focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE]"
                  />
                </div>

                {/* Objective */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Campaign Objective
                  </label>
                  <textarea
                    rows={2}
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE] leading-relaxed"
                  />
                </div>

                {/* Content Types Selector */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Requested Deliverable Content Types
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'video', label: 'Video / Commercial' },
                      { id: 'animation', label: 'Animation' },
                      { id: 'image', label: 'Image Stills' },
                      { id: 'motion_graphics', label: 'Motion Graphics' },
                      { id: '3d_gen', label: '3D Character Gen' },
                    ].map((ct) => (
                      <button
                        key={ct.id}
                        type="button"
                        onClick={() => toggleContentType(ct.id)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          contentTypes.includes(ct.id)
                            ? 'bg-[#EEEAFE] border-[#6D5EF7] text-[#5848E5]'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Style & Aspect Ratio Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Visual Direction & Style
                    </label>
                    <input
                      type="text"
                      value={visualStyle}
                      onChange={(e) => setVisualStyle(e.target.value)}
                      placeholder="e.g. Cinematic Sci-Fi, Photorealistic Minimal"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Aspect Ratio
                    </label>
                    <select
                      value={aspectRatio}
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                    >
                      <option value="16:9">16:9 (Widescreen / YouTube)</option>
                      <option value="9:16">9:16 (Vertical / Reels / TikTok)</option>
                      <option value="1:1">1:1 (Square / Feed)</option>
                      <option value="4:5">4:5 (Portrait / Fashion)</option>
                    </select>
                  </div>
                </div>

                {/* Output Format & Quantity */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Output Delivery Format
                    </label>
                    <input
                      type="text"
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      placeholder="e.g. ProRes 422 HQ, MP4 4K, Uncompressed PNG"
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Deliverables Quantity
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>
                </div>

                {/* Target Audience */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target Audience
                  </label>
                  <input
                    type="text"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    placeholder="e.g. High-net-worth automotive enthusiasts, Gen-Z conscious skincare buyers"
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7]"
                  />
                </div>

                {/* Commercial Use & Licensing */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-gray-900">
                        Commercial-Use Rights Required
                      </span>
                      <span className="block text-[11px] text-gray-500">
                        Work must be licensed for commercial brand marketing.
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={commercialUseRequired}
                      onChange={(e) => setCommercialUseRequired(e.target.checked)}
                      className="w-4 h-4 text-[#6D5EF7] rounded cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-700 mb-1">
                      Licensing Terms & Distribution Scope
                    </label>
                    <input
                      type="text"
                      value={licensingRequirements}
                      onChange={(e) => setLicensingRequirements(e.target.value)}
                      placeholder="e.g. Full global digital commercial rights across paid social and web"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-[#6D5EF7]"
                    />
                  </div>
                </div>

                {/* AI Pipeline Recommendation Note */}
                {aiSuggestions?.recommended_tools && (
                  <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 text-[#6D5EF7] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block text-indigo-950">
                        Recommended AI Generation Pipelines:
                      </span>
                      <span className="text-[11px] text-indigo-800">
                        {aiSuggestions.recommended_tools}. {aiSuggestions.production_note}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
