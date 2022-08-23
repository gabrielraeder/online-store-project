import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../css/App.css';
import '../css/EvaluationForm.css';

const INITIAL_STATE = {
  emailInput: '',
  isValid: true,
  evalInput: '',
  gradeChosen: 0,
};

export default class EvaluationForm extends Component {
  state = { ...INITIAL_STATE };

  // altera valores dos inputs
  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  }

  // valida os campos do formulário
  validateForm = () => {
    const { emailInput, gradeChosen } = this.state;
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+/g;
    const validEmail = emailRegex.test(emailInput);
    const validGrade = gradeChosen > 0;
    const isValid = validEmail && validGrade;
    return isValid;
  }

  // cria divs contendo notas de 1 a 5
  evaluationGrades = () => {
    const maxGrade = 5;
    const auxArray = Array(maxGrade).fill();
    const { gradeChosen } = this.state;

    const grades = auxArray.map((_, ind) => (
      <div
        key={ ind }
        data-testid={ `${ind + 1}-rating` }
        id={ ind + 1 }
        onClick={ this.handleGradeClick }
        role="presentation"
        className={ ind < gradeChosen ? 'colorStar' : 'star' }
      >
        {}
      </div>
    ));
    return grades;
  }

  // altera o estado da nota escolhida
  handleGradeClick = ({ target: { id } }) => this.setState({
    gradeChosen: id });

  // salva avaliação do produto e limpa os campos de avaliação
  handleSubmitClick = () => {
    const { emailInput, evalInput, gradeChosen } = this.state;
    const { handleSubmitForm } = this.props;
    const validate = this.validateForm();
    if (validate) {
      handleSubmitForm({ emailInput, evalInput, gradeChosen })
      this.setState({
        ...INITIAL_STATE,
        isValid: true,
      })
    } else {
      this.setState({
        isValid: false,
      })
    }
  }

  render() {
    const { emailInput, evalInput, isValid } = this.state;
    const { evals } = this.props;

    // let items = evals;
    // if (evalResults.length > 0) items = evalResults;

    return (
      <div className="flexColumn evalContainer">
        <form className="flexColumn centered evalForm">
          <h2>Avalie este produto</h2>
          <div className="flex emailGradeContainer">
            {/* campos para avaliar um produto */}
            <label htmlFor="emailInput" className="flexColumn centered emailLabel">
              Email :
              <input
                placeholder="Seu e-mail"
                required
                name="emailInput"
                id="emailInput"
                value={ emailInput }
                onChange={ this.handleChange }
                type="text"
                data-testid="product-detail-email"
                className="emailInput"
              />
            </label>
            <label htmlFor="gradesList">
              Nota :
              <div className="flex centered">{ this.evaluationGrades() }</div>
            </label>
          </div>

          <div className="comentContainer">
            <label htmlFor="evalInput" className="flexColumn centered comentLabel">
              Comentário :
              <textarea
                placeholder="Deixe seu comentário"
                id="evalInput"
                name="evalInput"
                value={ evalInput }
                onChange={ this.handleChange }
                data-testid="product-detail-evaluation"
                cols="40"
                rows="2"
                className="evalInput"
              />
            </label>
          </div>
          {/* condicional dos campos inválidos */}
          { !isValid && <p className="invalidFields">Campos inválidos</p> }

          {/* botão para salvar avaliação */}
          <button
            type="button"
            data-testid="submit-review-btn"
            onClick={ this.handleSubmitClick }
            className="productDetailButtons"
          >
            Enviar avaliação
          </button>

        </form>

        {/* renderiza todas as avaliações */}
        <section className="savedEvals">
          { Array.isArray(evals) && evals.map(({
            emailInput: email,
            evalInput: evalu,
            gradeChosen: grade,
          }, ind) => {
            const stars = Array(Number(grade)).fill('✭')
            return (
            <div key={ ind } className="productEvals">
              <h5 data-testid="review-card-email">{ email }</h5>
              <h2 data-testid="review-card-rating">{ stars }</h2>
              <p data-testid="review-card-evaluation">{ evalu }</p>
              <hr />
            </div>
          )})}
        </section>

      </div>
    );
  }
}

EvaluationForm.defaultProps = {
  product: { id: '' },
};

EvaluationForm.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string,
  }),
  evals: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
