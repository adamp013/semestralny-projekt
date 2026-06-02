const API = 'http://localhost:3000'

//register funkcia
export async function register(email, password){
    const res = await fetch(`${API}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    })
    return res.json();
}

//login funkcia
export async function login(email, password){
    const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include', //toto zabezpeci, ze cookie bude posielana s kazdym requestom
        body: JSON.stringify({email, password})
    })
    return res.json();
}

//logout funkcia
export async function logout(){
    const res = await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    })
    return res.json();
}

//delete funckcia 
export async function deleteAccount(){
    const res = await fetch(`${API}/api/auth/delete`, {
        method: 'DELETE',  
        credentials: 'include',
    })
    return res.json()
}

export async function getUsers(){
    const res = await fetch(`${API}/api/auth/admin/users`,{
        credentials: 'include'
    })
    return res.json()
}