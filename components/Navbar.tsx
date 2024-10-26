import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "@/components/Mobile-sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkUserSubscription } from "@/lib/subscription";


const Navbar = async ()=>{
    const apiLimitCount = await getApiLimitCount();
    const isPro = await checkUserSubscription();
    
    return(
        <div className="flex items-center p-4">
            <MobileSidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
            <div className="w-full flex justify-end">
                <UserButton/>
            </div>
        </div>
    );
}
export default Navbar;