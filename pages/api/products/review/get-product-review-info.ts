import type { NextApiRequest, NextApiResponse } from 'next';
import { cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serviceAccount  from '../../../../firebase-serviceAccount.json'; // 秘密鍵を取得
import admin from 'firebase-admin';
import { PRODUCT_INFO_COLLECTION  } from "@firebase/const"

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {

    if(req.method !== "POST") throw Error('this api is only POST method...')
    try{
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: cert(serviceAccount as any),
            });
        }

        const body = JSON.parse(req.body) as { productId: string }

        const db = getFirestore();
        const productInfoMatchQuery = await db.collection(PRODUCT_INFO_COLLECTION).where('productId', "==", body.productId).get()

        let productReviewInfo = null
        if(productInfoMatchQuery.docs[0]?.exists){
            productReviewInfo =  {...productInfoMatchQuery.docs[0].data()}
        }

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ productReviewInfo: productReviewInfo }))


    }catch(error: any){
        throw Error(error.message)
    }
}
