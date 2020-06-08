


window.onload = function(){
    if(localStorage.getItem('token') == null){
        window.location='/login'
    }else{
      xhr = new XMLHttpRequest();
      xhr.open('POST', window.location.pathname + '/?token=' + localStorage.getItem('token'));
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
}
