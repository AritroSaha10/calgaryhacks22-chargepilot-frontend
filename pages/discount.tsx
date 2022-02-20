import { doc, getFirestore, getDoc, setDoc } from 'firebase/firestore'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

const ChargingDiscount = () => {
  const [discountKey, setDiscountKey] = useState('')
  const [discountAmount, setDiscountAmount] = useState('')
  const [locationAddress, setLocationAddress] = useState('')
  const onSubmitForm = async (e: any) => {
    e.preventDefault()

    // Get doc
    const discountDoc = await getDoc(doc(getFirestore(), "discountCodes", discountKey))

    // If exists, error out
    if (discountDoc.exists()) {
        alert("Discount key already exists! Please change it to something unique.");
        return
    }

    // If doesn't exist, make new one
    await setDoc(doc(getFirestore(), "discountCodes", discountKey), {
        discountKey,
        discountAmount,
        locationAddress
    })

    // Let user know
    alert("Discount made!")
  }



  return (
    <div className="h-screen bg-purple-100 flex flex-col space-y-10 justify-center items-center">
      <div className="bg-white w-96 shadow-xl rounded p-5 justify-center">
        <div className="font-extrabold text-center">Charging Discount</div>
        <div className="text-xs">Discount Key</div>

        <form className="" onSubmit={onSubmitForm}>
          <input
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Enter Key"
            type="Discount key"
            value={discountKey}
            onChange={(e) => setDiscountKey(e.target.value)}
            required
          />

          <div className="text-xs mt-2">Percent Rebate</div>

          <input
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Enter %"
            type="Discount"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(e.target.value)}
          />

          <div className="text-xs mt-2">Location</div>

          <input
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Enter Business Location"
            type="Location"
            value={locationAddress}
            onChange={(e) => setLocationAddress(e.target.value)}
          />

          <button
            className="w-full h-15 border mt-2 p-2 bg-purple-100 hover:bg-purple-300 rounded-lg duration-500 transition-colors"
            onClick={onSubmitForm}
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChargingDiscount
