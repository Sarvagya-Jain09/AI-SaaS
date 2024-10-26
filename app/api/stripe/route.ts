import { auth, currentUser} from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingsUrl = absoluteUrl("/settings");

export async function GET()
{
    try{
        const {userId} = auth();
        const user = await currentUser();

        if(!userId || !user)
        {
            return new NextResponse("Unauthorized access",{status: 401})
        }
        const userSubscription = await prismadb.userSubscription.findUnique({
            where : {
                userId,
            }
        })
        //checks if the user already has a subscription and if so he/she can make furtherm modifications
        if(userSubscription && userSubscription.stripeCustomerId)
        {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer : userSubscription.stripeCustomerId,
                return_url : settingsUrl
            })
            return new NextResponse(JSON.stringify({url:stripeSession.url}))
        }
        //Create new session for the user not having any subscription yet
        const stripeSession = await stripe.checkout.sessions.create({
            success_url:settingsUrl,
            cancel_url : settingsUrl,
            payment_method_types:["card"],
            mode : 'subscription',
            billing_address_collection : "auto",
            customer_email : user.emailAddresses[0].emailAddress,
            line_items:[
                {
                    price_data : {
                        currency : "USD",
                        product_data : {
                            name : "Genius Pro",
                            description: "Unlimited AI Generation",
                        },
                        unit_amount : 1000,
                        recurring : {
                            interval : "month"
                        }
                    },
                    quantity:1,
                }],
                metadata:{
                    userId,
                },
        })
        return new NextResponse(JSON.stringify({url:stripeSession.url}))
    }
    catch(error){
        console.log("[STRIPE ERROR]",error)
        return new NextResponse("Internal error",{status : 500})
    }
}