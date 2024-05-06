import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './app/store'
import NotFound from './pages/not-found.tsx';
import Header from './pages/header.tsx';
import Logon from './pages/logon.tsx';
import UserList from './pages/user-list.tsx';
import UserDetails from './pages/user-details.tsx';
import UserRegistration from './pages/user-registration.tsx';
import FileListOwner from './pages/file-list-owner.tsx';
import FileListUser from "./pages/file-list-user.tsx";
import FileCreate from './pages/file-create.tsx';
import FileDetails from './pages/file-details.tsx';
import UserSettings from './pages/user-settings.tsx';

export default function App() {

  return (
    <BrowserRouter>
      <Provider store={store}>
        <Header />
        <main className="container">
          <div className="row">
            <div className="col">
              <Routes>
                <Route path="/" element={<></>}/>
                <Route path="/registration" element={<UserRegistration />}/>
                <Route path="/logon" element={<Logon />}/>
                <Route path="/users" element={<UserList />}/>
                <Route path="/user/:id" element={<UserDetails />}/>
                <Route path="/files" element={<FileListOwner />}/>
                <Route path="/files-user" element={<FileListUser />}/>
                <Route path="/file-create" element={<FileCreate />}/>
                <Route path="/file/:id" element={<FileDetails />}/>
                <Route path="/settings" element={<UserSettings />}/>
                <Route path="/*" element={<NotFound />}/>
              </Routes>
            </div>
          </div>
        </main>
        {/*<Footer />*/}
      </Provider>
    </BrowserRouter>
  )
}
