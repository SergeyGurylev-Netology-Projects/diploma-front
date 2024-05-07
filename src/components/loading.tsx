export default function Loading({...props}) {

  return (
    <>
      {props.status === "loading" &&
        <div className="d-flex justify-content-center mt-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">loading...</span>
          </div>
        </div>}
    </>
  )
}
