import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import domain from "../../config/configuration";
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: domain }), // Thay URL của bạn
  endpoints: () => ({}), // Các API sẽ được khai báo ở file khác
});

export default baseApi;
