import React, { Component } from "react";
import "./App.css";
import { LSM } from "./index";
import Dialog from "./Dialog";
import IndexView from "./IndexView";
import RecipePane from "./RecipePane";
class App extends Component {
    constructor() {
        super();
        this.state = {
            showDialog: false, //是否显示对话框
            recipes: LSM.get(), //所有菜单
            dialogType: "" //对话框类型
        };
        this.getRecipeList = this.getRecipeList.bind(this);
        this.showOnClick = this.showOnClick.bind(this);
        this.showRecipe = this.showRecipe.bind(this);

        this.saveRecipeToLSandStateThenShow = this.saveRecipeToLSandStateThenShow.bind(
            this
        );
        this.saveRecipe = this.saveRecipe.bind(this);
        this.deleteRecipe = this.deleteRecipe.bind(this);
        this.populateFormData = this.populateFormData.bind(this);
        this.toggleDialogDisplay = this.toggleDialogDisplay.bind(this);
    }
    componentDidMount() {
        let recipes = this.state.recipes;
        /* 若菜谱数组不为空，则设置当前菜谱*/
        if (recipes.length) {
            this.setState({
                currentRecipe: recipes[0] //当前菜谱
            });
        }
    }
    /*获取菜谱名称列表*/
    getRecipeList() {
        return this.state.recipes.map(recipe => recipe.recipe);
    }
    /*显示被点击的菜谱*/
    showOnClick(e) {
        let RecipeName = e.target.innerText;
        RecipeName = RecipeName.split(" ").join("-");
        this.showRecipe(RecipeName);
    }
    /* 显示菜谱 */
    showRecipe(recipeName) {
        /*遍历包含所有菜谱的数组，找到recipe属性为当前菜谱名的，设置为currentRecipe*/
        let isNewRecipeShow = false;
        this.state.recipes.forEach(recipe => {
            if (recipe.recipe === recipeName) {
                this.setState({ currentRecipe: recipe });
                isNewRecipeShow = true;
            }
        });
        /* 若没找到匹配的可显示菜谱，则清空显示*/
        if (!isNewRecipeShow) {
            this.setState({ currentRecipe: "" });
        }
    }

    /*构建新的菜谱对象*/
    constructNewRecipeObj() {
        /*输入名称中的空格用“-”代替*/
        let recipeName = document
            .getElementById("recipe-name-input")
            .value.replace(/\s+/g, "-");
        /*删除曳尾的“-”*/
        if (recipeName.endsWith("-")) recipeName = recipeName.slice(0, -1);
        /* 使用用户输入的内容来构建新菜谱 */
        let newRecipe = {
            recipe: recipeName,
            ingredients: document
                .getElementById("ingredients-input")
                .value.split("\\"),
            directions: document.getElementById("steps-input").value.split("\\")
        };
        if (newRecipe.recipe === "") {
            alert("你的菜单必须有个名称!");
        } else {
            return newRecipe;
        }
    }
    /*把菜谱保存到本地存储和App组件的状态中，然后显示刚刚保存的菜谱*/
    saveRecipeToLSandStateThenShow(recipes, newRecipe) {
        this.setState({
            recipes: recipes,
            showDialog: !this.state.showDialog
        });
        LSM.set(recipes);
        setTimeout(() => {
            this.showRecipe(newRecipe.recipe.toLowerCase());
        }, 10);
    }
    saveRecipe() {
        let recipes = this.state.recipes;
        let newRecipe = this.constructNewRecipeObj();
        let typeIsAdd = this.state.dialogType === "Add Recipe" ? true : false;
        /*如果返回了合法菜谱，则执行以下语句*/
        if (newRecipe) {
            /*若对话框类型是添加菜谱*/
            if (typeIsAdd) {
                let recipeList = this.getRecipeList();
                if (recipeList.indexOf(newRecipe.recipe) !== -1) {
                    let recipeName = newRecipe.recipe.replace("-", " ");
                    alert(`${recipeName} 已经被添加到了菜谱列表中!`);
                } else {
                    recipes.push(newRecipe);
                    this.saveRecipeToLSandStateThenShow(recipes, newRecipe);
                }
            } else {
            /* 若对话框类型是编辑菜谱*/
                let recipeIndex;
                recipes.forEach((obj, i) => {
                    if (obj.recipe.toLowerCase() === this.state.editThis) {
                        recipeIndex = i;
                    }
                });
                recipes[recipeIndex] = newRecipe;
                this.saveRecipeToLSandStateThenShow(recipes, newRecipe);
            }
        }
    }

    deleteRecipe(e) {
        const recipeToDelete = e.currentTarget.value;
        if (
            window.confirm(
                '您确定要从菜谱中删除"' +
                    recipeToDelete.replace("-", " ") +
                    '"吗?'
            )
        ) {
            // 确定删除后得到焦点的菜单
            let recipeToFocus;
            let recipeList = this.getRecipeList();

            recipeList.indexOf(recipeToDelete) >= 1
                ? (recipeToFocus =
                      recipeList[recipeList.indexOf(recipeToDelete) - 1])
                : (recipeToFocus = recipeList[1]);

            this.showRecipe(recipeToFocus);
            // 删除菜单
            let recipes = this.state.recipes;
            recipes = recipes.filter(obj => {
                return obj.recipe !== recipeToDelete;
            });
            // 重置本地存储和状态
            LSM.set(recipes);
            this.setState({
                recipes: recipes
            });
        }
    }
    populateFormData(str) {
        // 若按钮正在被关闭，或被添加按钮打开，则什么都不做，直接返回
        if (str === "") return;
        else {
            /* 若对话框正在被编辑，则寻找对应的菜谱*/
            let recipe;
            this.state.recipes.forEach(recipeEle => {
                if (recipeEle.recipe === str) {
                    recipe = recipeEle;
                }
            });

            // 等待对话框打开，然后填充数据
            setTimeout(() => {
                document.getElementById(
                    "recipe-name-input"
                ).value = recipe.recipe.replace(/-/g, " ");
                document.getElementById(
                    "ingredients-input"
                ).value = recipe.ingredients.join(" \\ ");
                document.getElementById(
                    "steps-input"
                ).value = recipe.directions.join(" \\\n\n");
                this.setState({ editThis: recipe.recipe.toLowerCase() });
            }, 10);
        }
    }
    toggleDialogDisplay(e) {
        let indicator =
            e.currentTarget.title !== undefined ? e.currentTarget.title : "";
        this.setState({
            dialogType: indicator,
            showDialog: !this.state.showDialog
        });
        let val =
            e.currentTarget.value === undefined ? "" : e.currentTarget.value;
        this.populateFormData(val);
    }
    render() {
        let dialogText =
            this.state.dialogType === "Add Recipe"
                ? ["添加菜谱", "添加"]
                : ["编辑菜谱", "保存"];

        let dialogBox;
        if (this.state.showDialog) {
            dialogBox = (
                <div className="dialog-wrap">
                    <Dialog
                        dialogType={dialogText[0]}
                        buttonType={dialogText[1]}
                        handleSubmit={this.saveRecipe}
                        handleClose={this.toggleDialogDisplay}
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
                    contents={this.state.recipes}
                />
                <RecipePane
                    currentRecipe={this.state.currentRecipe}
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
