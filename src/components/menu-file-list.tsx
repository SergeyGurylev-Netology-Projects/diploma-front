import { Link } from "react-router-dom";
import { getColor } from '../app/index.ts';

export default function MenuFileList() {

  return (
    <>
      <Link to={`/file-create`}>
        <button className={"btn ms-4" + getColor("btn-outline-warning")}>Add file +</button>
      </Link>
    </>
  )
}
