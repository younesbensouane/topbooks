import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import api from '../api';

export default function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    api.get(`/posts/${slug}`)
      .then(res => { if (!cancelled) setBook(res.data); })
      .catch(err => { if (!cancelled) setError(err.message || 'Request failed'); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) return <p className="container py-8">Loading…</p>;
  if (error) return <p className="container py-8 text-red-600">Error: {error}</p>;
  if (!book) return <p className="container py-8">Not found.</p>;

  return (
    <div className="container py-8">
      <Link to="/" className="text-sm underline">← Back</Link>
      {book.imageUrl && (
  <div className="mx-auto my-4 max-w-sm">
    <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
      <img src={book.imageUrl} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-black/10 mix-blend-multiply opacity-20" />
    </div>
  </div>
)}
      <h1 className="text-3xl font-bold mt-3">{book.title}</h1>
      <div className="mt-6 prose prose-gray max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {book.content}
        </ReactMarkdown>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {(book.tags || []).map(tag => (
          <span key={tag} className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
