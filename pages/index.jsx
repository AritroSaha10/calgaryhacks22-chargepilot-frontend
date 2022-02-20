import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Map from '../components/MainMap.jsx'

import auth from '../db/auth'
import db from '../db'
import { collection, getDoc, doc, getFirestore } from 'firebase/firestore'
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
} from 'firebase/auth'

import DCFastIcon from "../public/img/dc_fast.png"
import SuperchargerIcon from "../public/img/supercharger.png"
import Level2Icon from "../public/img/lvl_2.png"

const Home = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    name: 'John Smith',
    car: {
      batterySize: 30,
      portType: 'JV123',
      maxChargeSpeed: 39,
      maxRadius: 100,
      name: 'Tesla Model 3',
    },
    showRebates: true,
  })

  useEffect(() => {
    ;(async () => {
      auth().onAuthStateChanged(async (user) => {
        console.log(router.pathname)
        
        if (user) {
          const userID = auth().currentUser?.uid
          const userDoc = await getDoc(doc(getFirestore(), 'users', userID))
          console.log(router.pathname)

          if (!userDoc.exists() && router.pathname === "/") {
            alert('Please log in!')
            router.push('/login')
            return
          }

          const userData = userDoc.data()
          console.log(userData)
          setUserData(userData)

          setLoading(false)
        } else {
          alert('Please log in!')
          router.push('/login')
          return
        }
      })

      return () => {
        auth().onAuthStateChanged(async (user) => {})
      }
    })()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-purple-100">
      <Navbar />

      {!loading ? (
        <div className="flex flex-col flex-grow p-4 px-16">
          <div className="flex flex-col lg:flex-row gap-8 flex-grow">
            <Map userData={userData} />

            <div className="flex flex-col gap-8 w-full lg:w-1/6 bg-white rounded-3xl p-8">
              <div className="flex flex-col">
                <div className="text-sm text-gray-600">My Car</div>
                <div className="text-md text-black font-bold">
                  {userData.car.name}
                </div>
              </div>

              <hr />

              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Battery Size</div>
                <div className="text-md text-black font-bold">
                  {userData.car.batterySize} kWh
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Port Type</div>
                <div className="text-md text-black font-bold">
                  {userData.car.portType}
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-gray-600">
                  Maximum Charging Speed
                </div>
                <div className="text-md text-black font-bold">
                  {userData.car.maxChargeSpeed} kWh
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Max Radius</div>
                <div className="text-md text-black font-bold">
                  {userData.car.maxRadius} km
                </div>
              </div>

              <div className="flex flex-col">
                <div className="text-sm text-gray-600">Show Rebates</div>
                <div className="text-md text-black font-bold">
                  {userData.showRebates ? 'Yes' : 'No'}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 mt-8 w-2/3 self-center">
            <h1 className='text-2xl font-semibold text-center mb-4'>Charging Station Legend</h1>
            <div className="flex flex-row gap-12 w-full items-center justify-center">
              <div className='flex flex-col items-center justify-center'>
                <Image src={SuperchargerIcon} quality={100} />
                <p className='text-center'>Supercharger</p>
              </div>

              <div className='flex flex-col items-center justify-center'>
              <Image src={DCFastIcon} quality={100} />
                <p className='text-center'>DC Fast</p>
              </div>

              <div className='flex flex-col items-center justify-center'>
              <Image src={Level2Icon} quality={100} />
                <p className='text-center'>Level 2</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col my-12 mx-6 p">
            <p className="text-gray-400">
              Preview disclaimer: This is a preview of the app. The app is not
              ready for production use.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow p-4 px-16 items-center justify-center">
          <h1 className="text-2xl font-semibold">Loading...</h1>
        </div>
      )}
    </div>
  )
}

export default Home
