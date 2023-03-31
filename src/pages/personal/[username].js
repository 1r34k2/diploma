import React from 'react'
import styles from '@/styles/Home.module.css'
import { redirect } from 'next/dist/server/api-utils'
import { useRouter} from 'next/router'
import {getCookie, setCookie} from 'cookies-next'
import querystring from 'querystring'
import axios from 'axios'

const signIn = async (username) => {
  console.log("HI")
  location.href = 'https://accounts.spotify.com/authorize?response_type=code&client_id=48a22831afb948a49cc754897d4e2dd9&redirect_uri=http://localhost:3000/api/auth/callback/'
}

export async function getServerSideProps(context){
  const authToken = context.req.cookies['authToken']
  if(authToken == undefined){
    return{
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }
  else{
    const res = await axios.post('http://localhost:3000/api/searchToken', {
      authToken
    }).catch(function(error){
      console.log(error)
    })
    if(res.data != null){
      return {
        props: {
          username: res.data.username
        }
      }
    }
  }
}
const redir = async (username) => {
  location.href = '/personal/' + username
}
const logout = function () {
  const authToken = getCookie('authToken')
  if(authToken != undefined){
    const res = axios.post('http://localhost:3000/api/removeToken', {
      authToken
    }).catch(function(error){
      console.log(error)
    })
  }
  setCookie('authToken', null, {
        maxAge: 0,
        path: '/'
    })
  location.href = '/'

  }

export default function Component(props) {
  const router = useRouter()
  const { username } = router.query 
  if(username == props.username){
    return (
      <>
      <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.login_container}>
                <div className={styles.login}>
                      <h1>To proceed</h1>
                      <button className={styles.big_btn} onClick={function(){signIn(username)}}>Log in with Spotify</button>
                      <p className={styles.login_desc}>Please login to get access to  spotify content.</p>
                      <p className={styles.login_desc_small}>You will automatically be redirected to this page after login.</p>
                      <h1>Or you can</h1>
                      <button className={styles.big_btn} onClick={logout}>Log out</button>
                      <p className={styles.login_desc}>You can proceed later.</p>
                  </div>
              </div>
        </div>
      </main>
      </>
    )
  }
  else{
    return (
      <>
      <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.login_container}>
                <div className={styles.login}>
                      <h1>Sorry, you can&apos;t access that page</h1>
                      <button className={styles.big_btn} onClick={function(){redir(props.username)}}>Get back to my page</button>
                  </div>
              </div>
        </div>
      </main>
      </>
    )
  }
}