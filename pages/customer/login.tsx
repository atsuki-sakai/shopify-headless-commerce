
import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AlertDialog, Container, Field } from "@components/ui"
import { loginCustomer } from '@shopify/customer'
import { useCustomerState, useCart } from "@components/context"
import { LoadCircle } from '@components/icon'
import { motion } from "framer-motion"
import { checkoutToCart } from '@shopify/cart'
import Cookies from 'js-cookie'
import { SHOPIFY_CHECKOUT_ID_COOKIE, SHOPIFY_CHECKOUT_URL_COOKIE, SHOPIFY_COOKIE_EXPIRE } from '@shopify/const'
import { Checkout } from '@shopify/shema'

const Login = () => {

    const router = useRouter()
    const { updateCart, cart } = useCart()
    const { updateCustomer } = useCustomerState()

    const [ credential, setCredential ] = useState<{[key:string]: any}>({
      email: "",
      password: ""
    })
    const [ errorMessage, setErrorMessage ] = useState('')
    const [ isLoading, setIsLoading ] = useState(false)
    const [ firstError, setFirstError ] = useState(false)

    const completedFields = credential.email !== "" && credential.password !== ""


    const checkoutRecover = (checkout: Checkout) => {
        const options = {
            expires: SHOPIFY_COOKIE_EXPIRE
        }

        Cookies.remove(SHOPIFY_CHECKOUT_ID_COOKIE!)
        Cookies.remove(SHOPIFY_CHECKOUT_URL_COOKIE!)
        Cookies.set(SHOPIFY_CHECKOUT_ID_COOKIE!, checkout.id, options)
        Cookies.set(SHOPIFY_CHECKOUT_URL_COOKIE!, checkout.webUrl, options)
        const newCart = checkoutToCart(checkout)
        updateCart(newCart)
    }

    const login = async() => {

      if(!completedFields){
        setErrorMessage('未入力の項目があります。再度入力フォームを確認の上ログインしてください。')
        return;
      }
      try{
        setIsLoading(true)
        const { customer, lastInCompleteCheckout } = await loginCustomer(credential.email, credential.password);
        updateCustomer(customer)
        if(lastInCompleteCheckout){
          checkoutRecover(lastInCompleteCheckout)
        }
        router.push("/")
      }catch(e: any){
        setErrorMessage(e.message)
        setFirstError(true)
      }finally{
        setIsLoading(false)
      }
    }

    return (
      <Container>
        <div className='px-6 py-4'>
          <div className="w-full text-start pl-5">
            <h1 className='block text-3xl font-bold'>ログイン</h1>
          </div>
          <div className='px-6 py-12 space-y-2'>
            <form>
              <Field
                id='email'
                label="メールアドレス"
                value={credential.email}
                autoComplete="email"
                type='email'
                placeHolder="sample@email.com"
                onChange={(e) => setCredential({...credential, email: e.target.value})}
              />
              <Field
                id='password'
                label="パスワード"
                type='password'
                value={credential.password}
                autoComplete="password"
                placeHolder="password"
                onChange={(e) => setCredential({...credential, password: e.target.value})}
              />
            </form>
            <div className='w-fit mx-auto pt-8'>
              <button className={`px-6 py-2 textp-center bg-gradient-to-tl to-blue-500 from-sky-400 rounded-md`} onClick={login} disabled={isLoading}>
                <div className='flex items-center justify-between'>
                    <p className='text-white font-bold'>ログインする</p>
                    <motion.div className="ml-2 -translate-y-1.5" initial={{ opacity:0, height:12, width:0 }} animate={{ opacity: isLoading ? 1: 0, height:12, width: isLoading ? 12: 0 }}>
                      <LoadCircle className='text-white h-6 w-6 animate-spin'/>
                    </motion.div>
                  </div>
              </button>
            </div>
            {
              firstError ?  <div className='pt-8 w-full text-center'>
                              <Link href={"/customer/recover-password"} passHref>
                                <a className='text-sm text-red-500 underline'>
                                  パスワードをお忘れですか？
                                </a>
                              </Link>
                            </div> : <></>
            }
            <div className='pt-8 w-full text-center'>
              <Link href={"/customer/register"} passHref>
                <a className='text-sm text-blue-600 underline'>
                  アカウントをお持ちでないですか？
                </a>
              </Link>
            </div>
          </div>
          {
            errorMessage ? <AlertDialog title='ログインエラー' message={errorMessage === "Unidentified customer" ? "ユーザーが見つかりませんでした。再度入力値が正しいかご確認の上お試しください。": errorMessage} onClose={() => setErrorMessage('')}/>: <></>
          }
        </div>
      </Container>
    )
}

export default Login