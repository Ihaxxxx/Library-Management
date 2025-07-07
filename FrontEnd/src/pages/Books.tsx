import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Pagination from "../components/Pagination";
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import MainMenuBooks from "../components/MainMenuBooks";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

function Books() {
  const [numberOfPages, setNumberOfPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [books, setBooks] = useState<any[]>([]);
  const [bookCount, setBookCount] = useState<number>(0);
  const [loadData, setLoadData] = useState<boolean>(false);
  const [currentState, setCurrentState] = useState("books");
  const [categories, setCategories] = useState<any[]>([]);
  const [booksPerPageSize, setBooksPerPageSize] = useState(50);
  const [categoryChangeValue, setCategoryChangeValue] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rating" | "id">("rating");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchBooks() {
      let data = await fetch(`${backendUrl}/book/getallbooksdata`);
      let response = await data.json();
      console.log(response);
      // console.log(response.totalBooks);
      setBookCount(response.totalBooks);
      console.log(Math.floor(response.totalBooks / booksPerPageSize) + 1);
      setNumberOfPages(Math.floor(response.totalBooks / booksPerPageSize) + 1);
      setLoadData(true);

      //   setting categories
      const newCategories = [...categories];
      response.categories.forEach((book: any) => {
        if (!newCategories.includes(book.category)) {
          newCategories.push(book.category);
        }
      });
      setCategories(newCategories);
      console.log("saari book agai");
    }
    fetchBooks();
  }, []);

  useEffect(() => {
    setLoadData(false);
    setNumberOfPages(Math.floor(bookCount / booksPerPageSize) + 1);
    async function fetchBooks() {
      let offset = 0;
      if (pageNumber == 1) {
        offset = 0;
      } else {
        offset = (pageNumber - 1) * booksPerPageSize;
      }
      let data = await fetch(`${backendUrl}/book/getspecificbooksdata`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offset,
          limit: booksPerPageSize,
          category: categoryChangeValue,
          sortBy,
          orderDirection,
        }),
      });
      let response = await data.json();
      console.log(response);
      if ("categoryCount" in response[0]) {
        console.log("meow");
        setBookCount(response.categoryCount);
        setNumberOfPages(
          Math.floor(response[0].categoryCount / booksPerPageSize) + 1
        );
        setBooks(response);
      } else {
        console.log("going back to books");
        setBookCount(response.categoryCount);
        setNumberOfPages(
          Math.floor(response[0].categoryCount / booksPerPageSize) + 1
        );
        setBooks(response);
      }
      setLoadData(true);
    }
    fetchBooks();
  }, [
    pageNumber,
    booksPerPageSize,
    categoryChangeValue,
    sortBy,
    orderDirection,
  ]);

  useEffect(() => {
    console.log(categoryChangeValue);
  }, [categoryChangeValue]);

  return (
    <div className="flex flex-col min-h-screen ">
      <Navbar />

      {/* Page content */}

      <div className="flex-grow">
        {!loadData ? (
          <Spinner />
        ) : (
          <div className="flex flex-col md:flex-row w-full justify-between">
            <div className="w-full md:w-1/4 h-full">
              <Sidebar
                categories={categories}
                books={books}
                setCurrentState={setCurrentState}
                setCategoryChangeValue={setCategoryChangeValue}
              />
            </div>
            <div className="w-full md:w-3/4 p-4">
              <div className="flex items-center space-x-2">
                <label htmlFor="pageSize" className="text-sm text-gray-700">
                  Items per page:
                </label>

                <select
                  id="pageSize"
                  value={booksPerPageSize}
                  onChange={(e) => setBooksPerPageSize(Number(e.target.value))}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center space-x-4 space-y-2 mt-4 text-gray-700">
                {/* Sort by */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="sortBy" className="font-medium">
                    Sort by:
                  </label>
                  <select
                    id="sortBy"
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "rating" | "id")
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 hover:border-blue-400"
                  >
                    <option value="rating">Rating</option>
                    <option value="id">ID</option>
                  </select>
                </div>

                {/* Order */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="orderDirection" className="font-medium">
                    Order:
                  </label>
                  <select
                    id="orderDirection"
                    value={orderDirection}
                    onChange={(e) =>
                      setOrderDirection(e.target.value as "asc" | "desc")
                    }
                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 hover:border-blue-400"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
              </div>

              <MainMenuBooks
                categoryChangeValue={categoryChangeValue}
                currentState={currentState}
                books={books}
              />
            </div>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white z-10 p-6">
        {loadData && (
          <Pagination
            numberOfPages={numberOfPages}
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
          />
        )}
      </div>
    </div>
  );
}

export default Books;
