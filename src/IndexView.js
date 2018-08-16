import React from 'react';
import PropTypes from 'prop-types';
/* 菜单索引视图 */
class IndexView extends React.PureComponent {
  render(){
     let {recipes,showOnClick }= this.props;
     let items = recipes.map((recipe) => (
            <div
              onClick={showOnClick}
              key={recipe.objId}  
              id = { recipe.objId}
              className='index-view-item'>
                {recipe.recipe}
            </div>
          )
        );
        return (
          <div id='index-view'>
              {items}
          </div>
        )
  }
}

IndexView.propTypes= {
  recipes:PropTypes.array.isRequired,
  showOnClick:PropTypes.func.isRequired
}
export default IndexView;
