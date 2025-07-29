import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <Link to={`/post/${book.slug}`} className="block">
      <div className="card h-full">
        <h3 className="text-lg font-semibold">{book.title}</h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3">
          {book.content?.slice(0, 160)}{book.content?.length > 160 ? '…' : ''}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {(book.tags || []).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full border bg-gray-50 text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
