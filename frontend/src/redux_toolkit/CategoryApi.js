import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import domain from '../config/domain';
export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: fetchBaseQuery({ baseUrl: domain }),
  endpoints: (builder) => ({
    getIndustries: builder.query({
        query: () => '/api/category/category-industry',
        transformResponse: (response) => {return response.data;        },
    }),
    getJobFunction: builder.query({
        query: () => '/api/category/category-jobfunction',
        transformResponse: (response) => {return response.data;        },
    }),
    getBenefits: builder.query({
        query: () => '/api/category/category-benefit',
        transformResponse: (response) => {return response.data;        },
    }),
    getNations: builder.query({
        query: () => ({
          url: '/api/category/category-nation',
        }),
        transformResponse: (response) => {return response.data;        },
    }),
    getCities: builder.query({
        query: (nation) => ({
          url:`/api/category/category-city`,
          params:  {nation} }),
        transformResponse: (response) => {
          return response.data;        },   
      }),
    getDistricts: builder.query({
        query: (id) => `/api/category/category-district/${id}`,
        transformResponse: (response) => {return response.data;        },
    }),
    getLanguages: builder.query({
      query: () => '/api/category/category-language',
      transformResponse: (response) => {return response.data;        },
    }),
    getLevels: builder.query({
      query: () => '/api/category/category-level',
      transformResponse: (response) => {
        return response.data;        },
    }),
    getScales: builder.query({
      query: () => '/api/category/category-scale',
      transformResponse: (response) => {return response.data;        },
    }),
    getEducation: builder.query({
      query: () => '/api/category/category-education',
      transformResponse: (response) => {return response.data;        },
    }),
    getTags: builder.query({
        query: () => '/api/category/category-tags',
        transformResponse: (response) => {return response.data;        },
      }),
    getTime: builder.query({
        query: () => '/api/category/time',
        transformResponse: (response) => {return response.data;        },
      }), 
  }),
});

export const {  useGetIndustriesQuery,useGetJobFunctionQuery,
                useGetBenefitsQuery, useGetNationsQuery, useGetCitiesQuery,
                useGetDistrictsQuery, useGetLanguagesQuery, useGetLevelsQuery,
                useGetScalesQuery,useGetTagsQuery, useGetEducationQuery,useGetTimeQuery
            } = categoryApi;