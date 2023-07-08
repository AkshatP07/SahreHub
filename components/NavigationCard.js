import Card from "./Card";
import {useRouter} from "next/router";
import Link from "next/link";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import { parse } from 'path';


export default function NavigationCard(){
  const router = useRouter();
  const {asPath:pathname} = router;
  const activeElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-1 font-bold text-socialBlue md:-mx-7 px-6 md:px-7 rounded-md  items-center';
  const nonActiveElementClasses= 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 text-gray-500 hover:bg-blue-500 hover:bg-opacity-20 md:-mx-4 px-6 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300 items-center';

  const supabase = useSupabaseClient();
  async function logout() {
    await supabase.auth.signOut();
  }

  const containsWord = (pathname, word) => {
    const { dir, name } = parse(pathname);
  
    // Check if the directory name or file name contains the word
    if (dir.includes(word) || name.includes(word)) {
      return true;
    }
  
    return false;
  };

  return (
    <Card noPadding={true}>
      <div className="px-4 py-2 flex justify-between md:block shadow-md shadow-gray-500 md:shadow-none">
        <h2 className="text-gray-200 mb-3 hidden md:block">Navigation</h2>
        <Link href="/" className={pathname === '/' || pathname === '/#' || containsWord(pathname,'access') || !pathname ? activeElementClasses : nonActiveElementClasses}>
          {(() => {
            if (pathname === '/' || !pathname || pathname === '/#' || containsWord(pathname,'access')) {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 fill-socialBlue">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              );
            } else {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              );
            }
          })()}
          <span className="hidden md:block">Home</span>
        </Link>
        <Link href="/saved" className={pathname === '/saved' ? activeElementClasses : nonActiveElementClasses}>
        {(() => {
            if (pathname === '/saved' ) {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 fill-socialBlue">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              );
            } else {
              return (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
              );
            }
          })()}
          <span className="hidden md:block">Saved posts</span>
        </Link>

        <button onClick={logout} className="w-full -my-2">
          <span className={nonActiveElementClasses}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
            </svg>
            <span className="hidden md:block">Logout</span>
          </span>
        </button>
      </div>
    </Card>
  );
}