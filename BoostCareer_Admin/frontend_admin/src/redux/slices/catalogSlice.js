import { createSlice } from "@reduxjs/toolkit";
import { apiCatalog } from "../api/api_catalog";

const initialState = {
  industries: [], // Danh sách ngành nghề
  jobfunctions:[],
  nations:[],  
  cities:[],
  districts:[],
  joblevels:[],
  scales:[],
  educations:[],
  languages:[],
  benifits:[],
  tags:[],
  experiences:[{id:0,name:"Không yêu cầu"},{id:1,name:"Dưới 1 năm"},{id:2,name:"1-3 năm"},{id:3,name:"3-5 năm"},{id:4,name:"5-10 năm"},{id:5,name:"Trên 10 năm"}],
  experiences_jobseeker:[{id:0,name:"Dưới 1 năm"},{id:1,name:"1 năm"},{id:2,name:"2 năm"},{id:3,name:"3 năm"},{id:4,name:"4 năm"},{id:5,name:"5 năm"},{id:6,name:"Trên 5 năm"}],
  object_status:[{id:1,name:"Đang mở"},{id:0,name:"Đã đóng"}],
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setIndustries: (state, action) => {
      state.industries = action.payload;
    },    
    setJobfunctions: (state, action) => {
      state.jobfunctions = action.payload;
    },
    setNations: (state, action) => {
      state.nations = action.payload;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    setDistricts: (state, action) => {
      state.districts = action.payload
    },
    setJoblevels: (state, action) => {
      state.joblevels = action.payload;
    },
    setScales: (state, action) => {
      state.scales = action.payload;
    },
    setEducations: (state, action) => {
      state.educations = action.payload;
    },
    setLanguages: (state, action) => {
      state.languages = action.payload;
    },
    setBenifits: (state, action) => {
      state.benifits = action.payload;
    },
    setTags: (state, action) => {
      state.tags = action.payload;
    },
    setExperiences: (state, action) => {
      state.experiences = action.payload;
    },
    setObjectStatus: (state, action) => {
      state.object_status = action.payload;
    },    
  },

  extraReducers: (builder) => {
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogIndustry.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.industries = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogJobfunction.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.jobfunctions = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogNation.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.nations = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogDistrict.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.districts = action.payload; // Cập nhật industries trong Redux store
      }
    );    
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogcity.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.cities = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogJoblevel.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.joblevels = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogScale.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.scales = action.payload; // Cập nhật industries trong Redux store
      });
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogEducation.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.educations = action.payload; // Cập nhật industries trong Redux store
      }
    );
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogLanguage.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.languages = action.payload; // Cập nhật industries trong Redux store
      });
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogBenifit.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.benifits = action.payload; // Cập nhật industries trong Redux store
      });
    builder.addMatcher(
      apiCatalog.endpoints.getCatalogTag.matchFulfilled, // Lắng nghe API thành công
      (state, action) => {
        state.tags = action.payload; // Cập nhật industries trong Redux store
      });
  },

});

export const { setIndustries,setJobfunctions,setNations,setCities,setDistricts,setEducations,setLanguages,setExperiences,setBenifits,setObjectStatus,setTags,setJoblevels,setScales, } = catalogSlice.actions;
export default catalogSlice.reducer;