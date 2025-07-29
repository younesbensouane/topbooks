import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api';

export default function CreatePost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState(`# Welcome to TopBooks

Write your **book note** or **review** here.
- Supports *Markdown*
- Live preview on the right`);
  const [tags, setTags] = useState('self-help, productivity');
  const [status, setStatus] = useState('published');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api.post('/posts', { title, content, tags, status });
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Create New Post</h1>
        <Link to="/" className="text-sm underline">← Back</Link>
      </div>

      {error && <p className="text-red-600 mb-4">Error: {error}</p>}

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="w-full rounded-md border-gray-300 focus:border-brand-600 focus:ring-brand-600 mt-1"
            placeholder="e.g., The 7 Habits of Highly Effective People"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <label className="block text-sm font-medium mt-4">Content (Markdown)</label>
          <textarea
            className="w-full rounded-md border-gray-300 focus:border-brand-600 focus:ring-brand-600 mt-1 h-72"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Tags (comma separated)</label>
              <input
                className="w-full rounded-md border-gray-300 focus:border-brand-600 focus:ring-brand-600 mt-1"
                placeholder="self-help, productivity"
                value={tags}
                onChange={e => setTags(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="w-full rounded-md border-gray-300 focus:border-brand-600 focus:ring-brand-600 mt-1"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="published">published</option>
                <option value="draft">draft</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-5 btn btn-primary disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Publish'}
          </button>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Live Preview</div>
          <div className="card prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </form>
    </div>
  );
}
