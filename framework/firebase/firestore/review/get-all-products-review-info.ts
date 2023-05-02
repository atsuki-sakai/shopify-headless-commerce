import { Product } from "@shopify/shema";
import getProductReviewInfo from "./get-product-review-info";
import idConverter from "@lib/id-converter";


const getAllProductsReviewInfo = async (products: Product[]) => {
    return Promise.all(
        products.map(async(product: Product) => {
            return await getProductReviewInfo(idConverter({ type: "PRODUCT" }, product.id))
        })
    )
}

export default getAllProductsReviewInfo