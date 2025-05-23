import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="relative w-full h-[90vh]">
        <div 
          className="absolute inset-0 bg-cover bg-top bg-no-repeat"
          style={{
            backgroundImage: "url('./src/assets/storm.jpeg')",
            backgroundPosition: "center 25%" 
          }}
        />
        <div className="absolute inset-0 bg-black/65" />
        
        <div className="relative flex p-4 flex-col items-center justify-center h-full text-white">
          <h1 className="text-5xl md:text-6xl text-4xl font-bold mb-4 tracking-wider flex flex-wrap justify-center gap-x-3 gap-y-0 px-2">
            <span className="text-violet-500 opacity-0 animate-[fadeIn_0.3s_ease-out_.25s_forwards]">STORM</span>
            <span className="opacity-0 animate-[fadeIn_0.3s_ease-out_0.45s_forwards]">THE</span>
            <span className="opacity-0 animate-[fadeIn_0.3s_ease-out_0.65s_forwards]">LINES</span>
          </h1>
          
          <div className="opacity-0 animate-[fadeIn_0.3s_ease-out_0.85s_forwards] flex flex-col items-center">
            <p className="text-2xl md:text-3xl text-gray-200 max-w-2xl text-center mb-10">
              Grassroots actions and campaigns in the fight for total animal liberation.
            </p>
            
            {/* Take Action Button */}
            <button 
              onClick={() => navigate('/action-dashboard')}
              className="bg-violet-500 mt-0 hover:bg-violet-600 cursor-pointer text-2xl text-white font-bold py-4 px-8 rounded-full flex items-center gap-3 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50"
            >
              TAKE ACTION NOW 
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </button>
            
            <SignedIn>
              <div 
                onClick={() => navigate('/create-action')}
                className="text-gray-200 cursor-pointer border-b-2 border-transparent hover:border-white duration-200 ease font-semibold text-xl mt-4"
              >
                Or, create a new action   
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </div>
            </SignedIn>

            <SignedOut>
              <button 
                onClick={() => {
                  const signInButton = document.querySelector('[data-clerk-sign-in]');
                  if (signInButton) {
                    (signInButton as HTMLElement).click();
                  }
                }}
                className="text-gray-200 cursor-pointer border-b-2 border-transparent hover:border-white duration-200 ease font-semibold text-xl mt-4"
              >
                Or, sign in as an organizer  
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline-block size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                </svg>
              </button>
              <SignInButton mode="modal" />
            </SignedOut>


          </div>
        </div>
        
        <div className="w-full px-4 md:px-10 py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="text-4xl md:text-5xl font-bold">HOW WE <span className="text-violet-500">DISRUPT</span> BUSINESS AS USUAL</div>
              <div className="text-xl md:text-2xl max-w-4xl mx-auto mt-5">Storm makes it easy to take effective action for animals, quickly, with no account registration needed. Here's how you can get started now:</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="bg-green-200 p-6 md:p-8 rounded-lg">

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 mb-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672Zm-7.518-.267A8.25 8.25 0 1 1 20.25 10.5M8.288 14.212A5.25 5.25 0 1 1 17.25 10.5" />
              </svg>
                <div className="text-2xl md:text-3xl font-bold text-left">STEP 1: FIND AN ACTION</div>
                <div className="text-left mt-2 font-semibold">Organizers post important actions for active campaigns, and these actions live on the action dashboard. Simply find an action you feel passionate about and click on it!</div>
              </div>
              
              <div className="bg-green-200 p-6 md:p-8 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>

                <div className="text-2xl md:text-3xl font-bold text-left">STEP 2: COMPLETE THE ACTION</div>
                <div className="text-left mt-2 font-semibold">Organizers post important actions for active campaigns, and these actions live on the action dashboard. Simply find an action you feel passionate about and click on it!</div>
              </div>

              <div className="bg-green-200 p-6 md:p-8 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-10 mb-1">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
