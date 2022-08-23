import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { addToCart } from '../services/localStorage';
import { getProductFromId } from '../services/api';

export default class Product extends Component {
  state = {
    thisProduct: {},
    picsUrls: [],
    picNumber: 0,
  }

  async componentDidMount() {
    const { product } = this.props;
    this.setState({
      thisProduct: await getProductFromId(product.id),
    }, () => {
      const { thisProduct: { pictures } } = this.state;
      this.setState({ picsUrls: pictures.map((pic) => pic.url)})
    })
    const { picsUrls } = this.state;
    if (picsUrls.length > 0) {
      this.intervalID = setInterval(() => {
        this.setState((prevState) => ({
          picNumber: prevState.picNumber < picsUrls.length - 1 ? prevState.picNumber + 1 : 0,
        }) );
      }, ((Math.floor(Math.random() * (6 - 2)) + 2) * 1000));
    }
  }
  
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // adiciona produto ao carrinho
  addToStorage = () => {
    const { product, getCartLength } = this.props;
    addToCart(product);
    getCartLength();
  }

  prevPicture = () => {
    const { picsUrls } = this.state;
    this.setState((prevState) => ({
      picNumber: prevState.picNumber === 0 ? picsUrls.length - 1 : prevState.picNumber - 1,
    }))
  }

  nextPicture = () => {
    const { picsUrls } = this.state;
    this.setState((prevState) => ({
      picNumber: prevState.picNumber === picsUrls.length - 1 ? 0 : prevState.picNumber + 1,
    }))
  }

  render() {
    const { picNumber, picsUrls } = this.state;
    const { product } = this.props;
    const { title, thumbnail, price, id, shipping } = product;
    const { free_shipping: freeShip } = shipping;
    const priceFixed = typeof price === 'number' ? `R$ ${price.toFixed(2)}` : 0;
    const pic = picsUrls ? picsUrls[picNumber] : thumbnail

    const titleLimited = title.substring(0, 50) + '...'

    return (

      // produto
      <div data-testid="product" className="products">
        <div className="flexColumn centered productImageContainer">
          <img src={ pic } alt={ title } className="productImage" />
        </div>
        <div>
          <button className="picturesBtn" type="button" onClick={ this.prevPicture }>◀</button>
          <button className="picturesBtn" type="button" onClick={ this.nextPicture }>▶</button>
        </div>
        <Link
          to={ `/product-details/${id}` }
          data-testid="product-detail-link"
          className="productLink"
        >
          <h3 className="productTitle">{titleLimited}</h3>
          <h2 className="productPrice">{ priceFixed }</h2>
          {freeShip && <h4 data-testid="free-shipping" className="freeShip">🚚 GRÁTIS</h4>}
        </Link>
        <button
          type="button"
          data-testid="product-add-to-cart"
          onClick={ this.addToStorage }
          className="productButton"
        >
          Adicionar ao Carrinho
        </button>
      </div>
    );
  }
}

Product.defaultProps = {
  product: { shipping: { freeShip: false } },
};

Product.propTypes = {
  product: PropTypes.shape({
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
    shipping: PropTypes.shape().isRequired,
  }),
  getCartLength: PropTypes.func.isRequired,
};
