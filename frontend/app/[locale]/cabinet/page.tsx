import { ProDTO } from "@/types/ProDTO";
import CategorySelector from "../components/ui/auth/CategorySelector";
import ProDashboard from "../components/ui/cabinet/ProDashboard";
import PrDashboard from "../components/ui/cabinet/ProDashboard";
import ProOrders from "../components/ui/cabinet/ProOrders";

export default async function Cabinet() {

    const res = await fetch(`http://localhost:5221/api/category/meLong`, {cache: 'no-store'});
    const proData = await res.json();

    console.log(proData);

    return(
        <div>
            <CategorySelector/>
            <ProOrders/>
        </div>
    )
}