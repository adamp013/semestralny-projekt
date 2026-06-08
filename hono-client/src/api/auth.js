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

///////////////////////////////////////SONGS/////////////////////////////////////

//GET songs
export async function getSongs(){
    const res = await fetch(`${API}/api/auth/songs`, {
        credentials: 'include'
    })
    return res.json()
}

//pridat song
export async function createSong(song){
    const res = await fetch(`${API}/api/auth/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include',
        body: JSON.stringify(song)
    })
    return res.json()
}

//delete song
export async function deleteSong(id){
    const res = await fetch(`${API}/api/auth/songs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    })
    return res.json()
}

//update song
export async function updateSong(id, song){
    const res = await fetch(`${API}/api/auth/songs/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json'},
        credentials: 'include', 
        body: JSON.stringify(song)
    })
    return res.json()
}

///////////////////////////////////////PLAYLIST/////////////////////////////////////
// GET moje playlisty
export async function getPlaylists() {
  const res = await fetch(`${API}/api/auth/playlists`, {
    credentials: 'include'
  })
  return res.json()
}

// POST - vytvor playlist
export async function createPlaylist(name) {
  const res = await fetch(`${API}/api/auth/playlists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name })
  })
  return res.json()
}

// DELETE - zmaz playlist
export async function deletePlaylist(id) {
  const res = await fetch(`${API}/api/auth/playlists/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
  return res.json()
}

// POST - pridaj piesne do playlistu
export async function addSongToPlaylist(playlistId, songId) {
  const res = await fetch(`${API}/api/auth/playlists/${playlistId}/songs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ songId })
  })
  return res.json()
}

// GET - piesne v playliste
export async function getPlaylistSongs(playlistId) {
  const res = await fetch(`${API}/api/auth/playlists/${playlistId}/songs`, {
    credentials: 'include'
  })
  return res.json()
}

// GET - search piesne
export async function searchSongs(query) {
  const res = await fetch(`${API}/api/auth/songs/search?q=${query}`, {
    credentials: 'include'
  })
  return res.json()
}