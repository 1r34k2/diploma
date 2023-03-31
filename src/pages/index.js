import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import axios from 'axios'
import React from 'react'
import {useForm} from 'react-hook-form'
import {setCookie, getCookie} from 'cookies-next'

const inter = Inter({ subsets: ['latin'] })

export async function getServerSideProps(context){
  const authToken = context.req.cookies['authToken']
  if(authToken != null){
    const res = await axios.post('http://localhost:3000/api/searchToken', {
      authToken
    }).catch(function(error){
    })
    if(res.data != null){
      return {
        redirect: {
          destination: '/personal/' + res.data.username,
          permanent: false
        }
      }
    }
   }
  return {
    props: {

    }
  }
}
export default function Home() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const handleClick = async ({}) => {
    const username = document.querySelector("#signup_username").value
    const password = document.querySelector("#signup_password").value
    const email = document.querySelector("#signup_email").value
    await axios.post('/api/signup', {
      username,
      password,
      email
    }).then(function(response){
      location.reload()
    }).catch(function(error){
      alert("That email or username is already taken")
    })
    }
    const handleSignIn = async ({}) => {
      const username = document.querySelector("#username_input").value
    const password = document.querySelector("#password_input").value
    const rememberMe = document.querySelector("#remember_me").checked
      await axios.post('/api/signin', {
        username,
        password,
        rememberMe
      }).then(function(response){
        if(rememberMe){
          setCookie('authToken', response.data, {
            maxAge: 60 * 60 * 24*7,
            path: '/'
          })
        }
        else{
          setCookie('authToken',response.data, {
            expires: 0,
            path: '/'
          })
        }
        location.href = '/personal/' + username
      }).catch(function(error){
        alert("Username or password is incorrect")
        console.log(error.response.data)
      })
    }
  return (
    <>
      <Head>
        <title>Welcome</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.wrapper}>
          <div className={styles.container}>
              <div className={styles.tabs}>
                  <input type="radio" className={styles.tabs__button} name="signForm" id="signIn" defaultChecked />
                  <label className={styles.tabs__text} htmlFor="signIn">Sign In</label>
                  <div className={styles.tabs__content}>
                      <h1>Welcome back!</h1>
                      <p>Get back on your track</p>
                      <form className={styles.form} onSubmit={handleSubmit(handleSignIn)}>
                          <div className={styles.input_group}>
                              <input className={styles.input_group__input} type="text" placeholder="&nbsp;" name="username" id="username_input" autoComplete="off" required />
                              <label className={styles.input_group__label} htmlFor="username">Username</label>
                          </div>
                          <div className={styles.input_group}>
                              <input className={styles.input_group__input} type="password" name="password" placeholder="&nbsp;" id="password_input" required />
                              <label className={styles.input_group__label} htmlFor="password">Password</label>
                          </div>
                          <div className={styles.flex_space_between}>
                              <label className={styles.flex_align_center}><input id="remember_me" type="checkbox" /> Remember Me</label>
                              <p><a href="#">Forgot Password?</a></p>
                          </div>
                          <button type="submit">Submit</button>
                      </form>
                  </div>

                  <input type="radio" className={styles.tabs__button} name="signForm" id="signUp" />
                  <label className={styles.tabs__text} htmlFor="signUp">Sign Up</label>
                  <div className={styles.tabs__content}>
                      <h1>New Account</h1>
                      <p>Start your journey now</p>
                      <form id="signup_form" className={styles.form} onSubmit={handleSubmit(handleClick)}>
                          <div className={styles.input_group}>
                              <input className={styles.input_group__input} type="email" placeholder="&nbsp;" name="email" id="signup_email" autoComplete="off" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" />
                              <label className={styles.input_group__label} htmlFor="email">Email</label>
                          </div>
                          <div className={styles.input_group}>
                              <input className={styles.input_group__input} type="text" placeholder="&nbsp;" name="username" id="signup_username" autoComplete="off" required />
                              <label className={styles.input_group__label} htmlFor="username">Username</label>
                          </div>
                          <div className={styles.input_group}>
                              <input className={styles.input_group__input} type="password" name="password" placeholder="&nbsp;" id="signup_password" required />
                              <label className={styles.input_group__label} htmlFor="password">Password</label>
                          </div> 
                          <p><small>By submitting this form, you confirm you have read and agreed to the <a href="#">Terms and Conditions.</a></small></p>
                          <button type="submit">Submit</button>
                      </form>
                  </div>
              </div>
          </div>
        </div>
      </main>
    </>
  )
}