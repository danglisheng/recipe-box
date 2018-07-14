import React, { Component } from "react";
export default class RecipePane extends Component {
  render() {
    if (this.props.currentRecipe) {
      let currentRecipe = this.props.currentRecipe;
      
      return <div className="recipe-view">
          <div className="recipe-title">
            <div className="recipe-view-name title-row">
              {currentRecipe.recipe.replace(/-/g, " ")}
            </div>
            <div className="title-row">
              <button
                onClick={this.props.deleteRecipe}
                title="Delete Recipe"
                value={currentRecipe.recipe}
              >
                <i className="fa fa-trash" />
              </button>
              <button
                onClick={this.props.handleEdit}
                title="Edit Recipe"
                value={currentRecipe.recipe}
              >
                <i className="fa fa-pencil-square-o" />
              </button>
            </div>
          </div>
          <div className="recipe-body">
            <h4>原料:</h4>
            <ul className="ingredient list">
              {currentRecipe.ingredients.map((ingredient, j) => (
                <li key={j}>{ingredient}</li>
              ))}
            </ul>
            <h4>做法:</h4>
            <ol className="directions list">
              {currentRecipe.directions.map((step, k) => (
                <li key={k}>{step}</li>
              ))}
            </ol>
          </div>
        </div>;
    }else {
      return <div className="recipe-view"></div>
    }

    
  }
}
