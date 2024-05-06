import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { LOCAL_STORAGE_KEY_CURRENT_USER, appAPI, fetchStatus, MyCloudCurrentUser, Login } from '../app/index'

const initialUser: MyCloudCurrentUser = {
  id: 0,
  username: '',
  first_name: '',
  last_name: '',
  email: '',
  is_superuser: false,
  token: '',
  total_files: 0,
  total_size: 0
}

export const initialState: {user: MyCloudCurrentUser, status: fetchStatus} = {
  // @ts-expect-error any explain
  user: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_USER)) || initialUser,
  status: {
    status: "none",
    error: '',
    action: '',
    loaded: false
  }
}

const fetchLogon = createAsyncThunk(
  "logon",
  async (...args: Parameters<typeof appAPI.logon>) => {
    const response = await appAPI.logon(...args);
    return response;
  },
)

const logonSlice = createSlice({
  name: 'logon',
  initialState: initialState,
  reducers: {
    logon: (state, action) => {
      state.user = action.payload;
    },
    logoff: (state) => {
      // state.user = initialState.user;
      state.user = initialUser;
      state.status = initialState.status;
    },
    updateUsername: (state, action) => {
      state.user.username = action.payload.username;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogon.pending, (state, action) => {
        state.status.status = "loading";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addCase(fetchLogon.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status.status = "idle";
        state.status.error = "";
        state.status.action = action.type;
        state.status.loaded = true;
      })
      .addCase(fetchLogon.rejected, (state, action) => {
        state.status.status = "failed";
        state.status.error = action.error?.message === undefined ? 'error' : action.error.message;
        state.status.action = action.type;
      })
  },
})

export const logonActions = logonSlice.actions;

export const selectLogonStatus = (state: RootState) => state.logon;

export const logon = (login: Login): AppThunk => (dispatch) => dispatch(fetchLogon(login));

// export const userSave = (user: User): AppThunk => (dispatch) => dispatch(fetchUserSave(user));

export default logonSlice.reducer;
