import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { Login, type MyCloudUser } from '../app/index';
import { initialState, userActions, selectUser, userPost } from '../slices/user-slice';
import {logon, logonActions, selectLogonStatus} from "../slices/logon-slice.ts";
import UserForm from '../components/user.tsx';

export default function UserRegistration() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status: status_user } = useAppSelector(selectUser);
  const { user: logonUser, status: status_logon } = useAppSelector(selectLogonStatus);
  const [ loginState, SetLoginState ] = useState<Login>({username: 'admin', password: '0000'});

  useEffect(() => onUserStatusChange(), [status_user]);

  useEffect(() => onLogonStatusChange(), [status_logon]);

  const onUserStatusChange = () => {
    if (status_user.action === 'user/post/fulfilled') {
        dispatch(logon({...loginState}));
    }
  }

  const onLogonStatusChange = () => {
    if (status_logon.status === 'idle') {
        dispatch(logonActions.logon(logonUser));
        dispatch(userActions.reset());
        navigate(`/files`);
    }
  }

  const submitHandle = (user: MyCloudUser, password: string) => {
    SetLoginState({...loginState, ...{username: user.username, password: password}});
    dispatch(userPost({password: password, ...user}));
  }

  const resetHandle = () => {
    dispatch(userActions.reset());
    navigate(`/`);
  }

  return (
    <>
      <UserForm
        user={initialState.user}
        status={status_user}
        registrationMode
        actions={{submit: submitHandle, reset: resetHandle}} />
    </>
  )
}
