import { Action, configureStore, createListenerMiddleware, isAnyOf, ThunkAction } from '@reduxjs/toolkit';
import logonReducer, { logonActions } from '../slices/logon-slice';
import userSettingsReducer, { userSettingsActions } from '../slices/user-settings-slice';
import { LOCAL_STORAGE_KEY_CURRENT_USER, LOCAL_STORAGE_KEY_USER_SETTINSG } from '../app/index'
import userReducer from '../slices/user-slice';
import fileReducer from '../slices/file-slice';
import usersListReducer from '../slices/user-list-slice';
import filesListReducer from '../slices/file-list-slice';

const localStorageMiddleware = createListenerMiddleware();

localStorageMiddleware.startListening({
  matcher: isAnyOf(
    logonActions.logon,
    logonActions.logoff,
    logonActions.updateUsername),
  effect: (_, listenerApi) => {
    // @ts-expect-error any explain
    localStorage.setItem(LOCAL_STORAGE_KEY_CURRENT_USER, JSON.stringify(listenerApi.getState().logon.user))
  },
});

localStorageMiddleware.startListening({
  matcher: isAnyOf(
    userSettingsActions.update,
    userSettingsActions.reset),
  effect: (_, listenerApi) => {
    // @ts-expect-error any explain
    localStorage.setItem(LOCAL_STORAGE_KEY_USER_SETTINSG, JSON.stringify(listenerApi.getState().settings.settings))
  },
});

export const store = configureStore({
  reducer: {
    logon: logonReducer,
    user: userReducer,
    file: fileReducer,
    users: usersListReducer,
    files: filesListReducer,
    settings: userSettingsReducer,
  },
  middleware:
    (getDefaultMiddleware) => getDefaultMiddleware().prepend(localStorageMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
