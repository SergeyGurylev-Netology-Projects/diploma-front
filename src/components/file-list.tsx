import { convertToDateTimeLocalString, getFileIcon, type MyCloudFile } from '../app/index';
import { useNavigate } from "react-router-dom";
import Loading from '../components/loading.tsx';
import Error from "./error.tsx";

// const icons  = './src/img/icons/';
// const icons  = '/static/img/icons/';

export default function FileList({...props}) {
  const navigate = useNavigate();

  const rowClickHandle = (id: number) => {
    navigate(`/file/${id}`);
  }

  return (
    <div className="justify-content-center align-items-center">

      <table className="table table-striped table-hover text-wrap files-list">
        <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col"></th>
          <th scope="col" className={"header-hover"}>Title</th>
          <th scope="col">Description</th>
          <th scope="col">Size, KB</th>
          <th scope="col">Upload date</th>
          <th scope="col">Download date</th>
          <th scope="col">Download count</th>
          <th scope="col">Shared</th>
        </tr>
        </thead>
        <tbody className="table-group-divider">
        {props.files.map((item: MyCloudFile, index: number) =>
            <tr key={item.id} className="users-list-row" onClick={() => rowClickHandle(item.id)}>
              <th scope="row">{index+1}</th>
              <td className="w-5">
                <i className={"bi " + getFileIcon(item.extension)} style={{fontSize: "1.2rem"}}></i>
                {/*<img className="file-icon" src={icons + item.extension + '.png'}/>*/}
              </td>
              <td className="w-25">{item.title}</td>
              <td className="w-30">{item.description}</td>
              <td className="w-10 text-end">{(item.size / 1024).toFixed(2)}</td>
              <td className="w-10">{convertToDateTimeLocalString(item.created_at)}</td>
              <td className="w-10">{convertToDateTimeLocalString(item.download_at)}</td>
              <td className="w-5 text-end">{item.download_count}</td>
              <td className="w-5 text-center">{item.url ? '+' : ''}</td>
            </tr>)}
        </tbody>
      </table >

      <Error error={props.status.error}/>
      <Loading status={props.status.status}/>
    </div>
  )
}
