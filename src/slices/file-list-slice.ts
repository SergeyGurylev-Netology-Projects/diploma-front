import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { appAPI, fetchStatus, MyCloudFile } from '../app/index'

export const initialState: {owner_id: number, files: MyCloudFile[], status: fetchStatus} = {
  owner_id: 0,
  files: [],
  status: {
    status: "none",
    error: '',
    action: ''
  }
}

const fetchFilesListGet = createAsyncThunk(
  "files/get",
  async (...args: Parameters<typeof appAPI.filesListGet>) => {
    const response = await appAPI.filesListGet(...args);
    return response;
  },
)

const filesListSlice = createSlice({
  name: 'files',
  initialState: initialState,
  reducers: {
    setOwner: (state, action) => {
      state.owner_id = action.payload;
    },
    reset: (state) => {
      state.owner_id = initialState.owner_id;
      state.files = initialState.files;
      state.status = initialState.status;
    },
    addItem: (state, action) => {
      state.files.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.files.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.files[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      const index = state.files.findIndex(item => item.id === action.payload);
      if (index >= 0) {
        state.files.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilesListGet.pending, (state, action) => {
        state.status.status = "loading";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addCase(fetchFilesListGet.fulfilled, (state, action) => {
        state.files = action.payload;
        state.status.status = "idle";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addCase(fetchFilesListGet.rejected, (state, action) => {
        state.status.status = "failed";
        state.status.error = action.error?.message === undefined ? 'error' : action.error.message;
        state.status.action = action.type;
      })
  },
})

export const filesListActions = filesListSlice.actions;

export const selectFilesList = (state: RootState) => state.files;

export const filesListGet = (user_id: number): AppThunk => (dispatch) => dispatch(fetchFilesListGet(user_id));

export default filesListSlice.reducer;
