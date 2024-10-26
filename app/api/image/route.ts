import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";
import { checkUserSubscription } from "@/lib/subscription";


const openai = new OpenAI({
    apiKey:process.env.OPEN_API_KEY
})

export async function POST(req: Request) {
    try{
        const {userId} = auth();
        const body = await req.json();
        const {prompt,amount=1,resolution="512x512"}=body;
        if(!userId)
        {
            return new NextResponse("Unauthorized access",{status:401})
        }
        if(!openai.apiKey)
        {
            return new NextResponse("Api key not configured",{status: 500})
        }
        if(!prompt)
        {
            return new NextResponse("Prompt is required",{status : 400})
        }
        if(!amount)
        {
            return new NextResponse("Amount is required",{status : 400})
        }
        if(!resolution)
        {
            return new NextResponse("Resolution is required",{status : 400})
        }
        const freetrial = await checkApiLimit();
        const isPro = await checkUserSubscription();
        if(!freetrial &&  !isPro)
        {

            return new NextResponse("Free Trial Expired",{status:403})
        }
        const response = await openai.images.generate({
            model:"dall-e-2",
            prompt,
            n:parseInt(amount,10),
            size:resolution,
        });
        // console.log("Response",response) 
        if(!isPro)
        {await increaseApiLimit();}

        return NextResponse.json(response.data)
    }   
    catch(error)
    {
        console.log("[IMAGE ERROR]",error);
        return new NextResponse("Internal error",{status:500});
    } 
}
