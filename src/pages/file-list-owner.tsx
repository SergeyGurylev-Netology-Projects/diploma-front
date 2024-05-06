import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { filesListActions, filesListGet, selectFilesList } from '../slices/file-list-slice';
import { selectLogonStatus } from "../slices/logon-slice.ts";
import FileList from '../components/file-list.tsx';

export default function FileListOwner() {
  const dispatch = useAppDispatch();
  const { user: logonUser } = useAppSelector(selectLogonStatus);
  const { files, status, owner_id} = useAppSelector(selectFilesList);

  useEffect(() => {
      if (owner_id) dispatch(filesListActions.reset());
    }, [owner_id]
  );

  useEffect(() => {
      if (status.status === 'none') loadData();
    }, [logonUser.id]
  );

  useEffect(() => {
      if (status.status === 'none') loadData();
    }, [status]
  );

  const loadData = () => {
    dispatch(filesListGet(logonUser.id))
  };

  return (
    <>
      <h2 className="text-center mt-4 mb-4">My Files</h2>
      <FileList
        files={files}
        status={status} />
    </>
  )
}
