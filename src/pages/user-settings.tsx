import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { color_theme, type MyCloudUserSettings } from '../app/index'
import { userSettingsActions, selectUserSettings, userSettingsPatch } from '../slices/user-settings-slice';
import Loading from '../components/loading.tsx';
import Error from "../components/error.tsx";

export default function UserSettings() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { settings, status: status_settings} = useAppSelector(selectUserSettings);
  const [ settingsState, SetSettingsState] = useState<MyCloudUserSettings>(settings);

  useEffect(() => onUserSettingsChange(), [settings]);

  useEffect(() => onUserSettingsStatusChange(), [status_settings]);

  const onUserSettingsChange = () => {
    SetSettingsState({...settings})
  }

  const onUserSettingsStatusChange = () => {
    if (status_settings.action === 'settings/patch/fulfilled') {
      dispatch(userSettingsActions.update(settings));
      dispatch(userSettingsActions.resetStatus());
      // navigate(-1);
    }
  }

  const resetHandle = () => {
    navigate(-1);
  }

  const themeChangeHandle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const theme: string = e.target.value;
    SetSettingsState({...settingsState, color_theme: theme});
    dispatch(userSettingsPatch({color_theme: theme}));
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form onReset={resetHandle}>
        <h2 className="text-center mt-5 mb-5">User Setings</h2>
        <div className="justify-content-center align-items-center">
          <div className="mb-3">
            <label className="form-label ">Color theme</label>
            <select className="form-select" value={settingsState.color_theme} onChange={themeChangeHandle}>
              {Object.keys(color_theme).map((key) =>
                // @ts-ignore
                <option key={key} value={key}>{color_theme[key]}</option>)
              }
            </select>
          </div>
          <div className="d-flex mb-3">
            {/*<button className={"btn container-fluid" + getColor("btn-outline-dark")} type="submit">Save</button>*/}
            <button className="btn btn-outline-secondary container-fluid" type="reset">Close</button>
          </div>
          {status_settings.error &&
              <div>
                <p className="form-control text-center text-bg-danger p-2">{status_settings.error}</p>
              </div>}
        </div>

        <Error error={status_settings.error}/>
        <Loading status={status_settings.status}/>
      </form>
    </div>
  )
}
