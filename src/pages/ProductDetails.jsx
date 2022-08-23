import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getProductFromId } from '../services/api';
import { addToCart } from '../services/localStorage';
import EvaluationForm from '../components/EvaluationForm';
import '../css/productDetails.css';

const PHOTO_TIMER = 3500;

export default class ProductDetails extends Component {
  state = {
    product: {},
    evalResults: [],
    mapAttr: [],
    picsUrls: [],
    picNumber: 0,
  }

  async componentDidMount() {
    const { getCartLength } = this.props;
    getCartLength();
    await this.getProduct();
    this.getSavedEvaluations();
    const { product: { pictures } } = this.state;
    if (pictures) {
      this.setState({ picsUrls: pictures.map((pic) => pic.url)})
      this.intervalID = setInterval(() => {
        this.setState((prevState) => ({
          picNumber: prevState.picNumber < pictures.length - 1 ? prevState.picNumber + 1 : 0,
        }));
      }, PHOTO_TIMER);
    }
  
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  // recupera avaliações do produto no localStorage
  // se não houver nada salva um array vazio para não dar erro
  // atualiza o estado com o resultado
  getSavedEvaluations = () => {
    const { product } = this.state;
    const evalsRetrieved = JSON.parse(localStorage.getItem(product.id));
    if (!evalsRetrieved) localStorage.setItem(product.id, JSON.stringify([]));
    const realEval = JSON.parse(localStorage.getItem(product.id));
    this.setState({ evalResults: realEval });
  }

  // Salva novas avaliações no localStorage
  handleSubmitForm = ({ emailInput, evalInput, gradeChosen }) => {
    const { evalResults, product } = this.state;
    localStorage.setItem(product.id, JSON
      .stringify([...evalResults, { emailInput, evalInput, gradeChosen }]));

    this.getSavedEvaluations();
  }

  // adiciona um item no localStorage
  addToStorage = () => {
    const { product } = this.state;
    const { getCartLength } = this.props;
    addToCart(product);
    getCartLength();
  }

  // faz o fetch de um item a partir
  // do id recebido por props
  // (é chamada no componentDidMount)
  getProduct = async () => {
    const { match: { params: { id } } } = this.props;
    const product = await getProductFromId(id)
      .then((data) => data);

    this.setState({ product }, () => {
      this.setState({
        mapAttr: this.mapAttributes(),
      });
    });
  }

  // mapeia os atributos do produto para exibição na tela
  mapAttributes = () => {
    const { product: { attributes } } = this.state;
    return attributes.map((att, i) => {
      if (att.value_name === null || att.name === 'SKU') return null;
      return (
        <p key={ i }>
          <strong>{`${att.name}: `}</strong>
          { att.value_name }
        </p>);
    });
  }

  // foto anterior
  prevPicture = () => {
    const { picsUrls } = this.state;
    this.setState((prevState) => ({
      picNumber: prevState.picNumber === 0 ? picsUrls.length - 1 : prevState.picNumber - 1,
    }))
  }

  // proxima foto
  nextPicture = () => {
    const { picsUrls } = this.state;
    this.setState((prevState) => ({
      picNumber: prevState.picNumber === picsUrls.length - 1 ? 0 : prevState.picNumber + 1,
    }))
  }

  render() {
    const { product, evalResults, cartSize, mapAttr, picsUrls, picNumber } = this.state;
    const { thumbnail, title,
      price, available_quantity: avalibility, shipping } = product;
    const stringOfCartSize = JSON.stringify(cartSize);
    const priceFixed = typeof price === 'number' && `R$ ${price.toFixed(2)}`;
    const freeShip = shipping !== undefined ? shipping.free_shipping : false;
    const pic = picsUrls ? picsUrls[picNumber] : thumbnail;

    return (
      <div className=" flexColumn centered productDetailsContainer">

        {/* detalhes do produto */}
        <section className="flexColumn centered productSection">

          <div className="detailsPageContainer">
            <h2 data-testid="product-detail-name">{ title }</h2>
            <div>
              <div className="flexColumn centered detailImageContainer">
                <img src={ pic } alt={ title } data-testid="product-detail-image" />
              </div>
              <div>
                <button className="picturesBtn" type="button" onClick={ this.prevPicture }>◀</button>
                <button className="picturesBtn" type="button" onClick={ this.nextPicture }>▶</button>
              </div>
              <h2 data-testid="product-detail-price">{ priceFixed }</h2>
            </div>

            <div className="flexColumn detailsInfoContainer">
              { avalibility > 0 && <p>Estoque disponível</p> }
              { freeShip && <p>🚚 Frete Grátis</p> }
              <button
                type="button"
                onClick={ this.addToStorage }
                data-testid="product-detail-add-to-cart"
                className="productDetailButtons"
              >
                Adicionar ao Carrinho
              </button>
              {/* link para o carrinho */}
              <Link to="/shopping-cart">
                <button
                  type="button"
                  data-testid="shopping-cart-button"
                  className="productDetailButtons"
                >
                  <span data-testid="shopping-cart-size">{ stringOfCartSize }</span>
                  Ir ao Carrinho
                </button>
              </Link>
            </div>

          </div>

          <div className="flexColumn centered specificationsContainer">
            <fieldset className="specifications">
              <legend><h2>Especificações Técnicas</h2></legend>
              { mapAttr }
            </fieldset>
          </div>

        </section>

        {/* formulário para avaliação do produto */}
        <EvaluationForm
          product={ product }
          evals={ evalResults }
          handleSubmitForm={ this.handleSubmitForm }
        />
      </div>
    );
  }
}

ProductDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  history: PropTypes.shape().isRequired,
};
