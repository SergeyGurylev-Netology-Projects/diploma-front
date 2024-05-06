import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useNavigate } from "react-router-dom";
import {selectUser} from "../slices/user-slice.ts";
import {selectLogonStatus} from "../slices/logon-slice.ts";
import { activePage, getColor } from "../app/index";
import {filesListActions} from "../slices/file-list-slice.ts";

export default function MenuAdmin() {
  const pathname = activePage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user} = useAppSelector(selectUser);
  const { user: logonUser} = useAppSelector(selectLogonStatus);

  const userListHandle = () => {
    navigate(`/users`);
  }

  const userFilesHandle = () => {
    dispatch(filesListActions.setOwner(user.id));
    navigate(`/files-user`);
  }

  return (
    <>
      <button className={"btn ms-4 " + getColor("btn-outline-dark")} onClick={userListHandle}>
        User list
      </button>

      {user.id !== logonUser.id && pathname === 'user' &&
        <button className={"btn ms-2 " + getColor("btn-outline-dark")} onClick={userFilesHandle}>
          View user files
        </button>}
    </>
  )
}
