import React, { Component } from 'react';
import SearchBar from './SearchBar';
import { Link } from 'react-router-dom';
import '../css/Header.css';
import cartIcon from '../images/cartIcon.png';
import CartPreview from '../components/CartPreview';

export default class Header extends Component {
  state = {
    showCartPreview: false,
  }

  showCart = () => {
    this.setState({
      showCartPreview: true,
    })
  }

  hideCart = () => {
    this.setState({
      showCartPreview: false,
    })
  }

  render() {
    const { handleChange, searchProducts, searchInput, handleRedirect, cartSize } = this.props;
    const { showCartPreview } = this.state;
    return (
      <header className="flex head">
        <Link to="/" className="titleLink">
          <h1 className="flexColumn centered headTitle">FrontEnd Online Store</h1>
        </Link>
          <SearchBar
            searchProducts={ searchProducts }
            handleChange={ handleChange }
            searchInput={ searchInput }
          />
        <nav className="navigation">
          <Link to="/">
            <button
              type="button"
              className="navButtons"
              onClick={ handleRedirect }
            >
              Página Inicial
            </button>
          </Link>
          <Link to="/checkout">
            <button
              type="button"
              className="navButtons"
              onClick={ handleRedirect }
            >
              Checkout
            </button>
          </Link>
          <Link to="/shopping-cart" className="cartLink">
              <button
                type="button"
                className="cartButton"
                onClick={ handleRedirect }
                onMouseOver={ this.showCart }
                onMouseLeave={ this.hideCart }
              >
                <img src={ cartIcon } alt="🛒" className="cartBtnImage" />
                <span data-testid="shopping-cart-size" className="cartQuantity">{ cartSize }</span>
              </button>
            </Link>
            { showCartPreview && <CartPreview showCart={ this.showCart } hideCart={ this.hideCart } /> }
        </nav>
      </header>
    );
  }
}
