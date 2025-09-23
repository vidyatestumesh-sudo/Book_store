import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define your API service
export const bookApi = createApi({
  reducerPath: 'bookApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api', // Replace with your backend API base URL
  }),
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: () => '/books',  // GET /api/books
      providesTags: ['Books'],
    }),
    addBook: builder.mutation({
      query: (newBook) => ({
        url: '/books',         // POST /api/books
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation({
      query: (bookId) => ({
        url: `/books/${bookId}`, // DELETE /api/books/:id
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useFetchAllBooksQuery,
  useAddBookMutation,
  useDeleteBookMutation,
} = bookApi;
