import ProductList from "@/app/Components/ProductList";
import RandomProductsSwiper from "@/app/Components/RandomProductSwiper";

import Deals from "../../Components/Deals/Deals";
import Navbar from "../../Components/Navbar/Navbar";
import HomeProducts from "@/app/Components/HomeProducts";
import Footer from "../Profile/Footer";

export default function Homepage() {


    return (
        <div>
            <div>
                <RandomProductsSwiper/>
            </div>
            <ProductList />
            <HomeProducts />
            <Footer/>
        </div>
    )
}