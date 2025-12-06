import CategorySelector from "../../components/ui/auth/CategorySelector";
import CategoryEditorClient from "./CategoriesEditorClient";

export default async function CategoriesEditor() {
    const res = await fetch("http://localhost:5221/api/category/with-subcategories", {method: "GET"});
        const data = await res.json();
    
    return(
        <CategoryEditorClient categories={data} />
    )
}