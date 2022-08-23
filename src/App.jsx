import React, { Component } from 'react';
import { Switch, Route, BrowserRouter, Redirect } from 'react-router-dom';
import ShoppingCart from './pages/ShoppingCart';
import ProductsList from './pages/ProductsList';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Header from './components/Header';
import { getProductsFromCategoryAndQuery } from './services/api';
import { getSavedCartProducts } from './services/localStorage';

class App extends Component {
  state = {
    searchInput: '',
    products: [],
    redirect: false,
    cartSize: 0,
  }

  componentDidMount() {
    this.getCartLength();
  }

  getCartLength = () => {
    const cart = getSavedCartProducts();
    this.setState({ cartSize: !cart ? 0 : cart.length });
  }

  // reconhece mudança nos inputs
  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  }

  // handler do redirect para "/" ao pesquisar por novo produto em qualquer pagina
  handleRedirect = () => {
    this.setState({
      redirect: false,
    })
  }

  // verifica se a busca veio do input ou de um botão de categoria
  queryOrId = async (searchInput) => {
    if (searchInput.includes('MLB')) {
      const result = await getProductsFromCategoryAndQuery(searchInput, undefined)
        .then((data) => data);
      return result;
    }
    const result = await getProductsFromCategoryAndQuery(undefined, searchInput)
      .then((data) => data);
    return result;
  }

  // procura os produtos
  // (ocorre após a função de cima)
  searchProducts = async () => {
    const { searchInput } = this.state;
    const products = await this.queryOrId(searchInput)
      .then((response) => response);
    this.setState({
      products: products.results,
    }, () => {
      if(searchInput.length > 0) {
        this.setState({
          redirect: true,
        })
      }
    });
  }

  // busca produtos por categoria
  handleCategoryButton = async ({ target }) => {
    const products = await getProductsFromCategoryAndQuery(target.id, undefined)
      .then((data) => data);
    this.setState({
      products: products.results,
    });
  }

  render() {
    const { searchInput, redirect, products, cartSize } = this.state;

    return (
      <BrowserRouter>
        <Header
          searchProducts={ this.searchProducts }
          handleChange={ this.handleChange }
          searchInput={ searchInput }
          handleRedirect={ this.handleRedirect }
          cartSize={ cartSize }
        />
        { redirect && <Redirect to="/"/>}
        <Switch>
          <Route
            path="/product-details/:id"
            render={ (props) => (
              <ProductDetails
                { ...props }
                getCartLength={ this.getCartLength }
              />) }
          />
          <Route
            path="/shopping-cart"
            render={ () => (
              <ShoppingCart
                getCartLength={ this.getCartLength }
              />) }
          />
          <Route
            path="/checkout"
            component={ Checkout }
          />
          <Route
            exact
            path="/"
            render={ () => (
              <ProductsList mapProducts={ products }
                handleCategoryButton={ this.handleCategoryButton }
                getCartLength={ this.getCartLength }
              />) }
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
