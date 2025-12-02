import CategorySelectorClient from "./CategorySelectorClient";


export default async function CategorySelector() {

    const res = await fetch("http://localhost:5221/api/category/with-subcategories", {method: "GET"});
    const data = await res.json();

    return(
        <CategorySelectorClient categories={data} />
    )
}