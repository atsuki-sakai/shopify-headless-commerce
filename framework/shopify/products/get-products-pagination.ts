import { ProductConnection } from "@shopify/types/product"
import { generateApiUrl } from "@shopify/utils"

type PaginationType = {
    type: "NEXT" | "PREVIOUS",
    cursor: string
}

const getProductsPagination = async(numProducts: number, pagination?: PaginationType): Promise<ProductConnection> => {

    const getProductsPaginationApiUrl = generateApiUrl({ type: "GET_PRODUCTS_PAGINATION"})
    const response = await fetch(getProductsPaginationApiUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            numProducts: numProducts,
            pagination: pagination
        })
    })
    const { data }  = await response.json();
    return data
}

export default getProductsPagination