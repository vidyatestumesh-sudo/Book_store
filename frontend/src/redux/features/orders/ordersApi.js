import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";

const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/orders`,
    credentials: 'include'
  }),
  tagTypes: ['Orders'],
  endpoints: (builder) => ({
    // ✅ Fixed syntax
    createOrder: builder.mutation({
      query: (newOrder) => ({
        url: "/",
        method: "POST",
        body: newOrder,
        credentials: 'include',
      }),
      invalidatesTags: ['Orders'], 
    }),

    getOrderByEmail: builder.query({
      query: (email) => ({
        url: `/email/${encodeURIComponent(email)}`,
      }),
      providesTags: ['Orders']
    })
  })
});

export const { useCreateOrderMutation, useGetOrderByEmailQuery } = ordersApi;

export default ordersApi;