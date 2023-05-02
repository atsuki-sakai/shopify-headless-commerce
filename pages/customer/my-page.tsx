
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container, AlertDialog } from '@components/ui'
import { checkoutCustomerDisassociate, getCustomerAccessToken } from "@shopify/customer"
import { useCustomerState } from '@components/context'
import { useRouter } from 'next/router'
import { SHOPIFY_CUSTOMER_ACCESS_TOKEN } from '@shopify/const'
import { checkoutShippingAddressUpdate, getCheckoutId } from '@shopify/cart'
import { LoadCircle } from '@components/icon'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import { provinceToJP } from '@lib/province-to-jp'
import { OrderCard } from '@components/my-page'
import getOrdersPagenation from '@shopify/customer/get-orders-pagination'

const MyPage = () => {

    const router = useRouter()
    const { loggedCustomer, updateCustomer } = useCustomerState()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ isFetching, setIsFetching ] = useState(false)
    const [ errorText, setErrorText ] = useState("")
    const [ orders, setOrders ] = useState(loggedCustomer?.orders?.edges.map(({node: order}) => order))
    const [ ordersPagination, setOrdersPagination] = useState(loggedCustomer?.orders?.pageInfo)
    const [ defaultAddress, setDefaultAddress ] = useState(loggedCustomer?.defaultAddress)

    const numberOfOrders = 4

    const logout = async () => {
        try{
            setIsLoading(true)
            await checkoutShippingAddressUpdate(getCheckoutId()!)
            await checkoutCustomerDisassociate(getCheckoutId()!)
            Cookies.remove(SHOPIFY_CUSTOMER_ACCESS_TOKEN!)
            updateCustomer(undefined)
            router.push('/')
        }catch(e: any){
            setErrorText(e.message)
        }finally{
            setIsLoading(false)
        }
    }

    const fetchMoreOrders = async() => {
        if(!loggedCustomer?.orders.pageInfo.hasNextPage) return

        try{
            setIsFetching(true)
            const newOrdersInfo = await getOrdersPagenation(numberOfOrders, getCustomerAccessToken()!, ordersPagination?.endCursor! )
            setOrders(orders?.concat(newOrdersInfo.edges.map((order: any) => order.node)))
            setOrdersPagination(newOrdersInfo.pageInfo)
        }catch(e: any){
            alert(e.message)
        }finally{
            setIsFetching(false)
        }
    }

    useEffect(() => {
        setOrders(loggedCustomer?.orders?.edges.map(({node: order}) => order))
        setOrdersPagination(loggedCustomer?.orders.pageInfo)
        setDefaultAddress(loggedCustomer?.defaultAddress)
    }, [loggedCustomer])

    return (
        <Container>
            { errorText ? <AlertDialog title='エラー' message={errorText} onClose={() => setErrorText("")} /> : <></>}
            <div className="px-8">
                <div className='flex items-end justify-between pt-6 pb-4'>
                    <h3 className='font-bold'>お客様の注文履歴</h3>
                    <div>
                        <button className="px-3 py-1 textp-center bg-blue-500 shadow-md rounded-md" onClick={logout} disabled={isLoading}>
                            <div className='flex items-center text-center w-full justify-between'>
                                <p className='text-white text-sm'>ログアウト</p>
                                <motion.div className="ml-1 mr-1 -translate-y-1" initial={{ opacity:0, height:6, width:0 }} animate={{ opacity: isLoading ? 1: 0, height:12, width: isLoading ? 12: 0 }}>
                                <LoadCircle className='text-white h-5 w-5 animate-spin'/>
                                </motion.div>
                            </div>
                        </button>
                    </div>
                </div>
                <div className='pt-3'>
                    {
                        orders ? orders.length === 0 ?  <div className='col-span-2 text-gray-500 text-sm h-20'>まだ注文履歴はありません</div>
                        :   <div className='grid grid-cols-2 gap-3'>
                                {
                                    orders.map((order, index) => {
                                        return  <div key={index}>
                                                    <OrderCard order={order}/>
                                                </div>
                                    })
                                }
                            </div> : <div className="col-span-2 text-gray-500 text-sm h-20">まだ注文履歴はありません</div>
                    }
                    {
                        ordersPagination?.hasNextPage ? <div className='mt-8'>
                                                            <button className="px-3 w-full py-1 textp-center bg-green-500 rounded-md shadow-md" onClick={fetchMoreOrders} disabled={isFetching}>
                                                                <div className='flex items-center justify-center'>
                                                                    <p className='text-white text-sm text-center w-fit'>さらに注文を表示</p>
                                                                    <motion.div className="ml-1 mr-1 -translate-y-1" initial={{ opacity:0, height:6, width:0 }} animate={{ opacity: isFetching ? 1: 0, height:12, width: isFetching ? 12: 0 }}>
                                                                        <LoadCircle className='text-white h-5 w-5 animate-spin'/>
                                                                    </motion.div>
                                                                </div>
                                                            </button>
                                                        </div> : <></>
                    }
                </div>
                <div className="flex items-between justiry-between py-12">
                    <div className='w-full'>
                        <p className='font-bold mb-2'>配送情報</p>
                        {
                            defaultAddress ? <div className='text-sm'>
                                                <div className='h-fit'>
                                                    <p>{defaultAddress?.lastName}{defaultAddress?.firstName}</p>
                                                    <p>{defaultAddress?.company}</p>
                                                    <p>{defaultAddress?.phone}</p>
                                                    <p>{provinceToJP(defaultAddress?.province!)}</p>
                                                    <p>{defaultAddress?.city}</p>
                                                    <p>{defaultAddress?.address1}</p>
                                                    <p>{defaultAddress?.address2}</p>
                                                </div>
                                                <div>
                                                    <Link href={"/customer/address-update"}>
                                                        <a>
                                                            <div className='bg-blue-500 w-fit px-3 py-1 rounded-md mt-3'>
                                                                <p className='text-xs text-white'>配送情報を編集する</p>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                                            : <div>
                                                <div className='pt-5 h-20 text-gray-500 text-sm'>配送情報はありません</div>
                                                <div>
                                                    <Link href={"/customer/address-update"}>
                                                        <a>
                                                            <div className='bg-blue-500 w-fit px-3 py-1 rounded-md mt-3'>
                                                                <p className='text-xs text-white'>配送情報を作成</p>
                                                            </div>
                                                        </a>
                                                    </Link>
                                                </div>
                                            </div>
                        }
                    </div>
                    <div className='w-full pl-2'>
                        <p className="font-bold mb-3">アカウント情報</p>
                        <div className='text-sm font-gray-500 space-y-2'>
                            <p>{loggedCustomer?.lastName}{loggedCustomer?.firstName}</p>
                            <p>{loggedCustomer?.email}</p>
                            <p>メルマガ{loggedCustomer?.acceptsMarketing ? "購読中" : "未購読"}</p>
                        </div>
                        <div>
                            <Link href={"/customer/customer-update"}>
                                <a>
                                    <div className='bg-blue-500 w-fit px-3 py-1 rounded-md mt-3'>
                                        <p className='text-xs text-white'>アカウントを編集する</p>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    )
}

export default MyPage