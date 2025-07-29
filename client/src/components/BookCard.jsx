import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <Link to={`/post/${book.slug}`} className="block">
      <div className="card h-full flex flex-col">
        {/* BOOK COVER (2:3 portrait) */}
        <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {book.imageUrl ? (
            <img
              src={book.imageUrl}
              alt={book.title}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">📚 No Image</div>
          )}
          {/* subtle spine shadow on the left */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-black/10 mix-blend-multiply opacity-20" />
        </div>

        {/* TEXT */}
        <div className="mt-3 flex-1">
          <h3 className="text-lg font-semibold">{book.title}</h3>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {book.content?.slice(0, 160)}{book.content?.length > 160 ? '…' : ''}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {(book.tags || []).map(tag => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full border bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
