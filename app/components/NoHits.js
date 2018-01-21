import {
    Hits,
    NoHits,
    SearchkitProvider,
    SearchkitManager
} from "searchkit"

const searchkit = new SearchkitManager(<somehost>)

    const App = () => (
    <SearchkitProvider searchkit={searchkit}>
        <div>
            <Hits hitsPerPage={10} sourceFilter={["title"]}/>
            <NoHits translations={{
                "NoHits.NoResultsFound":"No movies found were found for {query}",
                "NoHits.DidYouMean":"Search for {suggestion}",
                "NoHits.SearchWithoutFilters":"Search for {query} without filters"
            }} suggestionsField="title"/>
        </div>
    </SearchkitProvider>
    )