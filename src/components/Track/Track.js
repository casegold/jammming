import React from 'react';
import './Track.css';

class Playlist extends React.Component {
  renderAction () {
    if (this.props.isRemoval) {
      return '-';
    }
    return '+';
  }

  render () {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3><!-- track name will go here --></h3>
          <p><!-- track artist will go here--> | <!-- track album will go here --></p>
        </div>
        <a className="Track-action">{renderAction()}</a>
      </div>
    );
  }


export default Track;
