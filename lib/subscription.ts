import {auth} from "@clerk/nextjs/server"
import prismadb from "@/lib/prismadb"

const DAY_IN_MS = 86_400_000;

export const checkUserSubscription = async ()=>{
    const {userId} = auth();

    if(!userId)
        return false;

    const userSubscription = await prismadb.userSubscription.findUnique({
        where : {
            userId,
        },
        select : {
            stripeCustomerId : true,
            stripeSubscriptionId : true,
            stripePriceId : true,
            stripeCurrentPeriodEnd : true
        }
    })

    if (!userSubscription || !userSubscription.stripePriceId || !userSubscription.stripeCurrentPeriodEnd) {
        return false;
    }

    const isValid = userSubscription.stripeCurrentPeriodEnd.getTime() + DAY_IN_MS > Date.now();
    return isValid;

}