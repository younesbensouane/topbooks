import { useEffect, useState } from 'react';
import api from '../api';

export default function Filters({ search, setSearch, selectedTags, setSelectedTags, onApply }) {
  const [allTags, setAllTags] = useState([]);
  const [loadingTags, setLoadingTags] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoadingTags(true);
    api.get('/posts/tags')
      .then(res => { if (!cancelled) setAllTags(res.data || []); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoadingTags(false); });
    return () => { cancelled = true; };
  }, []);

  function toggleTag(tag) {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  }

  function clearAll() {
    setSearch('');
    setSelectedTags([]);
    onApply({ search: '', selectedTags: [] });
  }

  return (
    <div className="card">
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <input
            className="input-base mt-1 w-full rounded-md border-gray-300 focus:border-brand-600 focus:ring-brand-600"
            placeholder="Search by title or content…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <span className="block text-sm font-medium text-gray-700">Tags</span>
            {loadingTags && <span className="text-xs text-gray-500">Loading tags…</span>}
          </div>

          <div className="mt-1 flex flex-wrap gap-2">
            {allTags.length === 0 && !loadingTags && (
              <span className="text-sm text-gray-500">No tags yet</span>
            )}
            {allTags.map(tag => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`text-sm rounded-full px-3 py-1 border ${active ? 'bg-brand-600 text-white border-brand-600' : 'hover:bg-gray-50 border-gray-200'}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => onApply({ search, selectedTags })}
          className="btn btn-primary"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={clearAll}
          className="btn btn-ghost"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
