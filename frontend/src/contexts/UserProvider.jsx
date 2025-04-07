import { useEffect, useState } from "react";
import {jwtDecode} from 'jwt-decode'
import {UserContext} from './UserContext'

export const UserProvider = ({children}) =>{
    const [user,setUser] = useState(null)
    
    useEffect(()=>{
        const token = localStorage.getItem('token')

        if(token){
            try{
                const decodedUser = jwtDecode(token)
                // console.log("decoded User: ", decodedUser)
                setUser(decodedUser)
            }
            catch(error){
                console.log("Invalid token",error)
                localStorage.removeItem('token')
            }
        }
    },[])

    return(
        <UserContext.Provider value={{user}}>
            {children}
        </UserContext.Provider>
    )
}