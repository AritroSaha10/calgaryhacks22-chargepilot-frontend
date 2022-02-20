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

import DCFastIcon from '../public/img/dc_fast.png'
import SuperchargerIcon from '../public/img/supercharger.png'
import Level2Icon from '../public/img/lvl_2.png'

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen bg-purple-100">
      <Navbar />

      <div className="flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl text-purple-700">Coming Soon!</h1>
        <p className="text-2xl text-black">
          We're working hard to bring you the best experience possible. Stay
          tuned!
        </p>
      </div>
    </div>
  )
}

export default Home
