import React, { Component } from 'react';

export default class SearchBar extends Component {
  render() {
    const { handleChange, searchProducts, searchInput } = this.props;

    return (
      <div className="flex centered">
        {/* input de busca */}
        <input
              name="searchInput"
              type="text"
              value={ searchInput }
              onChange={ handleChange }
              data-testid="query-input"
              className="searchInput"
            />

            {/* botão de busca */}
            <button
              data-testid="query-button"
              type="button"
              onClick={ searchProducts }
              className="queryButton"
            >
              🔍
            </button>

      </div>
    );
  }
}
