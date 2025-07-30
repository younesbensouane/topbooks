import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api';

export default function EditPost() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // form state
  const [id, setId] = useState(null);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');

  // ui state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // load the post by slug
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/posts/${slug}`)
      .then(res => {
        if (cancelled) return;
        const p = res.data;
        setId(p._id);
        setTitle(p.title || '');
        setImageUrl(p.imageUrl || '');
        setContent(p.content || '');
        setTags(Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || ''));
        setStatus(p.status || 'published');
      })
      .catch(err => !cancelled && setError(err.message || 'Failed to load post'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [slug]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const payload = { title, content, imageUrl, status, tags }; // tags can be comma string; backend splits
      const res = await api.put(`/posts/${id}`, payload);
      // backend regenerates slug if title changed; navigate to the new slug
      navigate(`/post/${res.data.slug}`);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  }

  // optional: delete button
  async function handleDelete() {
    if (!id) return;
    const yes = window.confirm('Delete this post? This cannot be undone.');
    if (!yes) return;
    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  if (loading) return <div className="container py-8">Loading…</div>;
  if (error)   return <div className="container py-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <div className="flex items-center gap-3">
          <Link to={`/post/${slug}`} className="text-sm underline">← Back</Link>
          <button onClick={handleDelete} className="btn btn-ghost">Delete</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            className="input-base mt-1"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <label className="block text-sm font-medium mt-4">Image URL</label>
          <input
            className="input-base mt-1"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            placeholder="https://example.com/cover.jpg"
          />

          {/* tiny live cover preview */}
          {imageUrl && (
            <div className="mt-2">
              <div className="relative aspect-[2/3] w-28 rounded overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
                <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-black/10 mix-blend-multiply opacity-20" />
              </div>
            </div>
          )}

          <label className="block text-sm font-medium mt-4">Content (Markdown)</label>
          <textarea
            className="input-base mt-1 h-72"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium">Tags (comma separated)</label>
              <input
                className="input-base mt-1"
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="self-help, productivity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                className="input-base mt-1"
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
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>

        <div>
          <div className="text-sm font-medium mb-2">Live Preview</div>
          <div className="card prose max-w-none dark:bg-gray-900 dark:border-gray-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
        </div>
      </form>
    </div>
  );
}
