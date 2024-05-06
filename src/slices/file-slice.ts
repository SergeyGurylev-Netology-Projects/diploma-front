import {createAsyncThunk, createSlice, isAnyOf} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { appAPI, fetchStatus, MyCloudFile } from '../app/index'

export const initialState: {file: MyCloudFile, status: fetchStatus} = {
  file: {
    id: 0,
    title: '',
    filename: '',
    extension: '',
    size: 0,
    description: '',
    handle: '',
    url: '',
    user: 0,
    download_count: 0,
    download_at: '',
    created_at: ''
  },
  status: {
    status: "none",
    error: '',
    action: '',
    loaded: false
  }
}

const fetchFileGet = createAsyncThunk(
  "file/get",
  async (...args: Parameters<typeof appAPI.fileGet>) => {
    const response = await appAPI.fileGet(...args);
    return response;
  },
)

const fetchFilePost = createAsyncThunk(
  "file/post",
  async (...args: Parameters<typeof appAPI.filePost>) => {
    const response = await appAPI.filePost(...args);
    return response;
  },
)

const fetchFilePatch = createAsyncThunk(
  "file/fetch",
  async (...args: Parameters<typeof appAPI.filePatch>) => {
    const response = await appAPI.filePatch(...args);
    return response;
  },
)

const fetchFileDestroy = createAsyncThunk(
  "file/destroy",
  async (...args: Parameters<typeof appAPI.fileDestroy>) => {
    const response = await appAPI.fileDestroy(...args);
    return response;
  },
)

const fetchGenerateUrlPost = createAsyncThunk(
  "generate_url/post",
  async (...args: Parameters<typeof appAPI.generateUrlPost>) => {
    const response = await appAPI.generateUrlPost(...args);
    return response;
  },
)

const fetchGenerateUrlDestroy = createAsyncThunk(
  "generate_url/destroy",
  async (...args: Parameters<typeof appAPI.generateUrlDestroy>) => {
    const response = await appAPI.generateUrlDestroy(...args);
    return response;
  },
)

const fileSlice = createSlice({
  name: 'file',
  initialState: initialState,
  reducers: {
    reset: (state) => {
      state.file = initialState.file;
      state.status = initialState.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(fetchFileGet.pending, fetchFilePost.pending, fetchFilePatch.pending, fetchFileDestroy.pending, fetchGenerateUrlPost.pending, fetchGenerateUrlDestroy.pending),(state, action) => {
        state.status.status = "loading";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addMatcher(isAnyOf(fetchFileGet.fulfilled, fetchFilePost.fulfilled, fetchFilePatch.fulfilled), (state, action) => {
        state.file = action.payload;
        state.status = {status: "idle", error: "", action: action.type, loaded: true}
      })
      .addMatcher(isAnyOf(fetchFileDestroy.fulfilled), (state, action) => {
        state.file = initialState.file;
        state.status = {status: "idle", error: "", action: action.type, loaded: true};
      })
      .addMatcher(isAnyOf(fetchGenerateUrlPost.fulfilled, fetchGenerateUrlDestroy.fulfilled), (state, action) => {
        state.file.url = action.payload;
        state.status = {status: "idle", error: "", action: action.type, loaded: true};
      })
      .addMatcher(isAnyOf(fetchFileGet.rejected, fetchFilePost.rejected, fetchFilePatch.rejected, fetchFileDestroy.rejected, fetchGenerateUrlPost.rejected, fetchGenerateUrlDestroy.rejected), (state, action) => {
        state.status.status = "failed";
        state.status.error = action.error?.message === undefined ? 'error' : action.error.message;
        state.status.action = action.type;
      })
  },
})

export const fileActions = fileSlice.actions;

export const selectFile = (state: RootState) => state.file;

export const fileGet = (id: number): AppThunk => (dispatch) =>
  dispatch(fetchFileGet(id));

export const filePost = (detail: MyCloudFile, file: File, user_id: number): AppThunk => (dispatch) =>
  dispatch(fetchFilePost({ detail: detail, file: file, user_id: user_id} ));

export const filePatch = (file: MyCloudFile): AppThunk => (dispatch) =>
  dispatch(fetchFilePatch(file));

export const fileDestory = (id: number): AppThunk => (dispatch) =>
  dispatch(fetchFileDestroy(id));

export const generateUrlPost = (id: number): AppThunk => (dispatch) =>
  dispatch(fetchGenerateUrlPost(id));

export const generateUrlDestroy = (id: number): AppThunk => (dispatch) =>
  dispatch(fetchGenerateUrlDestroy(id));

export default fileSlice.reducer;
