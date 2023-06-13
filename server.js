const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8000;

// Подключение к базе данных MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'anecdote',
});

connection.connect((err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }
  console.log('Подключено к базе данных MySQL с ID ' + connection.threadId);
});

// Создание таблицы roles, если она не существует
const createRolesTableQuery = `
  CREATE TABLE IF NOT EXISTS roles (
    roleId INT PRIMARY KEY,
    role VARCHAR(255) NOT NULL
  )
`;

connection.query(createRolesTableQuery, (err) => {
  if (err) {
    console.error('Ошибка при создании таблицы roles: ' + err.stack);
    return;
  }
  console.log('Таблица roles создана или уже существует');
});

// Добавление значений в таблицу roles, если они не существуют
const insertRolesDataQuery = `
  INSERT IGNORE INTO roles (roleId, role) VALUES
  (1, 'user'),
  (2, 'moderator'),
  (3, 'admin')
`;

connection.query(insertRolesDataQuery, (err) => {
  if (err) {
    console.error('Ошибка при добавлении значений в таблицу roles: ' + err.stack);
    return;
  }
  console.log('Значения успешно добавлены в таблицу roles');
});

// Создание таблицы person, если она не существует
const createPersonTableQuery = `
  CREATE TABLE IF NOT EXISTS person (
    personId INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    login VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    roleId INT NOT NULL,
    FOREIGN KEY (roleId) REFERENCES roles(roleId)
  )
`;

connection.query(createPersonTableQuery, (err) => {
  if (err) {
    console.error('Ошибка при создании таблицы person: ' + err.stack);
    return;
  }
  console.log('Таблица person создана или уже существует');
});

// Добавление middleware для обработки данных запроса
app.use(bodyParser.urlencoded({ extended: true }));

// Обработчик GET-запроса на корневой путь
app.get('/', (req, res) => {
  res.redirect('/register');
});

// Загрузка страницы регистрации
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
  });
  
app.use(express.static(__dirname));
  


// Обработчик POST-запроса для обработки данных регистрации
app.post('/register', (req, res) => {
  const { name, login, password } = req.body;
  const roleId = 1; // Роль пользователя (user)

  // Вставка данных в таблицу person
  const insertPersonQuery = 'INSERT INTO person (name, login, password, roleId) VALUES (?, ?, ?, ?)';
  const insertPersonData = [name, login, password, roleId];

  connection.query(insertPersonQuery, insertPersonData, (err, results) => {
    if (err) {
      console.error('Ошибка при регистрации пользователя: ' + err.stack);
      return;
    }
    console.log('Пользователь успешно зарегистрирован с ID ' + results.insertId);
    res.send('Регистрация успешно завершена');
  });
});
//==============================LogIn===============================
// Обработчик GET-запроса для отображения страницы входа
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Обработчик POST-запроса для обработки данных входа пользователя
app.post('/login', (req, res) => {
  const { login, password } = req.body;

  // Поиск пользователя по логину и паролю в базе данных
  const selectPersonQuery = 'SELECT * FROM person WHERE login = ? AND password = ?';
  const selectPersonData = [login, password];

  connection.query(selectPersonQuery, selectPersonData, (err, results) => {
    if (err) {
      console.error('Ошибка при выполнении запроса на вход: ' + err.stack);
      return;
    }

    // Проверка наличия пользователя в базе данных
    if (results.length > 0) {
      // const personId = results[0].personId;
      const name = results[0].name;
      // const role = results[0].role;

      console.log('Пользователь успешно вошел: ' + name);
      res.send('Вход успешно выполнен! Привет: ' + name);
      res.redirect('/index.html');
    } else {
      console.log('Не удалось выполнить вход: неверный логин или пароль');
      res.status(401).send('Не удалось выполнить вход: неверный логин или пароль');
    }
  });
});





// Запуск сервера
app.listen(port, () => {
  console.log('Сервер запущен на порту ' + port);
});
