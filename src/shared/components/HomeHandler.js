import React from 'react';
import connectToStores from 'flummox/connect';
import {Link} from 'react-router';

class HomeHandler extends React.Component {
  displayName: 'Home'

  render() {
    return (
      <header className="clearfix">
        Application Name

        <nav className="clearfix">
          <div className="nav-item">
            <Link to="home">Home</Link>
          </div>
          <div className="nav-item">
            <Link to="info">Info</Link>
          </div>
        </nav>
      </header>
    );
  }
}

export default HomeHandler;
