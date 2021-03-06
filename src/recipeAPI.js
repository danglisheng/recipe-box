const AV = require('leancloud-storage');
const Recipe=AV.Object.extend('Recipe');

const recipeIndex = [
  {
    recipe: "蒜蓉西兰花",
    ingredients: [
      "1个西蓝花",
      "半根胡萝卜",
      "1汤匙水淀粉",
      "1/2茶匙食盐",
      "2瓣蒜"
    ],
    directions: [
      "将西兰花用手掰开清洗干净。西兰花柄也不要扔掉，去皮切块一起烧了，也很好吃的",
      "胡萝卜切粗条，蒜切蓉",
      "锅中放水，烧开，加入一点盐和植物油，放入西兰花和胡萝卜汆烫几秒钟，稍微变色了立刻捞出",
      "锅里面放植物油，6成热，放入蒜蓉爆炒出香味，放入西兰花胡萝卜翻炒",
      "快熟时倒入水淀粉和盐，搅拌均匀即可"
    ]
  },
  {
    recipe: "蒜香鸡块",
    ingredients: [
      "3汤匙黄油",
      "1茶匙调味盐",
      "1茶匙洋葱粉",
      "2茶匙大蒜粉",
      "4块光滑、无骨鸡胸肉"
    ],
    directions: [
      "把煎锅加热至中高温，融化黄油。",
      "把鸡块放入锅中，撒上大蒜粉、调味盐和洋葱粉。",
      "鸡块的每一面各煎大约10到15分钟，直到熟透，不再渗出肉汁为止。"
    ]
  },
  {
    recipe: "西葫芦番茄炒蛋",
    ingredients: [
      "1个西葫芦",
      "2个鸡蛋",
      "1个番茄",
      "2g食盐",
      "80g花生油",
      "15g生抽",
      "5g料酒"
    ],
    directions: [
      "先把西葫芦洗净，去头尾，切片。",
      "番茄冲洗干净，用开水浸泡3分钟，去蒂切小块。",
      "鸡蛋加入料酒打散，热锅倒油烧开后，再倒入蛋液，用筷子划散，盛出。",
      "锅里留油，放入番茄炒匀，再放入西葫芦炒一会。",
      "放入煎好的鸡蛋混合，撒入盐炒匀。",
      "淋入生抽炒匀，即可出锅享用。"
    ]
  },
  {
    recipe: "清炒木耳菜",
    ingredients: ["一把木耳菜", "3个蒜瓣", "适量油", "2g盐", "1g鸡粉"],
    directions: [
      "木耳菜去除老梗洗干净控去水分，蒜瓣去皮后切碎。",
      "锅中倒入油烧五成热，加入蒜末爆出蒜香味。",
      "放入木耳菜翻炒。",
      "大火爆炒几下，加入食盐调味。",
      "将木耳菜炒软，加入鸡粉调味即可。"
    ]
  },
  {
    recipe: "苦瓜煎蛋",
    ingredients: ["半个苦瓜", "2个鸡蛋", "适量盐巴", "适量胡椒粉"],
    directions: [
      "取半个苦瓜洗净，切末。",
      "碗内磕两个蛋。",
      "打散的蛋液加入适量盐和胡椒粉。",
      "把苦瓜末放进蛋液里，混合均匀。",
      "锅内热油，倒入蛋液摊开。",
      "中火煎制，到蛋液稍定型，用锅铲将其分成四等份。",
      "翻蛋饼，稍煎另一面。即可出锅装盘。"
    ]
  }
];
class recipeAPI {
	static addRecipe(recipe){
		let recipeToAdd=new Recipe();
		recipeToAdd.set('recipe',recipe.recipe);
		recipeToAdd.set('ingredients',recipe.ingredients);
		recipeToAdd.set('directions',recipe.directions);
		
		return recipeToAdd.save();
	}
  static editRecipe(objId,newRecipe){
     var recipe = AV.Object.createWithoutData('Recipe', objId);
      // 修改属性
      recipe.set('recipe',newRecipe.recipe);
      recipe.set('ingredients',newRecipe.ingredients);
      recipe.set('directions',newRecipe.directions);
      
      // 保存到云端
      return recipe.save();
  }
	static getAllRecipes(){
		let query=new AV.Query('Recipe');
		let allRecipes=[];
    return query.find().then((recipes)=>{
      if(!recipes.length){
         recipeIndex.forEach((recipe)=>{
        recipeAPI.addRecipe(recipe);
       });
      }
			recipes.forEach((recipeItem)=>{
				let recipe=recipeItem.get('recipe');
				let ingredients=recipeItem.get('ingredients');
				let directions=recipeItem.get('directions');
				let objId=recipeItem.id;
				allRecipes.push({
					recipe,
					ingredients,
					directions,
					objId
				});
			});
			return allRecipes;
		})
    .catch((error)=>{
     
    })

	}
  static deleteRecipe(objId){
    let recipe=AV.Object.createWithoutData('Recipe',objId);
    return recipe.destroy().then(function(success){
      return success;
    });
  }
}
export default recipeAPI;
