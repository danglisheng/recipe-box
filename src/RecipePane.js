import React, { PureComponent } from "react";
import PropTypes from 'prop-types';
class RecipePane extends PureComponent {
  render() {
    const { currentRecipe, deleteRecipe, handleEdit } = this.props;
    if (currentRecipe) {
      return (
        <div className="recipe-view">
          <div className="recipe-title">
            <div className="recipe-view-name title-row">
              {currentRecipe.recipe.replace(/-/g, " ")}
            </div>
            <div className="title-row">
              <button onClick={deleteRecipe} title="Delete Recipe">
                <i className="fa fa-trash" />
              </button>
              <button onClick={handleEdit} title="Edit Recipe">
                <i className="fa fa-pencil-square-o" />
              </button>
            </div>
          </div>
          <div className="recipe-body">
            <h4>原料:</h4>
            <ul className="ingredient list">
              {currentRecipe.ingredients &&
                currentRecipe.ingredients.map((ingredient, j) => (
                  <li key={j}>{ingredient}</li>
                ))}
            </ul>
            <h4>做法:</h4>
            <ol className="directions list">
              {currentRecipe.directions &&
                currentRecipe.directions.map((step, k) => (
                  <li key={k}>{step}</li>
                ))}
            </ol>
          </div>
        </div>
      );
    } else {
      return <div className="recipe-view" />;
    }
  }
}
RecipePane.propTypes={
  currentRecipe:PropTypes.object,
  deleteRecipe:PropTypes.func.isRequired,
  handleEdit:PropTypes.func.isRequired
}
export default RecipePane;