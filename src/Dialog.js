import React, { Component } from "react";
import PropTypes from "prop-types";
import serializeForm from "form-serialize";
class Dialog extends Component {
  state = {
    recipeName: "",
    ingredients: "",
    steps: ""
  };
  handleSubmit = e => {
    e.preventDefault();
    const values = serializeForm(e.target, { hash: true });
    this.props.handleSubmit(values);
  };
  handleInput = e => {
    let inputVal = e.target.value;
    switch (e.target.id) {
      case "recipe-name-input":
        this.setState({ recipeName: inputVal });
        break;
      case "ingredients-input":
        this.setState({ ingredients: inputVal });
        break;
      case "steps-input":
        this.setState({ steps: inputVal });
        break;
      default:
        break;
    }
  };
  componentDidMount() {
    let renderRecipe = "";

    if (this.props.dialogType === "编辑菜谱") {
      renderRecipe = this.props.currentRecipe;

      this.setState({
        recipeName: renderRecipe.recipe,
        ingredients:
          renderRecipe.ingredients && renderRecipe.ingredients.join(" \\ "),
        steps:
          renderRecipe.directions && renderRecipe.directions.join(" \\\n\n")
      });
    }
  }

  render() {
    const { dialogType,buttonType,handleClose } = this.props;
    const { recipeName,ingredients,steps } = this.state;
    return (
      <div className="dialog-box">
        <h2>{dialogType}</h2>
        <div className="input-title">菜谱</div>
        <form onSubmit={this.handleSubmit}>
          <textarea
            rows="1"
            id="recipe-name-input"
            name="recipe-name"
            placeholder="菜谱名称"
            value={recipeName}
            onChange={this.handleInput}
          />
          <div className="input-title">原料</div>
          <textarea
            id="ingredients-input"
            name="ingredients"
            placeholder={
              '用"\\"来分隔各原料，如：\n\n牛奶 \\ 2个鸡蛋 \\ 1/3杯糖'
            }
            value={ingredients}
            onChange={this.handleInput}
          />
          <br />
          <div className="input-title">做法</div>
          <textarea
            id="steps-input"
            name="steps"
            placeholder={
              '用"\\"来分隔各步骤，如：\n\n把烤箱预加热到350°F \\ \n把原料加到馅饼糊上 \\ \n烤至馅饼皮呈金黄色。'
            }
            value={steps}
            onChange={this.handleInput}
          />
          <br />
          <button onClick={handleClose} className="corner-close">
            <i className="fa fa-times" />
          </button>
          <button type="submit">
            {buttonType}
          </button>
          <button
            type="button"
            onClick={handleClose}>
            关闭
          </button>
        </form>
      </div>
    );
  }
}

Dialog.propTypes = {
  dialogType: PropTypes.string.isRequired,
  buttonType: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  currentRecipe: PropTypes.object.isRequired
};
export default Dialog;
