import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  fileUrl: localStorage.getItem('uploadedImage') || ' ',
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setFileUrl: (state, action) => {
      state.fileUrl = action.payload;
      localStorage.setItem('uploadedImage', action.payload);
    },
  },
});

export const { setFileUrl } = imageSlice.actions;
export default imageSlice.reducer;
