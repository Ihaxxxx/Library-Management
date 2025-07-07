import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import {
  Label,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const MenuButtons = [{ label: "Returned" }, { label: "Not Returned" }];

interface userDetails {
  id: any;
  full_name: string;
  email: string;
  created_at: string;
}
export interface BookDetails {
  authors: string; // e.g., "J.K. Rowling, Mary GrandPré"
  book_id: number;
  category: string;
  created_at: string; // ISO date string
  due_date: string; // ISO date string
  due_status: "Not Due" | "Overdue";
  fine_amount: number | null;
  fine_status: "paid" | "unpaid" | null;
  imageurl: string;
  isbn: string;
  issued_book_id: number;
  issued_date: string; // ISO date string
  published_year: number;
  return_status: "Returned" | "Not Returned";
  returned_date: string | null; // ISO date string or null
  title: string;
}

export default function UserDetails() {
  const [userDetails, setUserDetails] = useState<userDetails | null>(null);
  const [booksDetails, setBooksDetails] = useState<BookDetails[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [viewState, setViewState] = useState<
    "Returned" | "Not Returned" | "All"
  >("All");

  const { userid } = useParams();
  useEffect(() => {
    async function loadData(userid: any) {
      let data = await fetch(`${backendUrl}/user/getspecificuser/${userid}`);
      let response = await data.json();
      console.log(response);
      setUserDetails({
        id: response[0].user_id,
        full_name: response[0].full_name,
        email: response[0].email,
        created_at: new Date(response[0].created_at).toISOString().slice(0, 10),
      });
      const formattedBooks = response.map((book: any) => ({
        authors: book.authors,
        book_id: book.book_id,
        category: book.category,
        created_at: new Date(book.created_at).toISOString().slice(0, 10),
        due_date: new Date(book.due_date).toISOString().slice(0, 10),
        due_status: book.due_status,
        fine_amount: book.fine_amount,
        fine_status: book.fine_status,
        imageurl: book.imageurl,
        isbn: book.isbn,
        issued_book_id: book.issued_book_id,
        issued_date: new Date(book.issued_date).toISOString().slice(0, 10),
        published_year: book.published_year,
        return_status: book.return_status,
        returned_date: book.returned_date
          ? new Date(book.returned_date).toISOString().slice(0, 10)
          : null,
        title: book.title,
      }));
      setBooksDetails(formattedBooks);
      setDataLoaded(true);
    }
    loadData(userid);
  }, []);

  useEffect(() => {
    console.log(booksDetails);
  }, [booksDetails]);

  const filteredBooks =
    viewState === "All"
      ? booksDetails
      : booksDetails.filter((book) => book.return_status === viewState);

  if (!dataLoaded) {
    return (
      <>
        <Navbar></Navbar>
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar></Navbar>
      <div className="flex h-screen">
        {/* Left Container */}
        <div className="w-full md:w-1/2 bg-blue-50 p-6 rounded-xl shadow-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            User Details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={userDetails!.full_name}
                readOnly
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md shadow-sm text-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={userDetails!.email}
                readOnly
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md shadow-sm text-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                User ID
              </label>
              <input
                type="text"
                value={userDetails!.id}
                readOnly
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md shadow-sm text-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Created At
              </label>
              <input
                type="text"
                value={new Date(userDetails!.created_at).toLocaleString()}
                readOnly
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md shadow-sm text-blue-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">
                Number of Books Issued
              </label>
              <input
                type="text"
                value={booksDetails.length}
                readOnly
                className="w-full px-4 py-2 bg-white border border-blue-300 rounded-md shadow-sm text-blue-900"
              />
            </div>
          </div>
        </div>

        {/* Right Container */}
        <div className="w-full sm:w-3/4 lg:w-1/2 mx-auto bg-green-50 p-6 rounded-xl shadow-md">
          {/* Dropdown */}
          <Menu
            as="div"
            className="relative inline-block text-left w-full mb-6"
          >
            <div>
              <MenuButton className="inline-flex w-full justify-between items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none">
                {viewState ? viewState : "Select The Status Of Books"}
                <ChevronDownIcon
                  className="size-5 text-gray-400"
                  aria-hidden="true"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-20 mt-2 w-full sm:w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/10 focus:outline-none overflow-hidden"
            >
              <div className="py-1">
                {["Returned", "Not Returned", "All"].map((status) => (
                  <MenuItem key={status}>
                    <button
                      // type="button"
                      onClick={() =>
                        setViewState(status as "Returned" | "Not Returned")
                      }
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-100 hover:text-gray-900"
                    >
                      {status}
                    </button>
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Menu>

          {/* Book List */}
          <div className="w-full">
            {filteredBooks.length === 0 ? (
              <p className="text-gray-500 text-center italic">
                No books found.
              </p>
            ) : (
              <ul className="space-y-4">
                {filteredBooks.map((book) => (
                  <li
                    key={book.issued_book_id}
                    className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center"
                  >
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-gray-900">
                        {book.title}
                      </p>
                      <p className="text-sm text-gray-600">by {book.authors}</p>
                      <p className="text-sm text-gray-500">
                        Return Status:{" "}
                        <span
                          className={`font-semibold ${
                            book.return_status === "Returned"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {book.return_status}
                        </span>
                      </p>
                    </div>
                    <img
                      src={book.imageurl}
                      alt={book.title}
                      className="w-20 h-28 object-cover mt-4 sm:mt-0 sm:ml-6 rounded-md border border-gray-200 shadow"
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
