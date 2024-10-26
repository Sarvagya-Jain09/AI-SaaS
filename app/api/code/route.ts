import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { checkUserSubscription } from "@/lib/subscription";


import {increaseApiLimit, checkApiLimit} from "@/lib/api-limit";

const openai = new OpenAI({
    apiKey:process.env.OPEN_API_KEY
})

const instructionMessage : ChatCompletionMessageParam = {
    role : 'system',
    content : 'You are a helpful coding assistant. You must generate code and include a brief explanation of the code before the code block, then use inline comments within the code to explain key parts of the code. Always return the explanation in plain text followed by the markdown code snippet.'
}
export async function POST(req: Request) {
    try{
        const {userId} = auth();
        const body = await req.json();
        const {messages} = body;
        if(!userId)
        {
            return new NextResponse("Unauthorized access",{status:401})
        }
        if(!openai.apiKey)
        {
            return new NextResponse("Api key not configured",{status: 500})
        }
        if(!messages)
        {
            return new NextResponse("Messages are required",{status : 400})
        }
        const freetrial = await checkApiLimit();
        const isPro = await checkUserSubscription();

        if(!freetrial && !isPro)
        {
            return new NextResponse("Free Trial Expired",{status:403})
        }
        const response = await openai.chat.completions.create({
            model : "gpt-3.5-turbo",
            messages : [instructionMessage,...messages]
        })
        if(!isPro)
            {
                await increaseApiLimit();
            }
        console.log("Response",response)
        return NextResponse.json(response.choices[0].message)
    }   
    catch(error)
    {
        console.log("[CODE ERROR]",error);
        return new NextResponse("Internal error",{status:500});
    } 
}
