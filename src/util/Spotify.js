let accessToken = '';
const client_id = 'b998a794f4c941189e81f2df4b284997';
const redirect_uri = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken;
    } else if (window.location.href.includes('access_token')) {
      accessToken = window.location.href.match(/access_token=([^&]*)/)[1];
      const expiresIn = window.location.href.match(/expires_in=([^&]*)/)[1];
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      window.location = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect_uri}`;
    }
  },
  search (term) {
    // returns a promise that will eventually resolve to the list of tracks from the search
    const token = this.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
       return response.json();
     }).then(jsonResponse => {
      // console.log('jsonResponse.tracks, ' , jsonResponse.tracks);
      if(jsonResponse) {
        return jsonResponse.tracks.items.map(track => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri
        }));
      }
      return [];
    })
  },
  async savePlaylist (playlistName, trackURIs) {
    const token = this.getAccessToken();
    let headers = { Authorization: `Bearer ${token}` };

    // 1. GET current user's id
    let user_id = await fetch(`https://api.spotify.com/v1/me`, {
      headers: headers
    }).then(response => {
      console.log('user_id response, ',response);
      return response.json();
    }).then(jsonResponse => {
      console.log('user_id jsonResponse, ',jsonResponse);
      console.log('user_id jsonResponse.id, ',jsonResponse.id);
      return jsonResponse.id;
    });
    // 2. POST a new playlist with the input name to the current user's Spotify account. Receive the playlist ID back from the request.
    headers['Content-Type'] = 'application/json';
    console.log('Debug: playlistName, ', playlistName);
    let playlistID = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        name: playlistName
      })
    }).then(response => {
      console.log('playlistName response, ',response);
      return response.json();
    }).then(jsonResponse => {
      console.log('playlistName jsonResponse, ',jsonResponse);
      console.log('playlistName jsonResponse.id, ',jsonResponse.id);
      return jsonResponse.id;
    });
    // 3. POST the track URIs to the newly-created playlist, referencing the current user's account (ID) and the new playlist (ID)
    fetch(`https://api.spotify.com/v1/users/${user_id}/playlists/${playlistID}/tracks`,{
      headers: headers,
      method: 'POST',
      body: JSON.stringify({
        uris: trackURIs
      })
    }).then(response => {
      console.log('POST response, ',response);
      console.log('POST responseJSON, ',response.json());
      if(response.ok) {
        return;
      }
    throw new Error('Request failed!');
    }, networkError => console.log(networkError.message));
  }
};

export default Spotify;
