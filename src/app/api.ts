import { Login, MyCloudCurrentUser, MyCloudUser, MyCloudFile, MyCloudUserSettings } from './model'
import { LOCAL_STORAGE_KEY_CURRENT_USER } from "./index.ts";

const url = import.meta.env.VITE_APP_URL || 'http://localhost:8000';
const path = `${url}/api`;

const getToken = () => {
  // @ts-expect-error any explain
  const user = <MyCloudCurrentUser>JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_CURRENT_USER));
  return user.token;
}

function cause_exception(error: any) {
  if (typeof error === 'string')
    throw new Error(error);
  if (typeof error === 'object')
    for (const key of Object.keys(error)) {
      throw new Error(error[key]);
    }
  throw new Error(error);
}

// LOGON

export function logon(login: Login) {
  const url = `${path}/logon`
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(login),
  };

  return new Promise<MyCloudCurrentUser>((resolve, reject) => {
      const fetchData = async () => {
          try {
              const response = await fetch(url, options)
              // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
              const data = await response.json();
              if (data.error) cause_exception(data.error);
              resolve(data);
          } catch (error) {reject(error)}
      };

      return fetchData();
  })
}


// USER

export function usersListGet() {
  const url = `${path}/user`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<MyCloudUser[]>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function userGet(id: number) {
  const url = `${path}/user/${id}`;
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<MyCloudUser>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        if (data.length === 0) cause_exception("User wasn't found");
        resolve(data[0]);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function userPost( user: MyCloudUser & Login ) {
  const url = `${path}/user`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': 'Token ' + getToken()
    },
    body: JSON.stringify(user),
  };
  return new Promise<MyCloudUser>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function userPatch(user: MyCloudUser) {
  const url = `${path}/user/${user.id}`;
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
    body: JSON.stringify(user),
  };
  return new Promise<MyCloudUser>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function userDestroy(id: number) {
  const url = `${path}/user/${id}`;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<number>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        resolve(response.status);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}


// FILE

export function filesListGet(user_id:number) {
  const url = `${path}/file?` + new URLSearchParams({ user_id: user_id.toString() }).toString()
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<MyCloudFile[]>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function fileGet(file_id: number) {
  const url = `${path}/file?` + new URLSearchParams({ file_id: file_id.toString() }).toString()
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<MyCloudFile>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        if (data.length === 0) throw new Error("file wasn't found");
        resolve(data[0]);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function filePost( params: { detail: MyCloudFile, file: File, user_id: number } ) {
  const url = `${path}/file`

  const form_data = new FormData();
  form_data.append('title', params.detail.title);
  form_data.append('filename', params.detail.filename);
  form_data.append('extension', params.detail.extension);
  form_data.append('description', params.detail.description);
  form_data.append('size', params.detail.size.toString());
  form_data.append('user', params.user_id.toString());
  form_data.append('handle', params.file);

  const options = {
    method: 'POST',
    headers: {
      'Authorization': 'Token ' + getToken()
    },
    body: form_data,
  };

  return new Promise<MyCloudFile>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        // if (data.error?.handle) throw new Error(data.error.handle[0]);
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function filePatch(file: MyCloudFile) {
  const url = `${path}/file/${file.id}`
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
    body: JSON.stringify({title: file.title, description: file.description}),
  };
  return new Promise<MyCloudFile>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function fileDestroy(id: number) {
  const url = `${path}/file/${id}`
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<number>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        resolve(response.status);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function generateUrlPost(id: number) {
  const url = `${path}/link-generation`;
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
    body: JSON.stringify({id: id}),
  };
  return new Promise<string>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (!data.url) throw new Error("Server error. Field 'ulr' is missing in the response");
        resolve(data.url);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function generateUrlDestroy(id: number) {
  const url = `${path}/link-generation`;
  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
    body: JSON.stringify({id: id}),
  };
  return new Promise<string>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        resolve('');
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}


// USER SETTINGS
export function userSettingsGet() {
  const url = `${path}/settings`
  const options = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
  };
  return new Promise<MyCloudUserSettings>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}

export function userSettingsPatch(settings: MyCloudUserSettings) {
  const url = `${path}/settings`
  const options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Token ' + getToken()
    },
    body: JSON.stringify({...settings}),
  };
  return new Promise<MyCloudUserSettings>((resolve, reject) => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, options)
        // if (!response.ok) throw new Error(response.status + ' | ' + response.statusText);
        const data = await response.json();
        if (data.error) cause_exception(data.error);
        resolve(data);
      } catch (error) {reject(error)}
    };

    return fetchData();
  })
}
