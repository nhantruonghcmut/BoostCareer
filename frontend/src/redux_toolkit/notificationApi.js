import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import domain from "../config/domain";

export const notificationApi = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({ baseUrl: domain }),
  endpoints: (builder) => ({
    getNotificationByUserID: builder.query({
      query: (id) => ({
        url: "/user/get-notification-by-user-id/",
        params: { id },
        withCredentials: true,
      }),
    }),
  })
});
export const { useGetNotificationByUserIDQuery } = notificationApi;