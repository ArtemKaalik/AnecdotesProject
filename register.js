window.onload = function() {
  console.log('testt');
  var registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", function(event) {
    console.log("test");
    event.preventDefault(); // Предотвратить отправку формы по умолчанию

    var name = registerForm.elements.name.value;
    var login = registerForm.elements.login.value;
    var password = registerForm.elements.password.value;

    // Отправка данных на сервер
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
      console.log('error');
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = JSON.parse(xhr.responseText);
        // Обработка ответа от сервера
        if (response.success) {
          alert("Регистрация успешна!");
          registerForm.reset(); // Очистить форму
        } else {
          alert("Ошибка регистрации: " + response.message);
        }
      }
    };
    var data = JSON.stringify({ name: name, login: login, password: password });
    xhr.send(data);
  });
};
