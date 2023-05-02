import { generateApiUrl } from "@shopify/utils"


const checkoutAttributesUpdate = async(chekcoutId: string, attribute: {key:string, value: string }) => {

    const checkoutAttributesUpdateApiUrl = generateApiUrl({type: "CHECKOUT_ATTRIBUTES_UPDATE"})
    const response = await fetch(checkoutAttributesUpdateApiUrl, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
            checkoutId: chekcoutId,
            input: {
                allowPartialAddresses: true,
                customAttributes: [
                    {
                        key: attribute.key,
                        value: attribute.value
                    }
                ]
            },
            note: ""
        })
    })

    const { data, error } = await response.json()

    if(error){
        throw Error(error.message)
    }
}

export default checkoutAttributesUpdate