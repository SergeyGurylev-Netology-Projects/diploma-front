export default function Error({...props}) {

  return (
    <>
      {props.error &&
        <div>
          <p className="form-control text-center text-bg-danger p-2">{props.error}</p>
        </div>}
    </>
  )
}
