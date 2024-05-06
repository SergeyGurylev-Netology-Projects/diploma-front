import {createAsyncThunk, createSlice, isAnyOf} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import {appAPI, fetchStatus, Login, MyCloudUser} from '../app/index'

export const initialState: {user: MyCloudUser, status: fetchStatus} = {
  user: {
    id: 0,
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    is_superuser: false,
    total_files: 0,
    total_size: 0
  },
  status: {
    status: "none",
    error: '',
    action: '',
    loaded: false
  }
}

const fetchUserGet = createAsyncThunk(
  "user/get",
  async (...args: Parameters<typeof appAPI.userGet>) => {
    const response = await appAPI.userGet(...args);
    return response;
  },
)

const fetchUserPost = createAsyncThunk(
  "user/post",
  async (...args: Parameters<typeof appAPI.userPost>) => {
    const response = await appAPI.userPost(...args);
    return response;
  },
)

const fetchUserPatch = createAsyncThunk(
  "user/patch",
  async (...args: Parameters<typeof appAPI.userPatch>) => {
    const response = await appAPI.userPatch(...args);
    return response;
  },
)

const fetchUserDestroy = createAsyncThunk(
  "user/destroy",
  async (...args: Parameters<typeof appAPI.userDestroy>) => {
    const response = await appAPI.userDestroy(...args);
    return response;
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setActive: (state, action) => {
      state.user = action.payload;
    },
    reset: (state) => {
      state.user = initialState.user;
      state.status = initialState.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(fetchUserGet.pending, fetchUserPost.pending, fetchUserPatch.pending, fetchUserDestroy.pending),(state, action) => {
        state.status.status = "loading";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addMatcher(isAnyOf(fetchUserGet.fulfilled, fetchUserPost.fulfilled, fetchUserPatch.fulfilled), (state, action) => {
        state.user = action.payload;
        state.status = {status: "idle", error: "", action: action.type, loaded: true};
      })
      .addMatcher(isAnyOf(fetchUserDestroy.fulfilled), (state, action) => {
        state.user = initialState.user;
        state.status = {status: "idle", error: "", action: action.type, loaded: true};
      })
      .addMatcher(isAnyOf(fetchUserGet.rejected, fetchUserPost.rejected, fetchUserPatch.rejected, fetchUserDestroy.rejected), (state, action) => {
        state.status.status = "failed";
        state.status.error = action.error?.message === undefined ? 'error' : action.error.message;
        state.status.action = action.type;
      })
  },
})

export const userActions = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export const userGet = (id: number): AppThunk => (dispatch) => dispatch(fetchUserGet(id));

export const userPost = (user: MyCloudUser & Login): AppThunk => (dispatch) => dispatch(fetchUserPost(user));

export const userPatch = (user: MyCloudUser): AppThunk => (dispatch) => dispatch(fetchUserPatch(user));

export const userDestroy = (id: number): AppThunk => (dispatch) => dispatch(fetchUserDestroy(id));

export default userSlice.reducer;
