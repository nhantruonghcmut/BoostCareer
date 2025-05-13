import { configureStore, combineReducers } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistStore,persistReducer,FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

import authReducer from './AuthSlice.js';
import { categoryApi } from './CategoryApi.js';
import { guestApi } from './guestApi'; 
import {jobseekerApi} from './jobseekerApi.js';
import {employerApi} from './employerApi.js';
import { setupListeners } from '@reduxjs/toolkit/query';

const persistConfig = {
  key: "root", // Key dùng để lưu vào localStorage
  storage,
  blacklist: [categoryApi.reducerPath,guestApi.reducerPath, jobseekerApi.reducerPath, employerApi.reducerPath, 'isLogin', 'user'], // Danh sách các reducer không cần lưu vào localStorage
};

const rootReducer = combineReducers({
  auth: authReducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [guestApi.reducerPath]: guestApi.reducer,
  [jobseekerApi.reducerPath]: jobseekerApi.reducer,
  [employerApi.reducerPath]: employerApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(categoryApi.middleware, guestApi.middleware, jobseekerApi.middleware, 
      employerApi.middleware,
    ),
});
setupListeners(store.dispatch);
export const persistor = persistStore(store);

export default store;
