const accessToken = '';
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
  }
  search (term){
    // returns a promise that will eventually resolve to the list of tracks from the search
    fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
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
  }
};

export default Spotify;
