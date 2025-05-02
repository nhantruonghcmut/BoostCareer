// import { get } from "core-js/core/dict";
import { baseApi } from "./api__base";

export const apiCatalog = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogIndustry: builder.query({
      query: () => "/api/category/getCategory_Industry",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
    getCatalogJobfunction: builder.query({
      query: () => "/api/category/getCategory_Jobfunction",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
    getCatalogJoblevel: builder.query({
      query: () => "/api/category/getCategory_Level",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
    getCatalogNation: builder.query({
      query: () => "/api/category/getCategory_Nation",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),
    getCatalogcity: builder.query({
      query: () => "/api/category/getCategory_City",
      transformResponse: (response) => response.data, // Lấy chỉ phần "data"
    }),
    getCatalogDistrict: builder.query({
      query: () => "/api/category/getCategory_District",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),
    getCatalogScale: builder.query({
      query: () => "/api/category/getCategory_Scale",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),
    getCatalogEducation: builder.query({
      query: () => "/api/category/getCategory_Education",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),
    getCatalogLanguage: builder.query({
      query: () => "/api/category/getCategory_Language",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),
    getCatalogBenifit: builder.query({
      query: () => "/api/category/getCategory_Benifit",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),
    getCatalogTag: builder.query({
      query: () => "/api/category/getCategory_Tags",
      transformResponse: (response) => response.data, // Lấy chỉ ph
    }),


  }),
});

export const {  useGetCatalogIndustryQuery,
                useGetCatalogJobfunctionQuery,
                useGetCatalogJoblevelQuery,
                useGetCatalogNationQuery,
                useGetCatalogcityQuery,
                useGetCatalogDistrictQuery,
                useGetCatalogScaleQuery,
                useGetCatalogEducationQuery,
                useGetCatalogLanguageQuery,
                useGetCatalogBenifitQuery,
                useGetCatalogTagQuery,
            } = apiCatalog; // Đảm bảo export đúng tên
