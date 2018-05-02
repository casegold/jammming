import React, { Component } from 'react';
import './App.css';

// Import components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults: [{
        name:'default_name',
        artist:'default_artist',
        album:'default_album',
        id:'default_id'
      }],
      playlistName:'default_playlistName',
      playlistTracks:[{
        name:'default_name_pl',
        artist:'default_artist_pl',
        album:'default_album_pl',
        id:'default_id_pl'
      }]
    };
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} />
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
