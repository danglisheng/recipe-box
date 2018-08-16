import React, { Component } from "react";
import "./App.css";
import Dialog from "./Dialog";
import IndexView from "./IndexView";
import RecipePane from "./RecipePane";
import recipeAPI from './recipeAPI';
class App extends Component {
    constructor() {
        super();
        this.state = {
            showDialog: false, //是否显示对话框
            recipes: [], //所有菜谱
            dialogType: "", //对话框类型
            currentRecipe:null //当前菜谱对象
        };
     }
    componentDidMount() {
        /* 从后端获取所有菜谱 */
        recipeAPI.getAllRecipes().then((allRecipes)=>{
            this.setState({recipes:allRecipes});
              /* 若菜谱数组不为空，则设置当前菜谱*/
            if (allRecipes.length) {
            this.setState({
                currentRecipe: allRecipes[0] //当前菜谱
            });
        }
        });
    }
    /*获取菜谱名称列表*/
    getRecipeList=()=> {
        return this.state.recipes.map(recipe => recipe.recipe);
    }
   /*显示被点击的菜谱*/
    showOnClick=(e)=> {
        let id = e.target.id;
        this.showRecipe(id);
    }
    /* 显示菜谱 */
    showRecipe=(id)=>{
        /*遍历包含所有菜谱的数组，找到recipe id为id的，设置为currentRecipe*/
        let isNewRecipeShow = false;
        this.state.recipes.forEach(recipe => {
           if (recipe.objId === id) {
                this.setState({ currentRecipe: recipe });
                isNewRecipeShow = true;
            }
        });
        /* 若没找到匹配的可显示菜谱，则清空显示*/
        if (!isNewRecipeShow) {
            this.setState({ currentRecipe: null });
        }
    }

    /*构建新的菜谱对象*/
    constructNewRecipeObj(recipeValues,typeIsAdd) {
         /* 使用用户输入的内容来构建新菜谱 */
        let newRecipe = {
            recipe: recipeValues["recipe-name"],
            ingredients:recipeValues["ingredients"]&&recipeValues["ingredients"].split("\\"),
            directions:recipeValues["steps"]&&recipeValues["steps"].split("\\")
           };
        if (!newRecipe.recipe) {
            alert("你的菜单必须有个名称!");
        } else {
            return newRecipe;
        }
    }
    /*关闭对话框，把菜谱保存到App组件的状态中，然后显示刚刚保存的菜谱*/
    saveRecipeToLSandStateThenShow=(recipes, newRecipe)=> {
        this.setState({
            recipes: recipes,
            showDialog: !this.state.showDialog
        });
        setTimeout(() => {
            this.showRecipe(newRecipe.objId);
        }, 10);
    }
    saveRecipe=(recipeValues) =>{
        let recipes = [...this.state.recipes];
        let typeIsAdd = this.state.dialogType === "Add Recipe" ? true : false;
        let newRecipe = this.constructNewRecipeObj(recipeValues,typeIsAdd);
        /*如果返回了合法菜谱，则执行以下语句*/
        if (newRecipe) {
            /*若对话框类型是添加菜谱*/
            if (typeIsAdd) {
                let recipeList = this.getRecipeList();
                if (recipeList.indexOf(newRecipe.recipe) !== -1) {
                    alert(`${newRecipe.recipe} 已经被添加到了菜谱列表中!`);
                } else {
                    recipeAPI.addRecipe(newRecipe).then((recipe)=>{
                        newRecipe.objId=recipe.id;
                        recipes.push(newRecipe);
                        this.saveRecipeToLSandStateThenShow(recipes, newRecipe);
                    })
                    
                }
            } else {
            /* 若对话框类型是编辑菜谱*/
                let recipeIndex;
                recipes.forEach((obj, i) => {
                    if (obj.objId === this.state.currentRecipe.objId) {
                        recipeIndex = i;
                    }
                });
                
                recipeAPI.editRecipe(this.state.currentRecipe.objId,newRecipe)
                .then((recipe)=>{
                    newRecipe.objId=recipe.id;
                    recipes[recipeIndex] = newRecipe;
                    this.saveRecipeToLSandStateThenShow(recipes, newRecipe);
                })
            }
        }
    }

    deleteRecipe=(e) =>{
        const recipeToDelete =this.state.currentRecipe.recipe;
        const recipeToDeleteObjId=this.state.currentRecipe.objId;
        let recipes = this.state.recipes;
        if (
            window.confirm(
                '您确定要从菜谱中删除"' +
                    recipeToDelete.replace("-", " ") +
                    '"吗?'
            )
        ) {
            let recipeList=this.getRecipeList();
            let idx=recipeList.indexOf(recipeToDelete);
            let recipeToFocus=(idx>=1)?(recipeList[idx-1]):recipeList[1];
            // 确定删除后得到焦点的菜谱id
            let recipeToFocusId;
            this.state.recipes.forEach((recipe)=>{
                if(recipe.recipe===recipeToFocus){
                    recipeToFocusId=recipe.objId;
                }
            })
            recipeAPI.deleteRecipe(recipeToDeleteObjId).then((success)=>{
                recipes = recipes.filter(obj => {
                    return obj.recipe !== recipeToDelete;
                });
                this.showRecipe(recipeToFocusId);
                this.setState({
                recipes: recipes
                });
            })
        }
    }
    
    toggleDialogDisplay=(e)=> {
        let indicator =
            e.currentTarget.title !== undefined ? e.currentTarget.title : "";
        this.setState({
            dialogType: indicator,
            showDialog: !this.state.showDialog
        });
    }
    render() {
        const { dialogType,showDialog,recipes,currentRecipe }=this.state;
        let dialogText =
            dialogType === "Add Recipe"
                ? ["添加菜谱", "添加"]
                : ["编辑菜谱", "保存"];

        let dialogBox;
        if (showDialog) {
            dialogBox = (
                <div className="dialog-wrap">
                    <Dialog
                        dialogType={dialogText[0]}
                        buttonType={dialogText[1]}
                        handleSubmit={this.saveRecipe}
                        handleClose={this.toggleDialogDisplay}
                        currentRecipe={currentRecipe}
                    />
                </div>
            );
        }
        return (
            <div className="recipe-box-wrapper">
                <div className="heading">
                    <div>菜谱</div>
                </div>
                {dialogBox}
                <IndexView
                    showOnClick={this.showOnClick}
                    recipes={recipes}
                />
                <RecipePane
                    currentRecipe={currentRecipe}
                    deleteRecipe={this.deleteRecipe}
                    handleEdit={this.toggleDialogDisplay}
                />
                <div className="add-button">
                    <button
                        id="add-recipe"
                        title="Add Recipe"
                        onClick={this.toggleDialogDisplay}
                    >
                        <i className="fa fa-plus-square-o" />
                    </button>
                </div>
            </div>
        );
    }
}
export default App;
