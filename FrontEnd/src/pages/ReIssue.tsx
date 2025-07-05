import {  useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Navbar from "../components/Navbar";

export default function ReturnBook() {
  const [userId, setUserId] = useState("");
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [error, setError] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const [reissueStatus, setReissueStatus] = useState<null | "success" | "fail" | "ReIssueFailed">(
    null
  );

  const fetchIssuedBooks = async () => {
    setSelectedBook(null);
    setReissueStatus(null);
    setError("");
    setUserName("");
    setUserEmail("");

    try {
      const response = await fetch(
        `${backendUrl}/user/getissuedbooks/${userId}`
      );
      const data = await response.json();

      console.log(data);

      if (response.status === 400) {
        setError("The user ID doesn't exist.");
        return;
      }

      if (response.status === 200) {
        setIssuedBooks(data);

        if (data.length > 0) {
          setUserName(data[0].full_name);
          setUserEmail(data[0].email);
          setError(""); // clear any previous error
        } else {
          setError("No books currently issued to this user.");
        }
      } else {
        setError(data.error || "Failed to fetch issued books.");
        setIssuedBooks([]);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Server error while fetching issued books.");
    }
  };

  const handleReIssue = async () => {
  try {
    const response = await fetch(`${backendUrl}/book/reissuebook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userid: parseInt(userId),
        bookid: selectedBook.book_id,
      }),
    });

    if (response.status === 200) {
      const updatedDueDate = new Date(selectedBook.due_date);
      updatedDueDate.setDate(updatedDueDate.getDate() + 14);

      const updatedBook = {
        ...selectedBook,
        due_date: updatedDueDate.toISOString(),
      };
      setSelectedBook(updatedBook);

      setIssuedBooks((prev) =>
        prev.map((book) =>
          book.book_id === selectedBook.book_id
            ? { ...book, due_date: updatedDueDate.toISOString() }
            : book
        )
      );

      setReissueStatus("success");
    } else if(response.status == 400){
        setReissueStatus('ReIssueFailed')
    }else {
      setReissueStatus("fail");
    }
  } catch (err) {
    setReissueStatus("fail");
  }
};


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-8">
        <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl shadow-lg space-y-6">
          <h2 className="text-2xl font-bold text-center">Re-Issue a Book</h2>

          {/* User ID Input */}
          <div>
            <label className="block mb-1">User ID</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Enter User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <button
                onClick={fetchIssuedBooks}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
              >
                Fetch
              </button>
            </div>
          </div>

          {userName && userEmail && (
            <div className="bg-gray-700 p-4 rounded space-y-1">
              <div>
                <strong>User:</strong> {userName}
              </div>
              <div>
                <strong>Email:</strong> {userEmail}
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-700 p-2 rounded text-sm">{error}</div>
          )}

          {/* List of Issued Books */}
          {issuedBooks.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Issued Books:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {issuedBooks.map((book) => (
                  <div
                    key={book.book_id}
                    onClick={() => {setSelectedBook(book),setReissueStatus(null)}}
                    className={`p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 ${
                      selectedBook?.book_id === book.book_id
                        ? "ring-2 ring-blue-400"
                        : ""
                    }`}
                  >
                    <div className="font-medium">{book.title}</div>
                    <div className="text-sm text-gray-300">
                      Due: {new Date(book.due_date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Book Details */}
          {selectedBook && (
            <div className="bg-gray-700 p-4 rounded mt-4 space-y-2">
              <h3 className="text-lg font-semibold text-white">
                Selected Book
              </h3>
              <div>
                <strong>Title:</strong> {selectedBook.title}
              </div>
              <div>
                <strong>Issue Date:</strong>{" "}
                {new Date(selectedBook.issued_date).toLocaleDateString()}
              </div>
              <div>
                <strong>Due Date:</strong>{" "}
                {new Date(selectedBook.due_date).toLocaleDateString()}
              </div>
              <button
                onClick={handleReIssue}
                className="w-full mt-4 bg-green-600 hover:bg-green-500 py-2 rounded"
              >
                Re Issue Book for 2 weeks
              </button>
            </div>
          )}

          {/* Return Status Message */}
          {reissueStatus === "success" && (
            <div className="bg-green-700 p-2 mt-2 rounded text-center text-sm">
              Book Re-Issued successfully.
            </div>
          )}
          {reissueStatus === "fail" && (
            <div className="bg-red-700 p-2 mt-2 rounded text-center text-sm">
              Failed to Re-Issue book.
            </div>
          )}

          {reissueStatus === "ReIssueFailed" && (
            <div className="bg-red-700 p-2 mt-2 rounded text-center text-sm">
              Cant Re-Issue a book if already re-issued for more than 2 months
            </div>
          )}
        </div>
      </div>
    </>
  );
}
