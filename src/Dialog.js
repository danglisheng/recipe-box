import React,{Component} from 'react';
export default class Dialog extends Component {
  render() {
    return (
      <div className='dialog-box'>
        <h2>{this.props.dialogType}</h2>
        <div className='input-title'>
          菜谱
        </div>
        <textarea rows='1' id="recipe-name-input"
          placeholder="菜谱名称">
        </textarea>
        <div className='input-title'>
          原料
        </div>
        <textarea id="ingredients-input" placeholder=
          {'用"\\"来分隔各原料，如：\n\n牛奶 \\ 2个鸡蛋 \\ 1/3杯糖'
          }/><br/>
        <div className='input-title'>
          做法
        </div>
        <textarea id="steps-input" placeholder=
          {'用"\\"来分隔各步骤，如：\n\n把烤箱预加热到350°F \\ \n把原料加到馅饼糊上 \\ \n烤至馅饼皮呈金黄色。'
          } /><br/>
        <button
          onClick={this.props.handleClose}
          className='corner-close'>
            <i className='fa fa-times'/>
        </button>
        <button 
          id={this.props.submitID}
          onClick={this.props.handleSubmit}>
            {this.props.buttonType}
        </button>
        <button 
          id={this.props.closeID}
          onClick={this.props.handleClose}>
            关闭
        </button>
      </div>
    )
  }
}
