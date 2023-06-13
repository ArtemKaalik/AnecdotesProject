document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
  
    // Создаем объект запроса
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/login', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  
    // Обработка ответа от сервера
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          // Вход успешен
          alert(xhr.responseText);
          
        } else {
          // Ошибка входа
          alert('Ошибка входа! Неверный логин или пароль!');
        }
      }
    };
  
    // Отправляем данные на сервер
    const params = 'login=' + encodeURIComponent(login) + '&password=' + encodeURIComponent(password);
    xhr.send(params);
  });
  