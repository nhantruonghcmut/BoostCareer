import { baseApi } from "./api__base";

export const api_message_backup = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    fetch_messages: builder.query({
      query: (params = {}) => ({
        url: `/api/message/get_messages`,
        method: 'POST',
        body: params,
      }),
    }),
    delete_messages: builder.mutation({
      query: (messages_ids) => ({
        url: `/api/message/delete_messages`,
        method: 'DELETE',
        body: messages_ids,
      }),
    }),
    send_message_message: builder.mutation({
      query: (message) => ({
        url: `/api/message/send_messages`,
        method: 'POST',
        body: message,  })         
    }),
    fetch_backup: builder.query({
      query: (params = {}) => ({
        url: `/api/backup/get_backups`,
        method: 'POST',
        body: params,
      }),
    }),
    create_backup: builder.mutation({
      query: (backup) => ({
        url: `/api/backup/create_backup`,
        method: 'POST',
        body: backup,
      }),
    }),
    delete_backup: builder.mutation({
      query: (backup_ids) => ({
        url: `/api/backup/delete_backup`,
        method: 'DELETE',
        body: backup_ids,
      }),
    }),
    restore_backup: builder.mutation({
      query: (backup_id) => ({
        url: `/api/backup/restore_backup`,
        method: 'POST',
        body: backup_id,
      }),
    }),
  }),
});

export const { 
useFetch_messagesQuery,
useDelete_messagesMutation,
useSend_message_messageMutation,
useFetch_backupQuery,
useCreate_backupMutation,
useDelete_backupMutation,
useRestore_backupMutation,
} = api_message_backup; 

