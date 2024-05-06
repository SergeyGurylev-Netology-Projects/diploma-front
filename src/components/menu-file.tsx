import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getColor } from '../app/index';
import {generateUrlDestroy, generateUrlPost, selectFile} from "../slices/file-slice.ts";

export default function MenuFile() {
  const dispatch = useAppDispatch();
  const { file} = useAppSelector(selectFile);

  const downloadFileHandle = () => {
    fetch(file.handle)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = file.filename;
          a.click();
          a.remove();
        });
      });
  }

  const generateLinkHandle = () => {
    dispatch(generateUrlPost(file.id));
  }

  const destroyLinkHandle = () => {
    dispatch(generateUrlDestroy(file.id));
  }

  return (
    <>
      <button className={"btn ms-4" + getColor("btn-outline-warning")} onClick={downloadFileHandle}>Download</button>
      <button className={"btn ms-2" + getColor("btn-outline-dark")} onClick={generateLinkHandle}>Share</button>
      <button className={"btn ms-2" + getColor("btn-outline-dark")} onClick={destroyLinkHandle}>Stop share</button>
    </>
  )
}
