document.getElementById("registerForm");

registerForm.addEventListener("submit", function(event) {
  event.preventDefault(); // Предотвратить отправку формы по умолчанию

  var name = registerForm.elements.name.value;
  var login = registerForm.elements.login.value;
  var password = registerForm.elements.password.value;

  // Отправка данных на сервер
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/register", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        // Обработка ответа от сервера
        if (response.success) {
          alert("Регистрация успешна!");
          registerForm.reset(); // Очистить форму
        } else {
          alert("Ошибка регистрации: " + response.message);
        }
      } else {
        alert("Произошла ошибка при выполнении запроса. Пожалуйста, попробуйте снова.");
      }
    }
  };
  var data = JSON.stringify({ name: name, login: login, password: password });
  xhr.send(data);
});