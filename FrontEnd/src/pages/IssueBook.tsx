import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
import Navbar from "../components/Navbar";

export default function IssueBook() {
  const [bookId, setBookId] = useState("");
  const [bookDetails, setBookDetails] = useState<any>({
    title: "",
    image: "",
    is_issued: 0,
  });
  const [bookError, setBookError] = useState<any>("");
  const [userError, setUserError] = useState<any>("");
  const [userId, setUserId] = useState("");
  const [userDetails, setUserDetails] = useState<any>({
    full_name: "",
    email: "",
    book_issued_count: "",
  });
  const [bookIssued, setBookIssued] = useState<any>(null);
  const [issueError, setIssueError] = useState<string>("");

  const issueDate = new Date().toISOString().split("T")[0];
  const defaultReturnDate = new Date();
  defaultReturnDate.setDate(defaultReturnDate.getDate() + 21);
  const formattedReturnDate = defaultReturnDate.toISOString().split("T")[0];
  const [dueDate, setDueDate] = useState(formattedReturnDate);

  useEffect(() => {
    if (bookIssued !== null) {
      const timer = setTimeout(() => {
        setBookIssued(null);
        setIssueError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [bookIssued]);

  useEffect(() => {
    setIssueError("");
    setBookIssued(null);
  }, [bookId, userId]);

  const fetchBook = async () => {
    try {
      setBookError("");
      let data = await fetch(`${backendUrl}/book/getsinglebookdata`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookid: parseInt(bookId),
        }),
      });
      let response = await data.json();
      if (data.status === 200) {
        setBookDetails({
          title: response.title,
          image: response.imageurl,
          is_issued: response.is_issued,
        });
      } else if (data.status === 404) {
        setBookDetails({ title: "", image: "", is_issued: 0 });
        setBookError(response.error || "Book not found");
      }
    } catch (error) {
      alert(error);
    }
  };

  const fetchUser = async () => {
    try {
      setUserError("");
      let data = await fetch(`${backendUrl}/user/getuserdetails/${userId}`);
      let response = await data.json();
      if (data.status === 200) {
        setUserDetails({
          full_name: response.full_name,
          email: response.email,
          book_issued_count: response.books_issued_count,
        });
      } else if (data.status === 404) {
        setUserDetails({ full_name: "", email: "", book_issued_count: "" });
        setUserError(response.error || "User not found");
      }
    } catch (error) {
      setUserError(error);
    }
  };

  const handleIssue = async () => {
    if (!userDetails || !bookDetails || !dueDate) {
      alert("Fill all required fields");
      return;
    }

    // Prevent issuing if book already issued
    if (bookDetails.is_issued === 1) {
      setIssueError("Cannot issue this book because it is already issued.");
      setBookIssued(false);
      return;
    }

    try {
      console.log("insinde issue");
      const data = await fetch(`${backendUrl}/book/issuebook`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookid: parseInt(bookId),
          userid: parseInt(userId),
          issueDate,
          dueDate,
        }),
      });

      const response = await data.json();
      console.log(response);
      if (data.status === 400) {
        setBookIssued(false);
        setIssueError(response.error || "Book is already issued to someone.");
      } else if (data.status === 200 || data.status === 201) {
        setBookIssued(true);
        setIssueError("");

        setBookId("");
        setBookDetails({ title: "", image: "", is_issued: 0 });
        setUserId("");
        setUserDetails({ full_name: "", email: "", book_issued_count: "" });
        setDueDate(formattedReturnDate);
        setBookError("");
        setUserError("");
      } else {
        setBookIssued(false);
        setIssueError("Failed to issue book due to unknown error.");
      }
    } catch (error) {
      console.error("Issue error:", error);
      setBookIssued(false);
      setIssueError("Network or server error. Please try again later.");
    }
  };

  const fieldsEnabled =
    bookDetails?.title?.trim() !== "" &&
    userDetails?.full_name?.trim() !== "" &&
    parseInt(userDetails?.book_issued_count) < 5 &&
    bookDetails.is_issued === 0;

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-md w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center">Issue a Book</h2>

          {/* Book ID + Fetch Button */}
          <div>
            <label className="block mb-1">Book ID</label>
            <div className="flex space-x-2">
              <input
                type="text"
                className="w-full p-2 rounded bg-gray-700 text-white"
                placeholder="Enter Book ID"
                value={bookId}
                onChange={(e) => setBookId(e.target.value)}
              />
              <button
                onClick={fetchBook}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
              >
                Fetch
              </button>
            </div>
            {bookError && (
              <div className="bg-red-700 mt-2 text-white p-2 rounded text-sm">
                {bookError}
              </div>
            )}
          </div>

          {/* Book Title Display */}
          {bookDetails && bookDetails.title && (
            <div className="p-3 bg-gray-700 rounded space-y-1">
              <div>
                <strong>Title:</strong> {bookDetails.title}
              </div>
              {bookDetails.is_issued === 1 && (
                <div className="bg-yellow-600 text-black p-2 rounded mt-2 text-center font-semibold">
                  ⚠️ This book is currently issued to someone and may not be available.
                </div>
              )}
            </div>
          )}

          {/* Image Placeholder */}
          <div className="w-full h-40 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
            {bookDetails?.image ? (
              <img
                src={bookDetails.image}
                alt="Book Cover"
                className="h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">Book Image Preview</span>
            )}
          </div>

          {/* User ID + Fetch Button */}
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
                onClick={fetchUser}
                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
              >
                Fetch
              </button>
            </div>
            {userError && (
              <div className="bg-red-700 mt-2 text-white p-2 rounded text-sm">
                {userError}
              </div>
            )}
            {parseInt(userDetails?.book_issued_count) >= 5 && (
              <div className="bg-yellow-700 text-white text-sm p-2 rounded mt-2">
                This user has already issued 5 books and cannot issue more.
              </div>
            )}
          </div>

          {/* User Details */}
          {userDetails && userDetails.full_name && (
            <div className="bg-gray-700 p-4 rounded mt-2 space-y-1">
              <div>
                <strong>Name:</strong> {userDetails.full_name}
              </div>
              <div>
                <strong>Email:</strong> {userDetails.email}
              </div>
              <div>
                <strong>Books Issued:</strong> {userDetails.book_issued_count}
              </div>
            </div>
          )}

          {/* Date Fields */}
          <div className="space-y-3">
            <div>
              <label className="block mb-1">Issue Date</label>
              <input
                type="date"
                className={`w-full p-2 rounded bg-gray-700 text-white transition-opacity duration-300 ${
                  fieldsEnabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
                }`}
                value={issueDate}
                readOnly
              />
            </div>

            <div>
              <label className="block mb-1">Due Date</label>
              <input
                type="date"
                className={`w-full p-2 rounded bg-gray-700 text-white transition-opacity duration-300 ${
                  fieldsEnabled ? "opacity-100" : "opacity-50 cursor-not-allowed"
                }`}
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                disabled={!fieldsEnabled}
              />
            </div>

            <button
              onClick={handleIssue}
              className={`w-full py-2 rounded ${
                fieldsEnabled
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
              disabled={!fieldsEnabled}
            >
              Issue Book
            </button>
          </div>

          {/* Success/Error messages */}
          {bookIssued === true && (
            <div className="bg-green-700 mt-2 text-white p-2 rounded text-sm text-center">
              Book issued successfully!
            </div>
          )}

          {bookIssued === false && issueError && (
            <div className="bg-red-700 mt-2 text-white p-2 rounded text-sm text-center">
              {issueError}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
