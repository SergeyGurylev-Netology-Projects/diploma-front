import loadingGIF from '../assets/loading.gif';

export default function Loading({...props}) {

  return (
    <>
      {props.status === "loading" &&
        <div className="d-flex justify-content-center mt-4">
          <img className="loadingImage" src={loadingGIF} alt=''/>
        </div>}
    </>
  )
}
