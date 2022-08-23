import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import CategoryList from '../components/CategoryList';
import Product from '../components/Product';
import '../css/ProductList.css';
import { sortProducts } from '../services/helpers';

export default class ProductsList extends Component {
  state = {
    buttonClicked: false,
    sorting: '',
    showCategory: false,
  }


  // reconhece mudança nos inputs
  handleChange = ({ target: { name, value } }) => {
    this.setState({
      [name]: value,
    });
  }

  // altera o estado do botão
  // para fazer o redirecionamento
  handleClick = () => {
    this.setState({ buttonClicked: true });
  }

  // mapeia produtos de acordo com seletor de ordenação
  getProducts = (myProducts) => {
    const { sorting } = this.state;
    const sortedProducts = sortProducts(myProducts, sorting);
    return this.mapingProductElements(sortedProducts);
  }

  // mapeia os produtos, acionado na função getProducts
  mapingProductElements = (myProducts) => {
    const { getCartLength } = this.props;
    return myProducts.map((product) => (
      <Product
        key={ product.id }
        product={ product }
        getCartLength={ getCartLength }
      />
    ))
    }

  // controla a aparição da aba de categorias
  showCategorysFunction = () => {
    this.setState((prevState) => ({
      showCategory: !prevState.showCategory,
    }));
  }

  render() {
    const { buttonClicked,
      showCategory } = this.state;

    const { handleCategoryButton, mapProducts } = this.props;

    const categories = (<CategoryList
      handleCategoryButton={ handleCategoryButton }
      showCategory={ showCategory }
      showCategorysFunction={ this.showCategorysFunction }
    />);

    return (
      <div>
        <main className="flexColumn centered main">

          <section className="flex searchContainer">

            {mapProducts.length > 0 && (
              <label htmlFor="sorting" className="sortLabel">
                Ordenar por :
                <select name="sorting" id="sorting" className="sorting" onChange={ this.handleChange }>
                  <option value="rel">Relevância</option>
                  <option value="lowPrice">Menor preço</option>
                  <option value="highPrice">Maior preço</option>
                  <option value="mostSold">Mais vendidos</option>
                </select>
              </label>
            )}

            {/* condicional do redirecionamento */}
            {buttonClicked && <Redirect
              to="/shopping-cart"
              data-testid="shopping-cart-button"
            />}

          </section>

          {/* lista de categorias */}
          {/* botão para exibir lista de categorias */}
          { !showCategory ? (
            <button
              className="categoryShowButton"
              type="button"
              onClick={ this.showCategorysFunction }
            >
              <h3 className="categoryTitle">
                Exibir categorias
                <span className="arrowSpan">▼</span>
              </h3>
            </button>) : (categories)}

          {/* mensagem antes da busca ser realizada */}
          { mapProducts.length === 0 && (
            <h2
              data-testid="home-initial-message"
            >
              Digite algum termo de pesquisa ou escolha uma categoria.
            </h2>) }

          {/* condicional dos produtos */}
          { !mapProducts.length ? <p>Nenhum produto foi encontrado</p>
            : <div className="productsContainer">{ this.getProducts(mapProducts) }</div> }
        </main>
      </div>
    );
  }
}
