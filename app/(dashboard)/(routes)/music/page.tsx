"use client"
//global/external imports
import axios from "axios";
import * as z from "zod";
import {  Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

//local/internal imports
import Heading from "@/components/heading";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {Input} from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import Empty from "@/components/empty";
import Loader from "@/components/loader";


const MusicPage = ()=>{
    const router = useRouter();
    const [music,setMusic] = useState<string>()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver : zodResolver(formSchema),
        defaultValues: {
            prompt:""
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values : z.infer<typeof formSchema>)=>{
        try{
            setMusic(undefined);
            const response = await axios.post("/api/music",values)
            console.log("Response",response.data.audio)
            setMusic(response.data.audio)
            form.reset();
        }
        catch (error)
        {
            //TODO : Pro Model
            console.log(error);
        }
        finally{
            router.refresh();   
        }
    }
    return (
        <div>
            <Heading title="Music Generator" description="TUrn your thought into a music!"
            icon={Music} iconColor="text-emerald-500" bgColor="bg-emerald-500/10"/>
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
                                    placeholder="Flute solo"
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
                    {music?.length===0 && !isLoading && (
                        <Empty label="No music generated!"/>
                    )}
                    {music && 
                    <audio controls className="w-full mt-8">
                        <source src={music}/>
                    </audio>}
                </div>
            </div>
        </div>
    )
}
export default MusicPage;