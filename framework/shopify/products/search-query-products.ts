import { ProductConnection } from "@shopify/shema"
import { generateApiUrl } from "@shopify/utils"


const searchQueryProducts = async(query: string, cursor?: string, reverse?: boolean): Promise<ProductConnection> => {

    const searchResultLengthApiUrl = generateApiUrl({type: "SEARCH_RESULT_LENGTH"})
    const response = await fetch(searchResultLengthApiUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            query: query,
            cursor: cursor,
            reverse: reverse
        })
    })
    const { data, error } = await response.json()
    if(error){
        throw Error(error.message)
    }
    return data.products
}

export default searchQueryProducts