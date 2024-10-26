"use client"

import axios from "axios";
import { useState } from "react";
import {  Check, Code, Image, MessageSquare, Music, Video, Zap } from "lucide-react";

import { useProModal } from "@/app/hooks/use-pro-modal"
import { Dialog, 
    DialogContent, 
    DialogDescription, 
    DialogFooter, 
    DialogHeader, 
    DialogTitle 
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


export const ProModal =()=>{
    const tools = [{
        label : "Converstation",
        icon : MessageSquare,
        color : "text-violet-500",
        bgColor : "bg-violet-500/10",
      },{
        label : "Image Generation",
        icon : Image,
        color : "text-pink-700",
        bgColor : "bg-pink-700/10",
      },
      {
        label : "Video",
        icon : Video,
        color : "text-orange-700",
        bgColor : "bg-orange-700/10",
      },
      {
        label : "Music Generation",
        icon : Music,
        color : "text-emerald-500",
        bgColor : "bg-emerald-500/10",
      },
      {
        label : "Code generation",
        icon : Code,
        color : "text-green-700",
        bgColor : "bg-green-700/10",
      }]

    const proModal = useProModal();
    const [loading,setLoading] = useState(false);
    // const onSubscribe = async ()=>{
    //     try{
    //         setLoading(true)
    //         const response = await axios.get('/api/stripe');
    //         window.location.href = await response.data.url

    //     }
    //     catch(error : any)
    //     {
    //         toast.error("Something went wrong")
    //     }
    //     finally{
    //         setLoading(false)
    //     }
    // }
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose} >
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle className="flex justify-center items-center flex-col gap-y-4 pb-2">
                        <div className="flex items-start gap-x-2 font-bold py-2">
                            Upgrade to Genius Pro!!
                            <Badge className="uppercase text-sm mb-2"variant="premium">
                                Pro
                            </Badge>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="font-medium items-center pt-2 space-y-2 text-zinc-900 ">
                        {
                            tools.map((tool)=>(
                                <Card key={tool.label} className="p-3 border-black/20 flex items-center justify-between">
                                    <div className="flex items-center gap-x-4">
                                        <div className={cn("p-2 w-fit rounded-md",tool.bgColor)}>
                                            <tool.icon className={cn("h-6 w-6",tool.color)}/>
                                        </div>
                                        <div className="font-semiboldtext-sm">
                                            {tool.label}
                                        </div>
                                    </div>
                                    <Check className="w-5 h-5 text-primary"/>
                                </Card>
                            ))
                        }
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button disabled={loading} size="lg" variant="premium" className="w-full font-bold">
                        Update to Pro!
                        <Zap className="h-4 w-4 ml-2 fill-white"/>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}