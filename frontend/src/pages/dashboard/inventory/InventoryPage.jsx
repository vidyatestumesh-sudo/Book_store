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
        initialStock[book._id] = book.stock || 0;
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

  // Manual stock update (replace stock with input value)
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

  // New function: Increase stock by a quantity programmatically
  const increaseStock = async (bookId, quantityToAdd) => {
    try {
      if (typeof quantityToAdd !== "number" || quantityToAdd <= 0) {
        throw new Error("Quantity to add must be a positive number");
      }

      // Find current stock from local state if possible
      const currentStock = books.find((b) => b._id === bookId)?.stock || 0;
      const updatedStock = currentStock + quantityToAdd;

      await axios.put(
        `${getBaseUrl()}/api/books/edit/${bookId}`,
        { stock: updatedStock },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire("Success", `Stock increased by ${quantityToAdd}`, "success");
      fetchBooks();
    } catch (error) {
      console.error("Error increasing stock:", error);
      Swal.fire("Error", "Failed to increase stock", "error");
    }
  };

  if (loading) return <div className="p-6">Loading books...</div>;

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Inventory Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Old Price</th>
              <th className="border p-2">New Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {books.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No books found.
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr key={book._id} className="hover:bg-gray-50">
                  <td className="border p-2">{book.title}</td>
                  <td className="border p-2">{book.author}</td>
                  <td className="border p-2">₹{book.oldPrice?.toFixed(2)}</td>
                  <td className="border p-2">₹{book.newPrice?.toFixed(2)}</td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={stockInputs[book._id] || ""}
                      onChange={(e) => handleStockChange(book._id, e.target.value)}
                      className="border p-1 rounded w-20 text-center"
                    />
                  </td>
                  <td className="border p-2 space-x-2">
                    <button
                      onClick={() => updateStock(book._id)}
                      className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                    >
                      Update
                    </button>
                    {/* Example button to increase stock by 1 for testing */}
                    {/* <button
                      onClick={() => increaseStock(book._id, 1)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                    >
                      +1 Stock
                    </button> */}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;
