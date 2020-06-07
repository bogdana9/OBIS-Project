let myMenu = document.getElementById('options');
let buttonMenu = document.getElementById('toggleButton');
let buttonLogin = document.getElementById('btnlogin');

buttonMenu.addEventListener('click', function () {
    
    myMenu.classList.toggle('display');
});

if(localStorage.getItem('token') == null){
    let logout = document.getElementById('logout');
    
    logout.style.display = 'none';
}else{
    let login = document.getElementById('login');
    let register = document.getElementById('register');
    login.style.display = 'none';
    register.style.display = 'none';
}

function a() {
    
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        xhr = new XMLHttpRequest();
        xhr.open('POST', 'login/?username=' + username + '&password=' + password);
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


function b(a) {
    
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
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