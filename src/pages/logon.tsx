import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { type Login } from '../app/index'
import { logonActions, logon, selectLogonStatus } from '../slices/logon-slice';
import { userSettingsActions, selectUserSettings, userSettingsGet } from '../slices/user-settings-slice';
import Error from "../components/error.tsx";
import Loading from "../components/loading.tsx";

export default function Logon() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: logonUser, status: status_logon } = useAppSelector(selectLogonStatus);
  const { settings, status: status_settings} = useAppSelector(selectUserSettings);
  const [ loginState, SetLoginState ] = useState<Login>({username: '', password: ''});

  useEffect(() => onLogonStatusChange(), [status_logon.status]);

  useEffect(() => onUserSettingsStatusChange(), [status_settings.action]);

  const onLogonStatusChange = () => {
    if (status_logon.status === 'idle') {
      dispatch(logonActions.logon(logonUser));
      dispatch(userSettingsGet());
      // navigate(`/files`);
    }
  }

  const onUserSettingsStatusChange = () => {
    if (status_settings.action === 'settings/get/fulfilled') {
      dispatch(userSettingsActions.update(settings));
      // setTheme(settings.color_theme);
      navigate(`/files`);
    }
  }

  const onLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type,  name, checked, value } = e.target;
    SetLoginState({...loginState, [name]: type === "checkbox" ? checked : value});
  }

  const submitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(logon({...loginState}));
  }

  const resetHandle = () => {
    SetLoginState({username: '', password: ''});
    navigate(`/`);
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form onSubmit={submitHandle} onReset={resetHandle}>
        <h2 className="text-center mt-5 mb-5">User Login</h2>
        <div className="justify-content-center align-items-center">
          <div className="mb-3">
            <label className="form-label ">User name</label>
            <input type="text" className="form-control" name="username" value={loginState.username} onChange={onLoginChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label ">Password</label>
            <input type="password" className="form-control" name="password" value={loginState.password} onChange={onLoginChange} required/>
          </div>
          <div className="d-flex mb-3">
            <button className="btn btn-outline-light container-fluid me-3" type="submit">Logon</button>
            <button className="btn btn-outline-secondary container-fluid" type="reset">Cancel</button>
          </div>
        </div>

        <Error error={status_logon.error}/>
        <Loading status={status_logon.status}/>
      </form>
    </div>
  )
}
