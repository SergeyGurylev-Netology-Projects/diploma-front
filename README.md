# Дипломная работа по профессии Fullstack-разработчик на Python

# Облачное хранилище My Cloud

## Frontend

### Инструменты разработки

- JavaScript / TypeScript
- React / Redux Toolkit

### Структура проекта

- **src/pages** - страницы сайта
- **src/components** - общие компоненты React
- **src/slices** - модули работы с Redux Toolkit
- **src/app** - общие модули приложения

### Установка компонентов

`npm install`

### Переменные окружения
В корне проекта создать файл .env<br>
В .env указать путь к серверу Django в константе **VITE_APP_URL**<br>
Для сборки в prod задать путь равным пустой строке как в примере ниже<br>
`VITE_APP_URL=''`

### Сборка приложения
`npm run build`

Собранный проект находится в папке `dist`. Файлы из папки `dist/assets` скопировать в папку `frontend/dist/assets` backend-проекта.  