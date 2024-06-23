import React, { useEffect } from 'react'
import { Link , useNavigate} from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'
import { Loader } from "@/components/shared/Loader"

const TopBar = () => {
  const {mutate: signOut, isSuccess, isPending: isLoggingOut} = useSignOutAccount();
  const navigate = useNavigate();
  const {user} = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <section className='topbar'>
      <div className='flex-between py-4 px-5'>
        <Link to="/" className='flex gap-3 items-center'>
          <img 
            src="/assets/images/logo.svg"
            alt="log" 
            width={130}
            height={325}
            />
        </Link>

        <div className='flex gap-4'>
        <Button  
        variant="ghost" 
        className='shad-button_logout border border-primary-500' 
        onClick={() => signOut()}
        disabled={isLoggingOut}
        >
          {isLoggingOut ? (
                <div className="flex-center gap-2 border-primary-500">
                  <Loader /> Loading
                </div>
              ) : <div className='flex-center gap-3'><img src="/assets/icons/logout.svg" alt="logout" />
              <p className='small-medium lg:base-medium'>Logout</p> </div>
              }
              
        </Button>
            <Link to={`/profile/${user.id}`} className='flex-center gap-3'>
              <img 
                src={user.imageUrl || '/assets/images/profile-placeholder.svg'}
                alt="profile"
                className='h-10 w-10 rounded-full' 
                />
            </Link>
        </div>
      </div>
    
    </section>
  )
}

export default TopBar