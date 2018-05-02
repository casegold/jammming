const accessToken = '';

const Spotify = {
  getAccessToken: function(){
    if (accessToken) {
      return accessToken;
    }
  }
};

export default Spotify;
