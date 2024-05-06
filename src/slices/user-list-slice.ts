import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { appAPI, fetchStatus, type MyCloudUser } from '../app/index'

const initialState: {users: MyCloudUser[], status: fetchStatus} = {
  users: [],
  status: {
    status: "none",
    error: '',
    action: ''
  }
}

const fetchUsersListGet = createAsyncThunk(
  "users/get",
  async (...args: Parameters<typeof appAPI.usersListGet>) => {
    const response = await appAPI.usersListGet(...args);
    return response;
  },
)

const usersListSlice = createSlice({
  name: 'users',
  initialState: initialState,
  reducers: {
    reset: (state) => {
      state.users = initialState.users;
      state.status = initialState.status;
    },
    updateItem: (state, action) => {
      const index = state.users.findIndex(item => item.id === action.payload.id);
      if (index >= 0) {
        state.users[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      const index = state.users.findIndex(item => item.id === action.payload);
      if (index >= 0) {
        state.users.splice(index, 1);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersListGet.pending, (state, action) => {
        state.status.status = "loading";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addCase(fetchUsersListGet.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status.status = "idle";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addCase(fetchUsersListGet.rejected, (state, action) => {
        state.status.status = "failed";
        state.status.error = action.error?.message === undefined ? 'error' : action.error.message;
        state.status.action = action.type;
      })
  },
})

export const usersListActions = usersListSlice.actions;

export const selectUsersList = (state: RootState) => state.users;

export const usersListGet = (): AppThunk => (dispatch) => dispatch(fetchUsersListGet());

export default usersListSlice.reducer;
