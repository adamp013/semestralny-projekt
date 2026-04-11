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

//lofing funkcia
export async function login(email, password){
    const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({email, password})
    })
    return res.json();
}