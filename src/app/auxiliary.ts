import { useLocation } from 'react-router-dom';
import { MyCloudUserSettings } from './model';
import { LOCAL_STORAGE_KEY_USER_SETTINSG } from './index';

const fileIcons = {
  'bi-file-play': ['avi', 'mp4', 'mpg', 'mkv'],
  'bi-file-music': ['mp3', 'wav'],
  'bi-file-image': ['bmp', 'dwg', 'gif', 'jpg', 'jpeg', 'png', 'psd', 'tiff'],
  'bi-file-code': ['css', 'html', 'js', 'xml', 'exe'],
  'bi-file-binary': ['dat'],
  'bi-file-word': ['doc', 'docx', 'dot'],
  'bi-file-excel': ['xls', 'xlsx', 'xlt'],
  'bi-file-pdf': ['pdf'],
  'bi-file-zip': ['rar', 'zip', '7zip'],
  'bi-file-text': ['txt'],
}

export const getFileIcon = (extension: string) => {
  // @ts-ignore
  const icon = Object.keys(fileIcons).find((key: string) => fileIcons[key].includes(extension.toLowerCase()));
  return icon || 'bi-file'
}

export const convertToDateTimeLocalString = (timestamp: string | undefined): string => {
  if (!timestamp)
    return '-'
  else
    return new Date(timestamp).toLocaleString();

  // const date = new Date(timestamp)
  // const year = date.getFullYear();
  // const month = (date.getMonth() + 1).toString().padStart(2, "0");
  // const day = date.getDate().toString().padStart(2, "0");
  // const hours = date.getHours().toString().padStart(2, "0");
  // const minutes = date.getMinutes().toString().padStart(2, "0");
  //
  // return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export const activePage = (): string => {
  const location = useLocation();

  const url_items = location.pathname.split('/');

  return url_items[1];
}

export const setTheme = (theme: string) => {
  document.documentElement.setAttribute('data-bs-theme', theme);
}

const colors = {
  'btn-outline-dark': {
    'dark': ' btn-outline-light',
    'light': ' btn-outline-dark'
  },
  'btn-outline-warning': {
    'dark': ' btn-outline-warning',
    'light': ' btn-warning'
  },
}

export const getColor = (color: string) => {
  // @ts-expect-error any explain
  const theme = <MyCloudUserSettings>JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_SETTINSG));

  if (!theme?.color_theme) return color;

  // @ts-ignore
  return colors[color][theme.color_theme] || color;
}
