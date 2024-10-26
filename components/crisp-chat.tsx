"use client"

import { useEffect } from "react"
import {Crisp} from "crisp-sdk-web"

export const CrispChat = ()=>{
    useEffect(()=>{
        Crisp.configure("9eca2881-e3db-46ae-93fb-6d230d060f55")
    },[])
    return null
}