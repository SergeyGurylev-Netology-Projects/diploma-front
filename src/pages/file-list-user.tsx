import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { filesListActions, filesListGet, selectFilesList} from '../slices/file-list-slice';
import { selectUser } from '../slices/user-slice.ts';
import FileList from '../components/file-list.tsx';

export default function FileListUser() {
  const dispatch = useAppDispatch();
  const { user: user} = useAppSelector(selectUser);
  const { files, status, owner_id} = useAppSelector(selectFilesList);

  useEffect(() => {
      if (owner_id) dispatch(filesListActions.reset());
    }, [owner_id]
  );

  useEffect(() => {
      if (status.status === 'none') loadData();
    }, [user.id]
  );

  useEffect(() => {
      if (status.status === 'none') loadData();
    }, [status]
  );

  const loadData = () => {
    dispatch(filesListGet(user.id))
  };

  return (
    <>
      <h2 className="text-center mt-4 mb-4">Files [{user.username}]</h2>
      <FileList
        files={files}
        status={status} />
    </>
  )
}
