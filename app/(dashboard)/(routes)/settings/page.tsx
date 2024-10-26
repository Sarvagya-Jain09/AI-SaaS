import Heading from "@/components/heading"
import SubscriptionButton from "@/components/subscription-button";
import { checkUserSubscription } from "@/lib/subscription"
import { Settings } from "lucide-react"

const SettingsPage = async ()=>{
    const isPro = await checkUserSubscription();
    return(<div>
        <Heading 
            title="Settings" 
            description="Manage Account settings" 
            icon={Settings} 
            iconColor="text-gray-700" 
            bgColor="text-gray-700/10"
        />
        <div className="px-4 lg:px-8 space-y-4">
            <div className="text-muted-foreground text-sm">
                {isPro ? "Your are currently with a pro plan!" : "Upgrade to Pro"}
            </div>
            <SubscriptionButton isPro={isPro}/>
        </div>
    </div>)
}
export default SettingsPage;