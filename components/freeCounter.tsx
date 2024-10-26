"use client"
import { useState,useEffect } from "react"
import { Zap } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { MAX_FREE_COUNTS } from "@/constants"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useProModal } from "@/app/hooks/use-pro-modal"

interface FreeCounterProps {
    apiLimitCount : number,
    isPro : boolean
}
const FreeCounter =({
    apiLimitCount =0,
    isPro = false
}:FreeCounterProps)=>{
    const [mounted,setMounted] = useState(false)
    const proModal = useProModal();

    useEffect(()=>{
        setMounted(true)
    },[])
    if(!mounted)
    {
        return null
    }
    if(isPro)
    {
        return null
    }
    
    return (
        <div className="px-3">
            <Card className="bg-white/10 border-0">
                <CardContent className="py-6">
                    <div className="text-sm text-center mb-1 text-white space-y-2">
                        <p>
                            {apiLimitCount} / {MAX_FREE_COUNTS} Free Generations
                        </p>
                        <Progress
                            className="h-3"
                            value={(apiLimitCount/MAX_FREE_COUNTS) * 100}
                        />
                    </div>
                    <Button className="mt-2 w-full" variant="premium" onClick={proModal.onOpen}>
                        Upgrade
                        <Zap className="ml-2 w-4 h-4 fill-white"/>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
export default FreeCounter;