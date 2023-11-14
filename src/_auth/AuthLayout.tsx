import {Navigate, Outlet} from 'react-router-dom'

const AuthLayout = () => {
  const isworked = false;

  return (
    <>
      {isworked ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className='flex flex-1 justify-center items-center flex-col py-10'>
            <Outlet />
          </section>

          <img 
            src='/assets/images/side-img.svg'
            className='hidden xl:block w-[1/2] h-screen bg-no-repeat object-cover'
          />
        </>
      )}
    </>
  )
}

export default AuthLayout