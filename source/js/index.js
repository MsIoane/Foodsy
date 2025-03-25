import Search from "./models/Search"
import Recipe from "./models/Recipe"
import { elements,renderLoader,clearLoader } from "./views/base"
import * as searchView from "./views/searchViews"

const state = {}

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

        //create new recipe object 
        state.recipe = new Recipe(id);
        try {
            //get recipe data 
            await state.recipe.getRecipe();
            //calculate servings and time 
            state.recipe.calcTime();
            state.recipe.calcServings();
            //render recipe 
            console.log(state.recipe)  
        } catch (error) {
            alert('Error recipe')  
        }
       
    }

}


window.addEventListener('hashchange', controlRecipe);
window.addEventListener('load', controlRecipe); 
//['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));