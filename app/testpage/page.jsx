"use client";
import React from "react";
import { useSession} from "next-auth/react";
import ChangeProfilePic from "../components/ui/userProfile/changeprofilepic";
import UserprofilePic from "../components/ui/userProfile/userprofilepic";
export default function TestPage() {  
    const {data: session} = useSession();


    return (
      <div>
        <ChangeProfilePic />
        {/* <UserprofilePic /> */}
      </div>
    );
    }