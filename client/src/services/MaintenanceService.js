import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
require("dotenv").config();

const headers = {
  "Content-Type": "application/json",
};

export const maintenanceApi = createApi({
  reducerPath: "maintenanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_SERVER,
  }),
  tagTypes: ["Maintenance"],
  endpoints: (builder) => ({
    getMaintenance: builder.query({
      query: () => ({
        url: `/maintenance`,
        method: "get",
        headers,
      }),
      providesTags: (result) =>
        result
          ? result.map(({ id }) => ({ type: "Maintenance", id }))
          : [{ type: "Maintenance" }],
    }),
  }),
});

export const { useGetMaintenanceQuery } = maintenanceApi;
