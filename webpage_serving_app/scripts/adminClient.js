function onOff(id){
  var btn = document.getElementById(id);
  btn.classList.toggle('active');
  xhr = new XMLHttpRequest();
  if(btn.classList.contains('active')){
    xhr.open('POST', window.location.pathname + '/?token=' + localStorage.getItem('token') + '&state=off&api=' + id);
  }else{
    xhr.open('POST', window.location.pathname + '/?token=' + localStorage.getItem('token') + '&state=on&api=' + id);

  }
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
      console.log(xhr.status);
      if (xhr.status === 200){

        document.getElementById("secret").innerHTML = xhr.responseText;
      }
      if (xhr.status !== 200) {

          window.location = '/home'
      }
  }
  xhr.send(encodeURI(''));
}


function adminRegister() {

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
            xhr.open('POST', 'adminRegister/?username=' + username.value + '&password=' + password.value + '&email=' + email.value + '&token=' + localStorage.getItem('token'));
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function() {
              if (xhr.status === 200){
                  localStorage.setItem('token', xhr.responseText);
                  window.location='/admin'

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


function update(){
  xhr = new XMLHttpRequest();
  xhr.open('POST','update/?token=' + localStorage.getItem('token'));
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.onload = function() {
      console.log(xhr.status);
      if (xhr.status === 200){
          alert("updated.")
      }
      if (xhr.status !== 200) {

          alert("db problems.")
      }
  }
  xhr.send(encodeURI(''));
}
