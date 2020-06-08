let myMenu = document.getElementById('options');
let buttonMenu = document.getElementById('toggleButton');

buttonMenu.addEventListener('click', function () {

    myMenu.classList.toggle('display');
});

if(localStorage.getItem('token') == null){
    let logout = document.getElementById('logout');
    if (logout != null)
      logout.style.display = 'none';
}else{
    let login = document.getElementById('login');
    let register = document.getElementById('register');
    if(login != null)
      login.style.display = 'none';
    if(register != null)
      register.style.display = 'none';
}


function login() {

        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        xhr = new XMLHttpRequest();
        xhr.open('POST', 'login/?username=' + username + '&password=' + password);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onload = function() {
        if (xhr.status === 200){
            localStorage.setItem('token', xhr.responseText);
            window.location='/statistics'

        }
        if (xhr.status !== 200) {
            alert('username/password combination is incorrect');

        }
    };
    xhr.send(encodeURI(''));

}


function register() {

        let username = document.getElementById('username');
        let password = document.getElementById('password');
        let email = document.getElementById('email');
        let confrpassword = document.getElementById('confrpassword');
        if(!username.validity.valid)
          alert('username invalid')
        if(!password.validity.valid)
          alert('password invalid')
        if(!email.validity.valid)
          alert('email invalid')
        if(!confrpassword.validity.valid)
          alert('reenter password invalid')
        if(confrpassword.value == password.value){
          if(confrpassword.validity.valid && username.validity.valid && password.validity.valid && email.validity.valid){
            xhr = new XMLHttpRequest();
            xhr.open('POST', 'register/?username=' + username.value + '&password=' + password.value + '&email=' + email.value);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
              if (xhr.status === 200){
                  localStorage.setItem('token', xhr.responseText);
                  window.location='/statistics'

              }
              if (xhr.status !== 200) {
                  alert('username already taken');

              }
            };
            xhr.send(encodeURI(''));
          }

      }else{
        alert('password and reenter password are different');
      }

}
function logout(){
  localStorage.removeItem('token');
}


function b(a) {

    xhr = new XMLHttpRequest();
    xhr.open('POST', a + '/?token=' + localStorage.getItem('token'));
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
    console.log(xhr.status);
    if (xhr.status === 200){
        localStorage.setItem('token', xhr.responseText);
        window.location='/statistics'

    }
    if (xhr.status !== 200) {
        alert('username/password combination is incorrect');

    }
};
xhr.send(encodeURI(''));

}
