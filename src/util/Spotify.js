let accessToken = '';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const redirect_uri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.includes('access_token')) {
      accessToken = window.location.href.match(/access_token=([^&]*)/);
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/);
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
    }
  },
  search (term) {
    // returns a promise that will eventually resolve to the list of tracks from the search
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      if(jsonResponse) {
        return jsonResponse.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artist[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
      return [];
    })
  },
  savePlaylist (playlistName, trackURIs) {
    const token = accessToken;
    let headers = { Authorization: `Bearer ${token}` };
    let user_id = '';
    // 1. GET current user's id
    fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      user_id = jsonResponse.id;
    });
    // 2. POST a new playlist with the input name to the current user's Spotify account. Receive the playlist ID back from the request.
    let playlistID = '';
    headers['Content-Type'] = 'application/json';
    fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`,{
      headers: headers,
      method: 'POST',
      body: {
        name: playlistName
      }
    }).then(response => {
      return response.json();
    }).then(jsonResponse => {
      playlistID = jsonResponse.id
    });
    // 3. POST the track URIs to the newly-created playlist, referencing the current user's account (ID) and the new playlist (ID)
    fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlist_id}/tracks`,{
      headers: headers,
      method: 'POST',
      body: {
        uris: trackURIs
      }
    }).then(response => {
      if(response.ok) {
        return response.json();
      }
    throw new Error('Request failed!');
    }, networkError => console.log(networkError.message));
  }
};

export default Spotify;
