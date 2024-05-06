import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { usersListGet, selectUsersList } from '../slices/user-list-slice';
import { type MyCloudUser } from '../app/index';
import { userActions } from '../slices/user-slice';
import {filesListActions} from "../slices/file-list-slice.ts";
import Error from "../components/error.tsx";
import Loading from '../components/loading.tsx';

export default function UserList() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector(selectUsersList);

  useEffect(() => {
      if (status.status === 'none') loadData();
    },[status]
  );

  const loadData = () => dispatch(usersListGet());

  const rowClickHandle = (id: number) => {
    dispatch(userActions.reset());
    navigate(`/user/${id}`);
  }

  const userFilesHandle = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id:number) => {
    e.stopPropagation();

    dispatch(userActions.setActive(users.find(el => el.id === id)));
    dispatch(filesListActions.setOwner(id));
    navigate(`/files-user`);
  }

  return (
    <div className="justify-content-center align-items-center">
      <h2 className="text-center mt-4 mb-4">Users</h2>

      <table className="table table-striped table-hover text-wrap users-list">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">First name</th>
          <th scope="col">Last name</th>
          <th scope="col">E-mail</th>
          <th scope="col">Files</th>
          <th scope="col">Storage size, KB</th>
          <th scope="col">Admin</th>
          <th scope="col"></th>
        </tr>
        </thead>
        <tbody className="table-group-divider">
        {users.map((item: MyCloudUser, index) =>
            <tr key={item.id} className="users-list-row" onClick={() => rowClickHandle(item.id)}>
              <th scope="row">{index+1}</th>
              <td className="w-25">{item.username}</td>
              <td className="w-20">{item.first_name}</td>
              <td className="w-20">{item.last_name}</td>
              <td className="w-15">{item.email}</td>
              <td className="w-5 text-end">{item.total_files ? item.total_files : ''}</td>
              <td className="w-5 text-end">{item.total_size ? (item.total_size / 1024).toFixed(2) : ''}</td>
              <td className="w-5 text-center">{item.is_superuser ? '+' : ''}</td>
              <td className="w-5 text-end">
                <a className={"link-primary"} onClick={(event) => userFilesHandle(event, item.id)}>
                  {item.total_files ? 'view files' : ''}
                </a>
              </td>
            </tr>)}
        </tbody>
      </table >

      <Error error={status.error}/>
      <Loading status={status.status}/>
    </div>
  )
}
