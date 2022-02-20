import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import auth from '../db/auth'
import { setDoc, doc } from 'firebase/firestore'
import db from '../db'

function isEmail(email: string) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
}

const CarConfig: NextPage = () => {
  const [batterySize, setBatterySize] = useState(0)
  const [maxChargeSpeed, setMaxChargeSpeed] = useState(0)
  const [maxRadius, setMaxRadius] = useState(0)
  const [carName, setCarName] = useState('')
  const [portType, setPortType] = useState('other')

  const [name, setName] = useState('')

  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      if (auth().currentUser == null) {
        alert('Please log in! (curr user null)')

        // router.push("/login")
      }
    })()
  }, [])

  const onSubmitForm = async (e: any) => {
    e.preventDefault()

    console.log(auth().currentUser)
    if (!auth().currentUser) {
      alert('Please log in! (curr user null)')
      // router.push("/login")
    }

    await setDoc(doc(db(), 'users', auth().currentUser.uid), {
      name,
      showRebates: true,
      car: {
        batterySize,
        maxChargeSpeed,
        maxRadius,
        name: carName,
        portType,
      },
    })

    router.push('/')
  }

  return (
    <div className="h-screen bg-purple-100 flex flex-col space-y-10 justify-center items-center">
      <div className="bg-white w-96 shadow-xl rounded p-5 justify-center  ">
        <div className="font-extrabold text-center">Account Config</div>

        <form className="" onSubmit={onSubmitForm}>
          <div className="text-xs">First Name</div>
          <input
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="First name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <hr className="my-4" />

          <div className="font-extrabold text-center">Car Config</div>

          <div className="flex flex-col gap-2">
            <div>
              <div className="text-xs">Car Name</div>
              <input
                className="w-full h-15 border mt-1 rounded-md p-1"
                placeholder="Car name..."
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="text-xs">Battery Size (kWh)</div>
              <input
                className="w-full h-15 border mt-1 rounded-md p-1"
                placeholder="Battery size (kWh)..."
                value={batterySize}
                onChange={(e) => setBatterySize(Number(e.target.value))}
                required
                type="number"
              />
            </div>

            <div>
              <div className="text-xs">Port Type</div>
              
              <select className='w-full h-15 border mt-1 rounded-md p-1' required onChange={(e) => setPortType(e.target.value)} value={portType}>
                <option value="J1772">J1772</option>
                <option value="CCS1">CCS1</option>
                <option value="CHAdeMO">CHAdeMO</option>
                <option value="CCS2">CCS2</option>
                <option selected value="other">Port type...</option>
              </select>

            </div>

            <div>
              <div className="text-xs">Maximum Charging Speed (kWh)</div>
              <input
                className="w-full h-15 border mt-1 rounded-md p-1"
                placeholder="Max charging speed (kWh)..."
                value={maxChargeSpeed}
                onChange={(e) => setMaxChargeSpeed(Number(e.target.value))}
                required
                type="number"
              />
            </div>

            <div>
              <div className="text-xs">Max Radius (km)</div>
              <input
                className="w-full h-15 border mt-1 rounded-md p-1"
                placeholder="Max radius (km)..."
                value={maxRadius}
                onChange={(e) => setMaxRadius(Number(e.target.value))}
                required
                type="number"
              />
            </div>
          </div>

          <button className="w-full h-15 border mt-2 p-2 bg-purple-100 hover:bg-purple-300 rounded-lg duration-500 transition-colors">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default CarConfig
