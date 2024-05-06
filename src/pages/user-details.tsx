import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { type MyCloudUser } from '../app/index';
import { logonActions, selectLogonStatus } from '../slices/logon-slice.ts';
import { userActions, selectUser, userGet, userPatch, userDestroy } from '../slices/user-slice';
import { usersListActions } from '../slices/user-list-slice';
import UserForm from '../components/user.tsx';

export default function UserDetails() {
  const { id: user_id} = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: logonUser} = useAppSelector(selectLogonStatus);
  const { user, status } = useAppSelector(selectUser);

  useEffect(() => loadData(), [user_id]);

  useEffect(() => onUserStatusChange(), [status.action]);

  const loadData = () => {
    userActions.reset();
    if (user_id) {
      dispatch(userGet(parseInt(user_id)));
    }
  }

  const onUserStatusChange = () => {
    switch (status.action) {
      case 'user/get/fulfilled':
        // SetUserState({...userState, ...user});
        break;
      case 'user/patch/fulfilled':
        if (user.id === logonUser.id) dispatch(logonActions.updateUsername(user));
        dispatch(usersListActions.updateItem(user));
        dispatch(userActions.reset());
        navigate(-1);
        break;
      case 'user/destroy/fulfilled':
        dispatch(usersListActions.deleteItem(parseInt(user_id || '0')));
        dispatch(userActions.reset());
        navigate(-1);
        break;
    }
  }

  const submitHandle = (user: MyCloudUser) => {
    dispatch(userPatch(user));
  }

  const resetHandle = () => {
    navigate(-1);
  }

  const deleteHandle = (id: number) => {
    dispatch(userDestroy(id));
  }

  return (
    <>
      <UserForm
        user={user}
        status={status}
        actions={{submit: submitHandle, reset: resetHandle, delete: deleteHandle}} />
    </>
  )
}
