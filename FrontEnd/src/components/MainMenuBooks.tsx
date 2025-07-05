import { Link } from "react-router-dom";

interface Book {
  is_issued: any;
  id: string;
  title: string;
  category: string;
  author?: string;
  imageurl?: string;
  average_rating?: string;
}

interface MainMenuBooksProps {
  currentState: string;
  books: Book[];
  categoryChangeValue: string;
}

export default function MainMenuBooks({
  currentState,
  books,
  categoryChangeValue,
}: MainMenuBooksProps) {
  console.log(books);
  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        {categoryChangeValue !== ""
          ? `📚 ${categoryChangeValue}`
          : "🔍 All Books "}
      </h1>

      {currentState === "books" && (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {books.map((book, index) => (
              <div
                key={book.id}
                className="flex flex-col justify-between w-full h-96 pt-2 rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 bg-white"
              >
                {book.imageurl && (
                  <img
                    src={book.imageurl}
                    alt={book.title}
                    className="w-full h-50 object-contain"
                  />
                )}

                <div className="flex flex-col justify-between h-full p-3">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {book.title}
                  </h3>
                  <span className="text-sm text-gray-800 truncate">
                    Average Rating :{" "}
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {book.average_rating}
                    </span>
                  </span>
                  <span className="text-sm text-gray-800 truncate">
                    Book ID :{" "}
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {book.id}
                    </span>
                  </span>
                  <p className="text-xs text-gray-500 mt-1 truncate">
                    📁 {book.category}
                  </p>
                  {book.author && (
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      ✍️ {book.author}
                    </p>
                  )}
                  {book.is_issued ? (
                    <div className="bg-red-600 text-center px-3 py-1 rounded text-white">
                      Already Issued
                    </div>
                  ) : (
                    <Link to={`/issuebook/${book.id}`} className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white text-center">
                      Issue Book
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