</svg>

                <div className="text-2xl md:text-3xl font-bold text-left">STEP 3: SHARE WITH FRIENDS</div>
                <div className="text-left mt-2 font-semibold">Organizers post important actions for active campaigns, and these actions live on the action dashboard. Simply find an action you feel passionate about and click on it!</div>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <button onClick={() => navigate('/action-dashboard')} className="cursor-pointer text-2xl bg-violet-500 hover:bg-violet-600 text-white font-bold py-4 px-8 rounded-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 -mt-1 inline-block mr-1.5">
                  <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
                </svg>
                BROWSE ACTIONS
              </button>
            </div>
           
          </div>
        </div>
        

        <div className="w-full bg-black px-4 md:px-10 py-16">
          <div className="max-w-7xl mx-auto">

          <div className="text-center text-white">
              <div className="text-4xl md:text-5xl font-bold"><span className = "text-violet-500">STORM</span> FOR ORGANIZERS</div>
              <div className="text-xl md:text-2xl max-w-4xl mx-auto mt-5">Storm helps organizers get more eyes on their campaigns and actions to grow the movement. As an organizer, you can create new actions that are sent out to all users via the action dashboard.</div>
              <div className = "mt-8">
                <a 
                  href="mailto:storm@duckalliance.com?subject=Requesting%20admin%20access"
                  className="cursor-pointer text-2xl bg-violet-500 hover:bg-violet-600 text-white font-bold py-4 px-8 rounded-full transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-opacity-50 inline-block"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-7 -mt-1 inline-block mr-1.5 text-white">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white">REQUEST ORGANIZER ACCESS</span>
                </a>
                
                <div><div 
              onClick={() => navigate('/create-action')}
              className="text-gray-200 inline-block cursor-pointer border-b-2 border-transparent hover:border-white duration-200 ease font-semibold text-xl mt-4"
            >
              Or, log into your existing organizer account here  
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="inline-block size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </div>
            </div>
              </div>
            </div>
          </div>
          </div>

          <div className="w-full px-4 md:px-10 py-16 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold">SHARE THIS TOOL</div>
              <div className="text-xl md:text-2xl max-w-4xl mx-auto mt-5">With more activists comes more pressure and faster victories. You can share Storm with your friends and help us grow the movement!</div>

              <div className="flex justify-center gap-6 md:gap-12 mt-12">
              <a
  href="https://www.facebook.com/sharer/sharer.php?u=https://www.stormthelines.xyz/"
  target="_blank"
  rel="noopener noreferrer"
>
                <button className="cursor-pointer p-4 md:p-6 rounded-xl hover:bg-[#1877F2] active:bg-[#1877F2] transition-all duration-300 hover:scale-110 active:scale-110 hover:shadow-lg active:shadow-lg group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" 
                    className="w-10 h-10 md:w-16 md:h-16 text-gray-700 group-hover:text-white group-active:text-white">
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.326v21.348C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.464.099 2.797.143v3.24l-1.918.001c-1.504 0-1.794.715-1.794 1.763v2.31h3.587l-.467 3.622h-3.12V24h6.116C23.407 24 24 23.407 24 22.674V1.326C24 .593 23.407 0 22.675 0z"/>
                  </svg>
                </button>
                </a>

                <a
  href="sms:?body=Check%20this%20out:%20https://www.stormthelines.xyz/"
  target="_blank"
  rel="noopener noreferrer"
>
                <button className="cursor-pointer p-4 md:p-6 rounded-xl hover:bg-[#22C55E] active:bg-[#22C55E] transition-all duration-300 hover:scale-110 active:scale-110 hover:shadow-lg active:shadow-lg group">
                 

                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 md:w-16 md:h-16 text-gray-700 group-hover:text-white group-active:text-white">
  <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0 1 12 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 0 1-3.476.383.39.39 0 0 0-.297.17l-2.755 4.133a.75.75 0 0 1-1.248 0l-2.755-4.133a.39.39 0 0 0-.297-.17 48.9 48.9 0 0 1-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97ZM6.75 8.25a.75.75 0 0 1 .75-.75h9a.75.75 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H7.5Z" clipRule="evenodd" />
</svg>


                </button>
                </a>

                <a
                href="https://twitter.com/intent/tweet?url=https://www.stormthelines.xyz/&text=Check%20this%20out!"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="cursor-pointer p-4 md:p-6 rounded-xl hover:bg-[#1DA1F2] active:bg-[#1DA1F2] transition-all duration-300 hover:scale-110 active:scale-110 hover:shadow-lg active:shadow-lg group">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" 
                    className="w-10 h-10 md:w-16 md:h-16 text-gray-700 group-hover:text-white group-active:text-white">
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.564-2.005.974-3.127 1.195-.897-.959-2.178-1.559-3.594-1.559-3.179 0-5.515 2.966-4.797 6.045C7.728 8.087 4.1 6.13 1.671 3.149c-.35.6-.554 1.3-.554 2.041 0 1.41.721 2.655 1.823 3.384-.672-.021-1.304-.206-1.855-.513v.051c0 1.97 1.396 3.617 3.261 3.991-.34.093-.698.143-1.066.143-.261 0-.515-.025-.764-.072.516 1.607 2.011 2.773 2.777 2.808-1.39 1.087-3.14 1.735-5.045 1.735-.326 0-.647-.019-.964-.057 1.8 1.152 3.934 1.823 6.23 1.823 7.547 0 11.675-6.253 11.675-11.675 0-.178-.004-.355-.012-.531A8.345 8.345 0 0 0 24 4.59z"/>
                  </svg>
                </button>
                </a>
              </div>
              
            </div>

  
  </div>
        
        </div>

        <div className="text-center pb-10 text-gray-500 text-xl">
        #StormTheLines{new Date().getFullYear()}
          </div>

       

      </div>
    </div>
  );
  };
  
  export default HomePage;
