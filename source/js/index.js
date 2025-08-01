import Search from "./models/Search"
import Recipe from "./models/Recipe"
import List from "./models/List" 
import Likes from "./models/Likes"
import { elements,renderLoader,clearLoader } from "./views/base"
import * as searchView from "./views/searchViews"
import * as recipeView from "./views/recipeView"
import * as listView from './views/listView'
import * as likesView from './views/likesView'

const state = {}
window.state = state
/*
Search Controller 
*/

const controlSearch = async () => {
    // 1) Get query from view 
    const query = searchView.getInput()

    if(query){
        // 2) New search object and add to state 
        state.search = new Search(query);
        //3 prepare UI for result 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResList);
        try {
            //4 search for recipes 
            await state.search.getResults();
            //5 render results for UI 
            clearLoader();
            searchView.renderResult(state.search.result)   
        } catch (error) {
            alert('Error search')
        }
    }
    
}


elements.searchForm.addEventListener('submit',e => {
    e.preventDefault();
    controlSearch();
})


elements.searchResPage.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = btn.dataset.goto;
        searchView.clearResults();  
        searchView.renderResult(state.search.result, Number(goToPage));
    }
});


/*
Recipe Controller 
*/

const controlRecipe = async () => {
    // get ID from url 
    const id = window.location.hash.replace('#','');
    console.log(id)

    if(id) {
        //prepare UI for changes 
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Hightlight Selected search items 
        if(state.search) searchView.highlightSelected(id)

        //create new recipe object 
        state.recipe = new Recipe(id);
        try {
            //get recipe data 
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //calculate servings and time 
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe 
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id)); 
        } catch (error) {
            alert('Error recipe')  
        }
       
    }

}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe); 
//['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

/*
List Controller 
*/

const controllerList = () => {
    // create a new list 
    if(!state.list) state.list = new List();

    //add each ingredients 
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })

}



//Like controller 
const controllerLike = () =>{
    if(!state.likes) state.likes = new Likes();

    const currentId = state.recipe.id;

    if(!state.likes.isLiked(currentId)){
        //add like to state 
        const newLike = state.likes.addLike(
            currentId,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img,
        );

        // Toggle to the Button 
        likesView.toggleLikeBtn(true)
    
        //Add like to UI 
        likesView.renderLike(newLike);
    }else{
        //remove like from the state 
        state.likes.deleteLike(currentId);

        // Toggle to the Button 
        likesView.toggleLikeBtn(false)
        //Remove like from UI 
        likesView.deleteLike(currentId);
    }

    // Toggle like menu 
    likesView.toggleLikeMenu(state.likes.getNumberLikes());
}

// Restore liked recipes on page load 

window.addEventListener('load', ()=>{
    state.likes = new Likes();

    //restore likes 
    state.likes.readStorage();

    // Toggle like menu 
    likesView.toggleLikeMenu(state.likes.getNumberLikes());

    //Render the existing likes 
    state.likes.likes.forEach(like => likesView.renderLike(like));
})

// Handle delete and update list item events 
elements.shopping.addEventListener('click',e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state 
        state.list.deleteItem(id);
        //Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches(".shopping__count-value")){
        //Update             
        const val = parseInt(e.target.value,10);
        state.list.updateCount(id);  
    }
   
});

// Handing recipe button click  
elements.recipe.addEventListener('click', e => {
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        // Decrease button is clecked  
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec')
            recipeView.updateServingsIngredients(state.recipe);
        }
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        // Increase btn  is clecked 
        state.recipe.updateServings('inc')
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn__add, .recipe__btn__add *')){
        //Shoping list 
        controllerList();
    }else if(e.target.matches('.recipe__love, .recipe__love *')){
        // Like controller 
        controllerLike();
    }
})