import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Sparkles, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { api } from '../services/api';
import { CreatorCard } from '../components/common/CreatorCard';

export function DiscoveryPage({ onSelectCreator }) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedContentType, setSelectedContentType] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [total, setTotal] = useState(0);

  // Filter options from API
  const [availableSkills, setAvailableSkills] = useState([]);
  const [availableTools, setAvailableTools] = useState([]);

  useEffect(() => {
    // Fetch filter catalogs
    Promise.all([api.getSkills(), api.getTools()])
      .then(([skills, tools]) => {
        setAvailableSkills(skills || []);
        setAvailableTools(tools || []);
      })
      .catch((err) => console.error('Failed to load filter catalogs:', err));
  }, []);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const res = await api.searchCreators({
        q: searchQuery,
        tool: selectedTool,
        skill: selectedSkill,
        content_type: selectedContentType,
        verified_only: verifiedOnly ? true : undefined,
      });
      setCreators(res.creators || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreators();
  }, [selectedTool, selectedSkill, selectedContentType, verifiedOnly]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCreators();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedTool('');
    setSelectedSkill('');
    setSelectedContentType('');
    setVerifiedOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedTool || selectedSkill || selectedContentType || verifiedOnly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-left space-y-2">
        <h1 className="text-3xl font-black text-gray-950 tracking-tight">
          Discover AI Creators
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl">
          Search specialized AI filmmakers, animators, and generative artists by production workflows, AI models, and commercial readiness.
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200/90 shadow-xs space-y-4">
        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by creator name, style, bio, or keywords (e.g. Elena, Cinematic, Automotive)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#6D5EF7] focus:ring-2 focus:ring-[#EEEAFE]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search</span>
          </button>
        </form>

        {/* Filter Dropdowns & Toggles */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-gray-100 text-xs">
          {/* Tool Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Sparkles className="w-3.5 h-3.5 text-[#6D5EF7]" />
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">All AI Tools & Models</option>
              {availableTools.map((t) => (
                <option key={t.id} value={t.name}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <Layers className="w-3.5 h-3.5 text-[#6D5EF7]" />
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">All Skills</option>
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content Type Filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
            <select
              value={selectedContentType}
              onChange={(e) => setSelectedContentType(e.target.value)}
              className="bg-transparent text-xs font-medium text-gray-700 focus:outline-none cursor-pointer"
            >
              <option value="">All Content Types</option>
              <option value="video">Video & Film</option>
              <option value="animation">Animation & Motion</option>
              <option value="image">Image & Graphic</option>
              <option value="motion_graphics">Motion Graphics</option>
            </select>
          </div>

          {/* Verified Toggle */}
          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              verifiedOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-bold'
                : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ShieldCheck className={`w-3.5 h-3.5 ${verifiedOnly ? 'text-emerald-600' : 'text-gray-400'}`} />
            <span>Verified Creators Only</span>
          </button>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1 cursor-pointer py-1.5 px-2 rounded-lg hover:bg-gray-100"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Active Filters Pill Bar */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mr-1">
              Active:
            </span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                Keyword: "{searchQuery}"
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setSearchQuery('')} />
              </span>
            )}
            {selectedTool && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEEAFE] text-[#5848E5] text-xs font-medium">
                Tool: {selectedTool}
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setSelectedTool('')} />
              </span>
            )}
            {selectedSkill && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEEAFE] text-[#5848E5] text-xs font-medium">
                Skill: {selectedSkill}
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setSelectedSkill('')} />
              </span>
            )}
            {selectedContentType && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EEEAFE] text-[#5848E5] text-xs font-medium capitalize">
                Type: {selectedContentType}
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setSelectedContentType('')} />
              </span>
            )}
            {verifiedOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-medium">
                Verified Only
                <X className="w-3 h-3 cursor-pointer hover:text-black" onClick={() => setVerifiedOnly(false)} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <p>
          Showing <span className="font-bold text-gray-900">{total}</span> AI creators
        </p>
      </div>

      {/* Creators Grid / Loading / Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl border border-gray-200 p-4 space-y-4 animate-pulse">
              <div className="aspect-16/10 bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded-md w-3/4" />
              <div className="h-3 bg-gray-200 rounded-md w-1/2" />
              <div className="h-8 bg-gray-100 rounded-lg w-full" />
            </div>
          ))}
        </div>
      ) : creators.length === 0 ? (
        /* Empty State */
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            No creators match these filters
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Try broadening your search keywords or resetting active tool and content filters to discover more talent.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#6D5EF7] hover:bg-[#5848E5] text-white text-xs font-bold transition-all cursor-pointer"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onSelect={onSelectCreator}
            />
          ))}
        </div>
      )}
    </div>
  );
}
