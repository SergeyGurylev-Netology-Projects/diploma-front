import Logo from '../img/logo.png'
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { activePage, getColor, setTheme } from '../app/index';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { logonActions, selectLogonStatus } from '../slices/logon-slice';
import { userSettingsActions, selectUserSettings } from '../slices/user-settings-slice';
import { userActions } from '../slices/user-slice.ts';
import { filesListActions } from '../slices/file-list-slice';
import MenuFile from '../components/menu-file.tsx';
import MenuFileList from "../components/menu-file-list.tsx";
import MenuAdmin from '../components/menu-admin.tsx';
import ModalQuestion from "../components/modal-question.tsx";

export default function Header() {
  const pathname = activePage();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: logonUser } = useAppSelector(selectLogonStatus);
  const { settings} = useAppSelector(selectUserSettings);
  const [ currentUserState, SetCurrentUserState ] = useState({
    user_id: 0,
    username: '',
    is_superuser: false
  });

  useEffect(() => onUserStatusChange(), [logonUser.id, logonUser.username]);

  useEffect(() => onUserSettingsChange(), [settings]);

  const onUserStatusChange = () => {
    dispatch(filesListActions.setOwner(logonUser.id));

    SetCurrentUserState({
      ...currentUserState,
      user_id: logonUser.id,
      username: logonUser.username,
      is_superuser: logonUser.is_superuser});
  }

  const onUserSettingsChange = () => setTheme(settings.color_theme);

  const myFilesHandle = () => {
    dispatch(filesListActions.setOwner(logonUser.id));
    navigate(`/files`);
  }

  const mySettingsHandle = () => {
    navigate(`/settings`);
  }

  const logoffHandle = () => {
    navigate(`/`);
    dispatch(logonActions.logoff())
    dispatch(filesListActions.reset())
    dispatch(userActions.reset())
    dispatch(userSettingsActions.reset());
  };

  return (
    <>
      <ModalQuestion />

      <header className="container">
        <div className="row">
          <div className="col">
            <nav className="navbar navbar-expand-sm">
              <div className="container-fluid">
                <div className="d-flex align-items-center">
                  <Link to={'/'}>
                    <img className="file-icon" src={Logo}/>
                  </Link>
                  <Link to={'/'}>
                    <span className="navbar-brand ms-2" style={{fontSize: "40px", fontWeight: "bold"}}>My Cloud</span>
                  </Link>

                  {currentUserState.is_superuser && <MenuAdmin />}
                  {pathname === 'files' && <MenuFileList />}
                  {pathname === 'file' && <MenuFile />}
                </div>

                <div>
                  {currentUserState.user_id !== 0 &&
                    <>
                      {currentUserState.is_superuser && <span className="fw-light me-2">administrator</span>}

                      <Link to={`/user/${currentUserState.user_id}`}>
                        <button className={"btn me-2" + getColor("btn-outline-warning")}>{currentUserState.username}</button>
                      </Link>

                      <button className={"btn me-2" + getColor("btn-outline-dark")} onClick={myFilesHandle}>
                        My files
                      </button>

                      <button className={"btn me-2" + getColor("btn-outline-dark")} onClick={mySettingsHandle}>
                        Settings
                      </button>

                      <button className="btn btn-secondary" onClick={logoffHandle}>
                        Logoff
                      </button>
                    </>}
                  {currentUserState.user_id === 0 &&
                    <>
                      <Link to={`/registration`}>
                        <button className="btn btn-info me-2">Register</button>
                      </Link>
                      <Link to={'/logon'}>
                        <button className="btn btn-success">Logon</button>
                      </Link>
                    </>}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    </>
  )
}
