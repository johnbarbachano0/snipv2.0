import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
require("dotenv").config();

const headers = {
  "Content-Type": "application/json",
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER,
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    postNewUser: builder.mutation({
      query: (data) => ({
        url: `/auth/register`,
        method: "post",
        headers,
        body: data,
      }),
      invalidateTags: ["Auth"],
    }),
    authenticateUser: builder.mutation({
      query: (data) => ({
        url: `/auth/login`,
        method: "post",
        headers,
        body: data,
      }),
      transformResponse: (res) => {
        if (res?.user) {
          sessionStorage.setItem("isAuth", JSON.stringify(true));
          sessionStorage.setItem("user", JSON.stringify(res.user));
          sessionStorage.setItem("session", JSON.stringify(res.session));
          sessionStorage.setItem("sessionId", res.sessionId);
        }
        return res;
      },
      invalidateTags: ["Auth"],
    }),
    logoutUser: builder.query({
      query: (userId) => ({
        url: `/auth/logout/${userId}`,
        method: "get",
        headers,
      }),
      transformResponse: (res) => {
        if (res?.data?.id === null) {
          return true;
        } else {
          return false;
        }
      },
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  usePostNewUserMutation,
  useAuthenticateUserMutation,
  useLogoutUserQuery,
} = authApi;
