import {createAsyncThunk, createSlice, isAnyOf} from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import { LOCAL_STORAGE_KEY_USER_SETTINSG, appAPI, fetchStatus, MyCloudUserSettings } from '../app/index'

const initialUserSettings: MyCloudUserSettings = {
  color_theme: 'dark'
}

export const initialState: {settings: MyCloudUserSettings, status: fetchStatus} = {
  // @ts-expect-error any explain
  settings: JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_SETTINSG)) || initialUserSettings,
  status: {
    status: "none",
    error: '',
    action: '',
    loaded: false
  }
}

const fetchUserSettingsGet = createAsyncThunk(
  "settings/get",
  async (...args: Parameters<typeof appAPI.userSettingsGet>) => {
    const response = await appAPI.userSettingsGet(...args);
    return response;
  },
)

const fetchUserSettingsPatch = createAsyncThunk(
  "settings/patch",
  async (...args: Parameters<typeof appAPI.userSettingsPatch>) => {
    const response = await appAPI.userSettingsPatch(...args);
    return response;
  },
)

const userSettingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    update: (state, action) => {
      state.settings = {...action.payload};
    },
    reset: (state) => {
      state.settings = initialUserSettings;
      state.status = initialState.status;
    },
    resetStatus: (state) => {
      state.status = initialState.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isAnyOf(fetchUserSettingsGet.pending, fetchUserSettingsPatch.pending), (state, action) => {
        state.status.status = "loading";
        state.status.error = "";
        state.status.action = action.type;
      })
      .addMatcher(isAnyOf(fetchUserSettingsGet.fulfilled, fetchUserSettingsPatch.fulfilled), (state, action) => {
        state.settings = action.payload;
        state.status.status = "idle";
        state.status.error = "";
        state.status.action = action.type;
        state.status.loaded = true;
      })
      .addMatcher(isAnyOf(fetchUserSettingsGet.rejected, fetchUserSettingsPatch.rejected), (state, action) => {
        state.status.status = "failed";
        state.status.error = action.error?.message === undefined ? 'error' : action.error.message;
        state.status.action = action.type;
      })
  },
})

export const userSettingsActions = userSettingsSlice.actions;

export const selectUserSettings = (state: RootState) => state.settings;

export const userSettingsGet = (): AppThunk => (dispatch) => dispatch(fetchUserSettingsGet());

export const userSettingsPatch = (settings: MyCloudUserSettings): AppThunk => (dispatch) => dispatch(fetchUserSettingsPatch(settings));

export default userSettingsSlice.reducer;
