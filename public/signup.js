document.getElementById('signup').addEventListener('submit',function(event){
    const password =document.getElementById('password').value;
    const confirm_password= document.getElementById('confirm_password').value;
    const error_msg= document.getElementById('error_msg');
    const error_msg2 = document.getElementById('error_msg2');

    if(password != confirm_password){
        error_msg.style.display = 'block';
        error_msg.style.border ="1px solid red";
        error_msg.style.color ='red';
        event.preventDefault();  
    }
    else{
        error_msg.style.display = 'none';
        error_msg2.style.display = 'block';
        error_msg2.style.border ="1px solid green";
        error_msg2.style.color ='green';
    }
})