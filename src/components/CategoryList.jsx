import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getCategories } from '../services/api';

class CategoryList extends Component {
  state = {
    categories: [],
  }

  async componentDidMount() {
    // recebe as categorias para criar os botões
    const categories = await getCategories();
    this.setState({
      categories,
    });
  }

  render() {
    const { categories } = this.state;
    const { handleCategoryButton, showCategorysFunction, showCategory } = this.props;

    return (
      <div
        className={ showCategory ? 'categoryListContainer' : 'categoryNoShow' }
      >
        {/* renderiza as categorias encontradas */}
        <article>
          <div className="categoryHeadContainer">
            <h3 className="categoryTitle">Selecione uma categoria</h3>
            <button type="button" onClick={ showCategorysFunction }>✖</button>
          </div>
          <div className="categoryButtonsContainer">
            { categories.map((el) => (
              <button
                key={ el.id }
                id={ el.id }
                name={ el.name }
                data-testid="category"
                type="button"
                onClick={ handleCategoryButton }
                className="categoryBtn"
              >
                { el.name }
              </button>
            ))}
          </div>
        </article>
      </div>
    );
  }
}

export default CategoryList;

CategoryList.propTypes = {
  handleCategoryButton: PropTypes.func.isRequired,
  showCategorysFunction: PropTypes.func.isRequired,
  showCategory: PropTypes.bool.isRequired,
};
