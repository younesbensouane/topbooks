import { useEffect, useState } from 'react';
import api from '../api';
import BookCard from '../components/BookCard';
import Filters from '../components/Filters';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function fetchPosts(vars = {}) {
    const params = {
      status: 'published',
      search: vars.search ?? search,
      tags: (vars.selectedTags ?? selectedTags).join(','),
      page: vars.page ?? page,
      limit: vars.limit ?? limit,
    };

    setLoading(true);
    setError(null);

    api.get('/posts', { params })
      .then(res => {
        const payload = res.data;
        setPosts(payload.data || []);
        setPage(payload.page || 1);
        setLimit(payload.limit || 6);
        setTotal(payload.total || 0);
        setTotalPages(payload.totalPages || 1);
      })
      .catch(err => setError(err.message || 'Request failed'))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchPosts({ page: 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleApply({ search: s, selectedTags: t }) {
    setSearch(s);
    setSelectedTags(t);
    setPage(1);
    fetchPosts({ search: s, selectedTags: t, page: 1 });
  }

  function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    fetchPosts({ page: newPage });
  }

  return (
    <section className="container pb-12">
      <h2 className="text-2xl font-bold mb-6">📚 Book Collection</h2>

      <Filters
        search={search}
        setSearch={setSearch}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onApply={handleApply}
      />

      {loading && <p className="text-gray-500 mt-6">Loading…</p>}
      {error && <p className="text-red-600 mt-6">Failed to load posts: {error}</p>}

      {!loading && !error && (
        posts.length === 0 ? (
          <p className="text-gray-500 mt-6">No books match your filters.</p>
        ) : (
          <>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map(b => <BookCard key={b._id} book={b} />)}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Page {page} of {totalPages} — {total} items
              </div>
              <div className="flex gap-2">
                <button
                  className="btn btn-ghost disabled:opacity-50"
                  onClick={() => changePage(page - 1)}
                  disabled={page <= 1}
                >
                  ← Prev
                </button>
                <button
                  className="btn btn-ghost disabled:opacity-50"
                  onClick={() => changePage(page + 1)}
                  disabled={page >= totalPages}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )
      )}
    </section>
  );
}
