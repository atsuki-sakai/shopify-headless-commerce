
import React, { useState } from 'react'
import { Container, Field } from '@components/ui'
import { useCustomerState } from "@components/context"
import customerAddressCreate from '@shopify/customer/customer-address-create'
import { getCustomer, getCustomerAccessToken } from '@shopify/customer'



type AddressInputType = {
    address1: string
    address2: string
    city: string
    company: string
    country: string
    firstName: string
    lastName: string
    phone: string
    province: string
    zip: string
    customerAccessToken: string
}

const AddressCreate = () => {

  const { loggedCustomer, updateCustomer } = useCustomerState()

  const [ addressData, setAddressData ] = useState<AddressInputType>({
    address1: "",
    address2: "",
    city: "",
    company: "",
    country: "Japan",
    firstName: "",
    lastName: "",
    phone: "",
    province: "",
    zip: "",
    customerAccessToken: getCustomerAccessToken()!
  })

  const createCustomerAddress = async() => {

    if(!loggedCustomer) return;
    if(loggedCustomer.addresses.edges.length === 4){
      alert('登録できる住所は四つまでです。')
    }
    const createAddressInputData = {
      address: {
        address1: addressData.address1,
        address2: addressData.address2,
        city: addressData.city,
        company: addressData.company,
        country: addressData.country,
        firstName: addressData.firstName,
        lastName: addressData.lastName,
        phone: addressData.phone,
        province: addressData.province,
        zip: addressData.zip
      },
      customerAccessToken: getCustomerAccessToken()!
    }
    await customerAddressCreate(createAddressInputData, getCustomerAccessToken()!)
    const customer = await getCustomer(getCustomerAccessToken()!)
    updateCustomer(customer)
  }

  return (
    <Container>
      <h1 className="px-8 py-4 font-bold">配送情報を登録</h1>
      <form>
        <div className='max-w-sm mx-auto space-y-3 px-8'>
          <Field id='lastName' label={"苗字"} type={"text"} autoComplete="family-name" placeHolder={"山田"} value={addressData.lastName} onChange={(e) => setAddressData({...addressData, lastName: e.target.value})} />
          <Field id="firstName" label="名前" type='text' autoComplete='given-name' placeHolder='太郎' value={addressData.firstName} onChange={(e) => setAddressData({...addressData, firstName: e.target.value})} />
          <Field id={"company"} label={"会社名"} type={"text"} autoComplete={"organization"} value={addressData.company} placeHolder={"株式会社 〇〇建設"} onChange={(e) => setAddressData({...addressData, company: e.target.value})}/>
          <Field id={"phone"} label={"電話番号"} type={"tel"} autoComplete={"tel"} value={addressData.phone} placeHolder={"09012345678"} onChange={(e) => setAddressData({...addressData, phone: e.target.value})}/>
          <Field id={"zip"} label={"郵便番号"} type={"number"} autoComplete={"postal-code"} value={addressData.zip} placeHolder={"669-1233"} onChange={(e) => setAddressData({...addressData, zip: e.target.value})}/>
          <Field id={"province"} label={"都道府県"} type={"text"} autoComplete={"address-level1"} value={addressData.province} placeHolder={"大阪府"} onChange={(e) => setAddressData({...addressData, province: e.target.value})}/>
          <Field id={"city"} label={"市町村"} type={"text"} autoComplete={"address-level2"} value={addressData.city} placeHolder={"大阪市"} onChange={(e) => setAddressData({...addressData, city: e.target.value})}/>
          <Field id={"address1"} label={"番地"} type={"text"} autoComplete={"street-address"} value={addressData.address1} placeHolder={"59-45"} onChange={(e) => setAddressData({...addressData, address1: e.target.value})}/>
          <Field id={"address2"} label={"詳細住所"} type={"text"} value={addressData.address2} placeHolder={"ハイツ山田 2階 206号室"} onChange={(e) => setAddressData({...addressData, address2: e.target.value})}/>
          <div className='w-fit mx-auto pt-8'>
            <div className='px-6 py-2 bg-green-500 rounded-md' onClick={createCustomerAddress}>
              <p className='text-white'>住所を登録</p>
            </div>
          </div>
        </div>
      </form>
    </Container>
  )
}

export default AddressCreate