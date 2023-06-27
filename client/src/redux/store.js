import { configureStore } from '@reduxjs/toolkit';
import loaderSlice from './loaderSlice';
import usersSlice from './usersSlice';

const store = configureStore({
	reducer: {
		users: usersSlice,
		loader: loaderSlice,
	},
});

export default store;
