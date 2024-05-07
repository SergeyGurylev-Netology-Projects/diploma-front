import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { convertToDateTimeLocalString, getColor, getFileIcon } from '../app/index';
import { initialState, fileActions, selectFile, fileGet, filePatch, fileDestory } from '../slices/file-slice';
import { filesListActions } from '../slices/file-list-slice';
import { usersListActions } from '../slices/user-list-slice';
import { selectUser } from '../slices/user-slice.ts';
import { selectLogonStatus } from '../slices/logon-slice.ts';
import Loading from "../components/loading.tsx";
import Error from "../components/error.tsx";
import ModalQuestion from "../components/modal-question.tsx";

export default function FileDetails() {
  const { id: file_id} = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user} = useAppSelector(selectUser);
  const { user: logonUser} = useAppSelector(selectLogonStatus);
  const { file, status } = useAppSelector(selectFile);
  const [ fileState, SetFileState ] = useState(initialState.file);
  const [ showQuestion, setShowQuestion] = useState(false);

  useEffect(() => loadData(), [file_id]);

  useEffect(() => onFileStatusChange(), [status.action]);

  const loadData = () => {
    fileActions.reset();

    if (file_id) {
      dispatch(fileGet(parseInt(file_id)));
    } else {
      SetFileState({...fileState, ...initialState.file})
    }
  }

  const onFileStatusChange = () => {
    switch (status.action) {
      case 'file/get/fulfilled':
        SetFileState({...fileState, ...file})
        break;
      case 'file/fetch/fulfilled':
        dispatch(filesListActions.updateItem(file));
        dispatch(fileActions.reset());
        navigate(-1);
        break;
      case 'file/destroy/fulfilled':
        dispatch(filesListActions.deleteItem(parseInt(file_id || '0')));
        dispatch(fileActions.reset());
        dispatch(usersListActions.reset());
        navigate(-1);
        break;
      case 'generate_url/post/fulfilled':
        SetFileState({...fileState, url: file.url});
        break;
      case 'generate_url/destroy/fulfilled':
        SetFileState({...fileState, url: file.url});
        break;
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    SetFileState({...fileState, [name]: value});
  }

  const submitHandle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(status.status !== "loading") {
      dispatch(filePatch(fileState));
    }
  }

  const resetHandle = () => {
    SetFileState(initialState.file);
    dispatch(fileActions.reset());
    navigate(-1);
  }

  const deleteFileHandle = () => {
    setShowQuestion(true);
  }

  const answerHandle = (answer: string) => {
    setShowQuestion(false);

    switch (answer) {
      case 'OK':
        dispatch(fileDestory(fileState.id));
        break;
      default:
        return;
    }
  }

  return (
    <>
      <ModalQuestion
        show={showQuestion}
        actions={{answerHandle: answerHandle}}
        title="Deleting File"
        body={"Confirm file deletion: " + file.title}
      />

      <div className="d-flex justify-content-center align-items-center">
        <form onSubmit={submitHandle} onReset={resetHandle}>
          <div className="d-flex justify-content-center align-items-center mb-1">
            <i className={"bi " + getFileIcon(file.extension)} style={{fontSize: "2.4rem"}}></i>
            <h2 className="d-flex align-items-center ms-3">File details</h2>
          </div>

          {status.loaded &&
            <div className="justify-content-center align-items-center">

              {user.id !== 0 && user.id !== logonUser.id &&
                <div className="mb-3">
                  <label className="form-label">Owner</label>
                  <input type="text" className="form-control" name="username" disabled value={user.username} />
                </div>}

              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" value={fileState.title} onChange={onFileChange} required/>
              </div>

              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" name="description" value={fileState.description || ''} onChange={onFileChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Share link</label>
                <input type="text" className="form-control" name="url" readOnly value={fileState.url === null ? '' : fileState.url} />
              </div>

              <div className="mb-3">
                <label className="form-label ">Size, KB</label>
                <input type="number" className="form-control" name="size" disabled value={(fileState.size / 1024).toFixed(2)} />
              </div>

              <div className="mb-3">
                <label className="form-label ">Upload date</label>
                <input type="text" className="form-control" name="created_at" disabled value={convertToDateTimeLocalString(fileState.created_at)} />
              </div>
              <div className="mb-3">
                <label className="form-label ">Download date</label>
                <input type="text" className="form-control" name="download_at" disabled value={convertToDateTimeLocalString(fileState.download_at)} />
              </div>
              <div className="mb-3">
                <label className="form-label ">Download count</label>
                <input type="number" className="form-control" name="download_count" disabled value={fileState.download_count} />
              </div>

              <div className="d-flex mb-3">
                <button className={"btn container-fluid" + getColor("btn-outline-dark")} type="submit">
                  Save
                </button>
                <button className="btn btn-outline-secondary container-fluid ms-3" type="reset">
                  Cancel
                </button>
                <button className="btn btn-outline-danger container-fluid ms-3" type="button" onClick={deleteFileHandle}>
                  Delete
                </button>
              </div>

              {status.error &&
                <div>
                  <p className="form-control text-center text-bg-danger p-2">{status.error}</p>
                </div>}

            </div>}

          <Error error={status.error}/>
          <Loading status={status.status}/>
        </form>
      </div>
    </>
  )
}
