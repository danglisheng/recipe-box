import React,{Component} from 'react';
/* 菜单索引视图 */
export default class IndexView extends Component {
  render() {
    let recipes = this.props.contents;
    let items = recipes.map((recipe, i) => (
        <div
          onClick={this.props.showOnClick}
          key={i}  className='index-view-item'>
            {recipe.recipe.replace(/-/g, ' ')}
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
