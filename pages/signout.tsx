import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import auth from "../db/auth"
import { setDoc, doc } from 'firebase/firestore'
import db from "../db"

function isEmail(email: string) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
}

const SignOut: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    (async () => {
        auth().signOut()
        
        router.push("/login")
    })()
  }, [])

  

  return (
    <div className="h-screen bg-purple-100 flex flex-col space-y-10 justify-center items-center">
      <h1 className='text-xl'>Signing out...</h1>
    </div>
  )
}

export default SignOut
