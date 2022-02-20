import { createUserWithEmailAndPassword } from 'firebase/auth'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState } from 'react'
import auth from '../db/auth'
import { setDoc, doc } from 'firebase/firestore'
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

    try {
      // TODO: Firebase sign up logic goes here
      await createUserWithEmailAndPassword(auth(), email, password)
    } catch (e) {
      alert(
        'Signup credentials not valid. This could be due to too small of a password. Please try again.'
      )
      return
    }

    // Go to car config page
    router.push('/car-config')
  }

  return (
    <div className="h-screen bg-purple-100 flex flex-col space-y-10 justify-center items-center">
      <div className="bg-white w-96 shadow-xl rounded p-5 justify-center  ">
        <div className="font-extrabold text-center">Sign Up</div>
        <div className="text-xs">Email Address</div>

        <div>
          <input
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="text-xs mt-2">Password</div>

          <input
            type="password"
            className="w-full h-15 border mt-1 rounded-md p-1"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="w-full flex flex-row gap-2">
            <button
              className="w-full h-15 border mt-2 p-2 bg-purple-100 hover:bg-purple-300 rounded-lg duration-500 transition-colors"
              onClick={onSubmitForm}
            >
              Sign Up
            </button>
            <button
              className="w-full h-15 border mt-2 p-2 bg-purple-100 hover:bg-purple-300 rounded-lg duration-500 transition-colors"
              onClick={() => router.push('/login')}
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
