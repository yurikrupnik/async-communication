import { Component } from 'solid-js';

const Header: Component = (props) => {
  return (
    <div>
      <header>
        <div>
          <a href="/prediction">Prediction</a>
        </div>
        <div>
          <a href="/prediction-filter">Prediction Filter</a>
        </div>
      </header>
    </div>
  );
};

export default Header;
