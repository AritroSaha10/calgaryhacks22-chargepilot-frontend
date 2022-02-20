import { signInWithEmailAndPassword } from 'firebase/auth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'

import auth from '../db/auth'
import { setDoc, doc, getDoc } from 'firebase/firestore'
import db from '../db'

function isEmail(email: string) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
}

const Login: NextPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const onSubmitForm = async (e: any) => {
    e.preventDefault()

    if (!isEmail(email)) {
      alert('Please input a valid email!')
      return
    }

    // TODO: Put login logic here
    try {
      const signInRes = await signInWithEmailAndPassword(
        auth(),
        email,
        password
      )

      const userID = auth().currentUser?.uid
      const userDoc = await getDoc(doc(db(), 'users', userID))
      const userData = userDoc.data()
      if (userData.isBusiness) {
        router.push('/discount')
      } else {
        router.push('/')
      }
    } catch (e) {
      alert('Credentials not valid. Please try again.')
    }
  }

  return (
    <div className="h-screen bg-teal-100 flex flex-col space-y-10 justify-center items-center">
      <div className="bg-white w-96 shadow-xl rounded p-5 justify-center  ">
        <div className="font-extrabold text-center">Login</div>
        <div className="text-xs">Email Address</div>

        <form className="rad" onSubmit={onSubmitForm}>
          <input
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="text-xs mt-2">Password</div>

          <input
            type="password"
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="w-full h-15 border mt-2 p-2 bg-teal-200 hover:bg-teal-300 rounded-lg duration-500 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
