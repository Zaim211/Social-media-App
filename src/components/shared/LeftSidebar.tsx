import { sidebarLinks } from "@/constants"
import { useUserContext } from "@/context/AuthContext"
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations.ts"
import { INavLink } from "@/types"
import { useEffect } from "react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
// import { Button } from "../ui/button"

const LeftSidebar = () => {
  const {user} = useUserContext()
  const {mutate: singOut, isSuccess} = useSignOutAccount()
  const navigate = useNavigate();
  const {pathname} = useLocation();
  

  useEffect(() => {
    if(isSuccess) navigate(0)
  }, [isSuccess])

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-10">
          <Link to='/' className="flex gap-3 items-center">
              <img 
                src="/assets/images/logo.svg"
                alt="logo"
                width={170}
                height={32}
              />
          </Link>
          
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            <img 
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt='pofile'
              className="h-12 w-12 rounded-full"
            />
              <div className="flex flex-col">
              <p className="body-bold">
                {user.name}
              </p>
              <p className="small-regular text-light-3">
                @{user.username}
              </p>
          </div>
        </Link>

        <ul className="flex flex-col gap-5">
          {sidebarLinks.map((link: INavLink) => {
           const isActive = pathname === link.route;

            return (
              <li key={link.label} 
                  className={`leftsidebar-link group ${
                  isActive && 'bg-primary-500'
              }`}>
                <NavLink to={link.route}
                  className="flex gap-3 items-center p-4"
                >
                  <img 
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'}`}
                  />
                  {link.label}
                </NavLink>
              </li>  
            )
          })}
        </ul>
      </div>

      <div className="">
      <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => singOut()}
          >
            <img 
              src="/assets/icons/logout.svg"
              alt="logout"
            />
            <p className="small-medium lg:base-medium">Logout</p>
          </Button>
      </div>
    </nav>
  )
}

export default LeftSidebar