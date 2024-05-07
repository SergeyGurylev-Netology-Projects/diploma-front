import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { getColor } from '../app/index';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectLogonStatus } from "../slices/logon-slice.ts";
import { initialState, fileActions, selectFile, filePost } from '../slices/file-slice';
import { filesListActions } from '../slices/file-list-slice';
import { usersListActions } from '../slices/user-list-slice';
import Loading from "../components/loading.tsx";
import Error from "../components/error.tsx";

export default function FileCreate() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: logonUser } = useAppSelector(selectLogonStatus);
  const { file, status } = useAppSelector(selectFile);
  const [ fileState, SetFileState ] = useState(initialState.file);
  const [ fileDataState, SetFileDataState ] = useState<File>();

  useEffect(() => onFileStatusChange(), [status.action]);

  const onFileStatusChange = () => {
    switch (status.action) {
      case 'file/post/fulfilled':
        // dispatch(filesListActions.reset());
        dispatch(filesListActions.addItem(file));
        dispatch(fileActions.reset());
        dispatch(usersListActions.reset());
        navigate(-1);
        break;
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    const { name, files, value } = e.target;
    if (files) {
      const file_full_name = files[0].name;
      const file_name_array = file_full_name.split('.');
      const file_ext = file_name_array.pop();
      const file_name = file_name_array.join();

      SetFileDataState(files[0]);
      SetFileState({
        ...fileState,
        title: file_name,
        filename:  file_full_name,
        extension: file_ext ? file_ext : '',
        size: files[0].size })
    } else {
      SetFileState({...fileState, [name]: value});
    }
  }

  const submitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (fileDataState && status.status !== "loading")
      dispatch(filePost(fileState, fileDataState, logonUser.id));
  }

  const resetHandle = () => {
    // dispatch(fileActions.reset());
    SetFileState(initialState.file)
    SetFileDataState(undefined)
    navigate(-1);
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form onSubmit={submitHandle} onReset={resetHandle}>
        <h2 className="text-center mt-4 mb-4">New File</h2>

        <div className="justify-content-center align-items-center">

          <div className="mb-3">
            <input className="form-control" type="file" name="handle" onChange={onFileChange} required/>
          </div>

          <div className="mb-3">
            <label className="form-label ">File title</label>
            <input type="text" className="form-control" name="title" value={fileState.title} onChange={onFileChange} required/>
          </div>

          <div className="mb-3">
            <label className="form-label ">Description</label>
            <textarea className="form-control" name="description" value={fileState.description} onChange={onFileChange} />
          </div>

          <div className="mb-3">
            <label className="form-label ">Size</label>
            <input type="number" className="form-control" name="size" disabled value={fileState.size} />
          </div>

          <div className="d-flex mb-3">
            <button className={"btn container-fluid" + getColor("btn-outline-dark")} type="submit">Save</button>
            <button className="btn btn-outline-secondary container-fluid ms-3" type="reset">Cancel</button>
          </div>
        </div>

        <Error error={status.error}/>
        <Loading status={status.status}/>
      </form>
    </div>
  )
}
