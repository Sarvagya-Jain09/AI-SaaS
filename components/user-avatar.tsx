import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const UserAvatar = ()=>{
    const {user} = useUser();
    return(
        <div>
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.imageUrl}/>
                <AvatarFallback>
                {user?.firstName?.charAt(0)}
                {user?.lastName?.charAt(0)}                
                </AvatarFallback>
            </Avatar>
        </div>
    )
};
export default UserAvatar;

// "https://github.com/shadcn.png"