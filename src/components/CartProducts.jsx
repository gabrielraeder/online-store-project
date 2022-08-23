import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addToCart, removeFromCart } from '../services/localStorage';

export default class CartProducts extends Component {
  constructor() {
    super();
    this.addProduct = this.addProduct.bind(this);
    this.removeProduct = this.removeProduct.bind(this);
  }

  state = {
    count: 0,
    disabledMinus: false,
    disabledPlus: false,
  }

  componentDidMount() {
    // recebe a quantidade existente do produto
    const { product: { counter } } = this.props;
    this.setState({
      count: counter,
    }, () => {
      const { count } = this.state;
      this.setState({
        disabledMinus: count === 1,
      });
    });
  }

  // adiciona produto ao carrinho já com a quantidade
  addProduct(product) {
    const { updateTotalCount } = this.props;
    this.setState((prevState) => ({
      count: prevState.count + 1,
      disabledMinus: false,
    }), () => {
      addToCart(product);
      updateTotalCount();
      const { available_quantity: availability } = product;
      const { count } = this.state;
      if (count === availability) {
        this.setState({
          disabledPlus: true,
        });
      }
      const { getCartLength } = this.props;
      getCartLength();
    });
  }

  // remove produto do carrinho
  removeProduct(product) {
    const { updateTotalCount } = this.props;
    this.setState((prevState) => ({
      count: prevState.count - 1,
      disabledPlus: false,
    }), () => {
      const { count } = this.state;
      removeFromCart(product);
      updateTotalCount();
      if (count === 1) {
        this.setState({
          disabledMinus: true,
        });
      }
      const { getCartLength } = this.props;
      getCartLength();
    });
  }

  render() {
    const { count, disabledMinus, disabledPlus } = this.state;
    const { product, removeAllOfThisProduct } = this.props;
    const { title, price, thumbnail } = product;
    return (
      <li className="cartProduct">

        <img src={ thumbnail } alt={ title } className="cartProductImage" />

        <h4 data-testid="shopping-cart-product-name" className="carProductTitle">{title}</h4>

        <div className="flex centered productCountContainer">
          {/* botão para diminuir quantidade do produto */}
          <button
            type="button"
            data-testid="product-decrease-quantity"
            onClick={ () => this.removeProduct(product) }
            disabled={ disabledMinus }
            className="cartButtons"
          >
            ➖
          </button>

          <p data-testid="shopping-cart-product-quantity" className="cartProductQuantity">{count}</p>
          {/* botão para aumentar quantidade do produto */}
          <button
            type="button"
            data-testid="product-increase-quantity"
            onClick={ () => this.addProduct(product) }
            disabled={ disabledPlus }
            className="cartButtons"
          >
            ➕
          </button>
        </div>
        <div className="prices">
          <p className="cartProductPrice">{`✕ ${price.toFixed(2)}`}</p>
          <h3 className="productTotal">{`R$ ${(count * price).toFixed(2)}`}</h3>
        </div>
        {/* botão para excluir produto do carrinho */}
        <button
          type="button"
          data-testid="remove-product"
          onClick={ () => removeAllOfThisProduct(product) }
          className="cartButtons trashBtn"
        >
          <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path className="trashIcon" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

      </li>
    );
  }
}

CartProducts.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    counter: PropTypes.number.isRequired,
  }).isRequired,
  removeAllOfThisProduct: PropTypes.func.isRequired,
  updateTotalCount: PropTypes.func.isRequired,
};
