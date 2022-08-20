import React,{useRef,useState,useContext } from "react";
import AuthContext from "../context/auth-context";
import './Auth.css'
const AuthPage = () => {
    const [isLogin,setIsLogin] = useState(true);
    let contextType = useContext(AuthContext);
    
    const switchModeHandler = () => {
        setIsLogin(prevState=> !prevState)
    }
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const submitHandler = event => {
        event.preventDefault();
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      if(email.trim().length === 0 || password.trim().length === 0){
        return;
      }

      let requestBody = {
        query:`
        query{
            login(email:"${email}",password:"${password}"){
                token
                userId
                tokenExpiration
            }
        }
        `
      }
      if(!isLogin){
         requestBody = {
            query:`
            mutation{
                createUser(userInput:{email:"${email}",password:"${password}"}){
                    _id
                    email
                }
            }
            `
          }
      }
     
      fetch('http://localhost:3000/graphql',{
        method:"POST",
        body:JSON.stringify(requestBody),
        headers:{
            'Content-Type':"application/json"
        }
      }).then(res => {

        if(res.status !== 200 && res.status !== 201){
            throw new Error('Failed');
        }
        return res.json();
      }).then(resData => {
        if(resData.data.login.token){
          
          contextType.login(resData.data.login.token,resData.data.login.userId,resData.data.login.tokenExpiration)
        }
      }).catch(err=>{
        console.log(err)
      })
      
    }
    return (
       <form className="auth-form" onSubmit={submitHandler}>
        <div className="form-control">
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" ref={emailRef}></input>
        </div>
        <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={passwordRef}></input>
        </div>
        <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={switchModeHandler}>Switch To {isLogin ? 'SignUp':'Login'}</button>
            </div>  
       </form>
    )
}
export default AuthPage