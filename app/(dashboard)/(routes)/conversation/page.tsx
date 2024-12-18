"use client"
//global/external imports
import axios from "axios";
import * as z from "zod";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import toast from "react-hot-toast";
// import { AxiosError } from "axios";

//local/internal imports
import Heading from "@/components/heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import { useProModal } from "@/app/hooks/use-pro-modal";

const Conversation = ()=>{
    const router = useRouter();
    const proModal = useProModal();
    const [messages,setMessages] = useState<ChatCompletionMessageParam[]>([]);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            prompt:""
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        try{
            const userMessage : ChatCompletionMessageParam={
                role : "user",
                content : values.prompt,
            }
            const newMessages = [...messages,userMessage] 
            const response = await axios.post('/api/conversation',{
                messages : newMessages
            });
            console.log("response",typeof(response));
            setMessages((current) => [...current,userMessage,response.data])
            form.reset();
        }
        catch (error: unknown)
        {
            if(axios.isAxiosError(error) && error.response?.status === 403)
            {
                proModal.onOpen();
            }
            else{
                toast.error("Something went wrong")
            }
        }
        //this helps refresh the router on every task that is completed! hence updating the apiLimitCounter.
        //this rehydrates every server component fetching new data
        finally{
            router.refresh();   
        }
    }
    return (
        <div>
            <Heading title="Conversation" description="Our super intelligent conversation AI model"
            icon={MessageSquare} iconColor="text-violet-500" bgColor="bg-violet-500/10"/>
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border p-4 w-full px-3 
                        md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2">
                            <FormField name ="prompt" render={({field})=>(
                            <FormItem className="col-span-12 lg:col-span-10">
                                <FormControl className="m-0 p-0">
                                    <Input className="border-0 outline-none focus-visible:ring-0 
                                    focus-visible:ring-transparent" disabled={isLoading} 
                                    placeholder="How do I calculate the radius of a circle?"
                                    {...field}
                                    />
                                </FormControl>
                            </FormItem>)} /> 
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Generate</Button>          
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex justify-center items-center bg-muted">
                            <Loader/>
                        </div>
                    )}
                    {messages.length===0 && !isLoading && (
                        <Empty label="No Conversation started!"/>
                    )}
                    <div className="flex flex-col-reverse gap-y-4">
                        {messages.map((msg,index)=>(
                            <div key={index} className={cn('p-8 w-full flex items-start gap-x-8 rounded-lg',msg.role==='user' ? 
                                'bg-white border border-black/10' : ' bg-muted')}>
                                    {msg.role==='user'? <UserAvatar/> : <BotAvatar/>}
                                    <p className="text-sm">
                                {typeof msg?.content==='string'? msg.content: "No respond"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Conversation;