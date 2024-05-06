import {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import { selectLogonStatus } from '../slices/logon-slice';
import { useAppSelector } from '../app/hooks.ts';
import { getColor } from '../app/index';
import Error from '../components/error.tsx';
import Loading from './loading.tsx';
import ModalQuestion from "./modal-question.tsx";

const configForm = {
  username: {
    validate: {
      required: {
        value: true,
        message: "Please enter your login"
      },
      pattern: {
        value: /^[a-zA-Z][a-zA-Z0-9]{3,19}$/,
        message:
          "Only Latin letters and numbers\n" +
          "The first character is a letter\n" +
          "Length from 4 to 20 characters",
      }}
  },
  email: {
    validate: {
      required: {
        value: true,
        message: "Please enter E-mail"
      },
      pattern: {
        value: /^[-\w.]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
        message: "E-mail is incorrect",
      }}
  },
  password: {
    validate: {
      required: {
        value: true,
        message: "Please enter password"
      },
      pattern: {
        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/,
        message:
          "at least one small letter\n" +
          "at least one capital letter\n" +
          "at least one digit\n" +
          "of at least 6 characters",
      }}
  },
}

export default function User({...props}) {
  const { user: logonUser} = useAppSelector(selectLogonStatus);
  const [ showQuestion, setShowQuestion] = useState(false);

  const { register,
    handleSubmit,
    // formState: { errors },
    watch,
    reset,
    // clearErrors,
    setFocus} = useForm({
    shouldUseNativeValidation: true,
    defaultValues: {...props.user, password: '', password_confirm: ''}
  });

  useEffect(() => {
    setFocus("username");
    reset(props.user);
  }, [props.user]);

  const onSubmit = async (data: any) => {
    if (props.status.status !== "loading") {
      props.actions.submit(data, data.password);
    }
    // props.actions.submit(userState, passwordState.password);
  }

  const resetHandle = () => {
    props.actions.reset();
  }

  const deleteHandle = () => {
    setShowQuestion(true);
  }

  const answerHandle = (answer: string) => {
    setShowQuestion(false);

    switch (answer) {
      case 'OK':
        if(props.actions.delete) {
          props.actions.delete(props.user.id);
        }
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
        title="Deleting User"
        body={"Confirm user deletion: " + props.user.username}
      />

      <div className="d-flex justify-content-center align-items-center">
        <form onSubmit={handleSubmit(onSubmit)} onReset={resetHandle}>
          <h2 className="text-center mt-4 mb-4">{props.registrationMode ? 'User Registration' :  'User Details'}</h2>

          {(props.status.loaded || props.registrationMode) &&
            <div className="justify-content-center align-items-center">

              <div className="mb-3">
                <label className="form-label">Login</label>
                <input type="text" className="form-control" {...register("username", {...configForm.username.validate})}/>
              </div>

              <div className="mb-3">
                <label className="form-label">First name</label>
                <input type="text" className="form-control" {...register("first_name")}/>
              </div>

              <div className="mb-3">
                <label className="form-label">Last name</label>
                <input type="text" className="form-control" {...register("last_name")}/>
              </div>

              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input type="text" className="form-control" {...register("email", configForm.email.validate)}/>
              </div>

              {!props.registrationMode &&
                <>
                  <div className="mb-3">
                    <label className="form-label">Files</label>
                    <input type="text" className="form-control" {...register("total_files", {disabled: true})}/>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Storage size, KB</label>
                    <input type="text" className="form-control" {...register("total_size", {disabled: true})}/>
                  </div>
                </>}

              {logonUser.is_superuser &&
                <div className="form-check form-switch mb-3">
                  <input className="form-check-input" type="checkbox"
                         id="isSuperuser" {...register("is_superuser", {disabled: logonUser.id === props.user.id || false})}/>
                  <label className="form-check-label" htmlFor="isSuperuser">Administrator</label>
                </div>}

              {props.registrationMode &&
                <>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-control" {...register("password", configForm.password.validate)}/>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password confirm</label>
                    <input type="password" className="form-control" {...register("password_confirm", {
                      required: true, validate: (val: string) => {
                        if (watch('password') !== val) {
                          return "Your passwords do no match";
                        }
                      }})}/>
                  </div>
                </>}

              <div className="d-flex mb-3">
                <button className={"btn container-fluid" + getColor("btn-outline-dark")} type="submit">
                  Save
                </button>
                <button className="btn btn-outline-secondary container-fluid ms-3" type="reset">
                  Cancel
                </button>
                {logonUser.is_superuser &&
                  <button className="btn btn-outline-danger container-fluid ms-3"
                          type="button"
                          onClick={deleteHandle}
                          disabled={logonUser.id === props.user.id}>
                    Delete
                  </button>}

              </div>
            </div>}

          <Error error={props.status.error}/>
          <Loading status={props.status.status}/>
        </form>
      </div>
    </>
  )
}
