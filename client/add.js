async function adduser(event){
    event.preventDefault();
    console.log("reached here")

    let name = document.getElementById('name').value;
    console.log('name',name);

    let email  = document.getElementById('email').value;
    console.log('email',email);

    let password = document.getElementById('password').value;
    console.log('passowrd: ',password)

    let nameerror = document.getElementById('name-error')
    if(!name){
        
        nameerror.innerHTML = 'invalid name'
    }

    let emailerror =document.getElementById('email-error')
    if(!email){
        emailerror.innerHTML = 'invalid email'
    }

    let passworderror = document.getElementById('password-error')
    if(!password){
        passworderror.innerHTML = 'invalid password'
    }

    let data =  {
        name,
        email,
        password,
    }
    console.log('data',data);
    
    let json_data = JSON.stringify(data);
    console.log('json_data',json_data);

    let response = await fetch('/submit',{
        method :'POST',
        headers : {
            'Content-Type':'application/json',
        },
        body : json_data,
    });
    console.log('response',response)
   

}