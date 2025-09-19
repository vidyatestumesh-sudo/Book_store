import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import getBaseUrl from "../../../utils/baseURL";

const InventoryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockInputs, setStockInputs] = useState({});

  const fetchBooks = async () => {
    try {
      const res = await axios.get(`${getBaseUrl()}/api/books`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setBooks(res.data);

      const initialStock = {};
      res.data.forEach((book) => {
        initialStock[book._id] = book.stock || 1;
      });
      setStockInputs(initialStock);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch books", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleStockChange = (bookId, value) => {
    if (/^\d*$/.test(value)) {
      setStockInputs((prev) => ({
        ...prev,
        [bookId]: value,
      }));
    }
  };

  const updateStock = async (bookId) => {
    try {
      const newStock = parseInt(stockInputs[bookId], 10);
      if (isNaN(newStock)) {
        Swal.fire("Error", "Stock must be a number", "error");
        return;
      }

      await axios.put(
        `${getBaseUrl()}/api/books/edit/${bookId}`,
        { stock: newStock },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire("Success", "Stock updated successfully", "success");
      fetchBooks();
    } catch (error) {
      console.error("Error updating stock:", error);
      if (error.response && error.response.status === 403) {
        Swal.fire("Forbidden", "You do not have permission to update stock", "error");
      } else {
        Swal.fire("Error", "Failed to update stock", "error");
      }
    }
  };

  if (loading) return <div className="p-6 text-center">Loading books...</div>;

  return (
    <div className="container mt-[100px]">
      <div className="max-w-8xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
          Inventory Management
        </h2>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm sm:text-base">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Title</th>
                <th className="border px-4 py-2 text-left">Author</th>
                <th className="border px-4 py-2 text-left">Old Price</th>
                <th className="border px-4 py-2 text-left">New Price</th>
                <th className="border px-4 py-2 text-left">Stock</th>
                <th className="border px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-4 text-gray-500">
                    No books found.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{book.title}</td>
                    <td className="border px-4 py-2">{book.author}</td>
                    <td className="border px-4 py-2">₹{book.oldPrice?.toFixed(2)}</td>
                    <td className="border px-4 py-2">₹{book.newPrice?.toFixed(2)}</td>
                    <td className="border px-4 py-2">
                      <input
                        type="text"
                        value={stockInputs[book._id] || ""}
                        onChange={(e) => handleStockChange(book._id, e.target.value)}
                        className="border p-1 rounded w-20 text-center"
                      />
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => updateStock(book._id)}
                        className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {books && books.length > 0 ? (
            books.map((book, index) => (
              <div key={book._id} className="bg-gray-50 p-4 rounded-lg shadow flex flex-col space-y-2">
                <div className="font-semibold text-sm">{index + 1}. {book.title}</div>
                <div className="text-sm text-gray-600">
                  {book.oldPrice && book.discount > 0 ? (
                    <>
                      <span className="line-through text-gray-400 mr-1">₹{book.oldPrice}</span>
                      <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                      <span className="ml-1 text-red-500 font-semibold">({book.discount}% OFF)</span>
                    </>
                  ) : (
                    <span className="text-green-600 font-semibold">₹{book.newPrice}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={stockInputs[book._id] || ""}
                    onChange={(e) => handleStockChange(book._id, e.target.value)}
                    className="border p-1 rounded w-20 text-center"
                  />
                  <button
                    onClick={() => updateStock(book._id)}
                    className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded transition flex-1"
                  >
                    Update
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500">No books available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
