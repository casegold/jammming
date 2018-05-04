import React, { Component } from 'react';
import './App.css';

// Import components
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchResults:[],
      playlistName:'New Playlist',
      playlistTracks:[]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }
    console.log('Adding track to playlist, ', track);
    const newPlaylistTracks = (this.state.playlistTracks || []).concat(track);
    this.setState({playlistTracks: newPlaylistTracks});
    // this.setState({ playlistTracks: [ ...(this.state.playlistTracks || []) ].concat(track) });
  }
  removeTrack (track) {
    // const newPlaylistTracks = this.state.playlistTracks.filter(removeTrack => removeTrack.id !== track.id)
    this.setState({playlistTracks: this.state.playlistTracks.filter(removeTrack => removeTrack.id !== track.id)});
  }
  updatePlaylistName (name) {
    this.setState({playlistName: name});
  }
  savePlaylist () {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    console.log('Saving playlist to Spotify: ' + this.state.playlistTracks.name);
    Spotify.savePlaylist(this.state.playlistName, trackURIs);
    this.updatePlaylistName('New Playlist');
    this.setState({playlistTracks:[]});
  }
  search (term) {
    console.log('Searching Spotify with ' + term);
    Spotify.search(term).then(tracks => {
      this.setState({ searchResults: tracks});
    });
    console.log('searchResults returns, ', this.state.searchResults);
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName}
              playlistTracks={this.state.playlistTracks}
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
