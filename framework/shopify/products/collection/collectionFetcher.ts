import { Collection } from "@shopify/shema";

const collectionFeatcher = async (
    url: string,
    handle: string
): Promise<Collection> => {
    const response = await fetch(url, {
        method: "POST",
        mode: "no-cors",
        body: JSON.stringify({
        handle: handle,
        }),
    }).then((res) => {
        return res.json();
    }).catch((e) => {
        throw Error(e.message);
    });
    return response.data.collectionByHandle;
};

export default collectionFeatcher