import Search from "./models/Search"
import { elements,renderLoader,clearLoader } from "./views/base"
import * as searchView from "./views/searchViews"

const state = {}

const controlSearch = async () => {
    // 1) Get query from view 
    const query = searchView.getInput()

    if(query){
        // 2) New search object and add to state 
        state.search = new Search(query);
        //3 prepare UI for result 
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResList)

        //4 search for recipes 
        await state.search.getResults();

        //5 render results for UI 
        clearLoader();
        searchView.renderResult(state.search.result)
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

/*const search = new Search('pizza')
search.getResults()
console.log(search.result)*/
 