import { Menu , Transition } from '@headlessui/react'
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";
import {UserContext} from "../contexts/UserContext";
import {useContext, useEffect, useState} from "react";
import { useRouter } from 'next/router';


function Dropdown({postid}) {
  const supabase = useSupabaseClient();
  const {profile:myProfile} = useContext(UserContext);
  // const [postId, setPostId] = useState(null);
  const [isSaved,setIsSaved] = useState(false);  
  const [isauthor,setisauthor]=useState(false);
  const [author,setauthor]=useState('');
  const router = useRouter();
  const session = useSession();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  useEffect(()=>{
    if (myProfile?.id) fetchIsSaved();

    

  })

  function fetchIsSaved() {
    supabase
      .from('saved_posts')
      .select()
      .eq('post_id', postid)
      .eq('user_id', myProfile?.id)
      .then(result => {
        if (result?.data?.length > 0) {
          setIsSaved(true);
        } else {
          setIsSaved(false);
        }
      })
  }

  async function confirmDelete() {
    const fetchedAuthor = await fetchauthor();
  
    if (fetchedAuthor === session?.user?.id) {
      setShowConfirmDialog(true);
    } else {
      setisauthor(true);
      console.log('This is not your post');
      // You can handle the message display or any other action here
    }
  }
  function cancelDelete() {
    setisauthor(false);
    setShowConfirmDialog(false);
  }

  async function fetchauthor() {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('author')
        .eq('id', postid);
  
      if (error) {
        throw error;
      }
  
      if (data && data.length > 0) {
        return data[0].author;
      }
  
      return null;
    } catch (error) {
      console.error('Error fetching author:', error);
      throw error;
    }
  }
  
  

  async function deletepost() {
    try {
      const fetchedAuthor = await fetchauthor();
  
      if (fetchedAuthor === session?.user?.id) {
        await supabase.from('likes').delete().match({ post_id: postid });
  
        const savedPostRecord = await supabase
          .from('saved_posts')
          .select('id')
          .match({ post_id: postid });
  
        if (savedPostRecord?.data?.length > 0) {
          await supabase.from('saved_posts').delete().match({ post_id: postid });
        }
  
        await supabase.from('posts').delete().match({ id: postid });
  
        console.log('Post and related data deleted successfully');
        window.location.reload();
      } else {
        console.log('Not authorized to delete this post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  }
  
  
  

  function toggleSave() {
    if (isSaved) {
      supabase.from('saved_posts')
        .delete()
        .eq('post_id', postid)
        .eq('user_id', myProfile?.id)
        .then(result => {
          setIsSaved(false);
          fetchIsSaved();
        });
    }
    if (!isSaved) {
      supabase.from('saved_posts').insert({
        user_id:myProfile?.id,
        post_id:postid,
      }).then(result => {
        setIsSaved(true);
        fetchIsSaved();
        // setDropdownOpen(false);
      });
    }
  }
 return (
   <div className="relative">
     <Menu>
       <Menu.Button className="text-sm font-medium text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
       </Menu.Button>
       <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >       
       <Menu.Items className="absolute w-56 -right-6 mt-2 origin-top-right rounded-sm bg-white shadow-md shadow-gray-500 border border-gray-300 py-2 text-sm font-medium text-gray-700">
         <Menu.Item>
           {({ active }) => (
             <a
                onClick={toggleSave}
               className={`flex gap-2 mx-4 cursor-pointer py-2 items-center ${active ? ' bg-socialBlue rounded-md transition-all hover:scale-110 hover: -mx-2 px-2 text-white': 'text-gray-700'
                 }`}
             >
                <div>
                  {!isSaved &&(
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                      </svg>
                  )}
                  {isSaved && (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l1.664 1.664M21 21l-1.5-1.5m-5.485-1.242L12 17.25 4.5 21V8.742m.164-4.078a2.15 2.15 0 011.743-1.342 48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185V19.5M4.664 4.664L19.5 19.5" />
                      </svg>
                  )}
                </div>
                <div className='text-sm'>
                  {isSaved ? 'Unsave':'Save'}
                </div>
             </a>
           )}
         </Menu.Item>
         <Menu.Item>
           {({ active }) => (
             <a
               className={`flex gap-2 mx-4 py-2 items-center ${active ? ' bg-socialBlue rounded-md transition-all hover:scale-110 hover: -mx-2 px-2 text-white': 'text-gray-700'
                 }`}
             >
                <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0M3.124 7.5A8.969 8.969 0 015.292 3m13.416 0a8.969 8.969 0 012.168 4.5" />
            </svg>
            </div>
            <div className='text-sm'>
               Turn notification
               </div>
             </a>
           )}
         </Menu.Item>
         <Menu.Item>
           {({ active }) => (
             <a
               className={`flex gap-2 mx-4 py-2 items-center ${active ? ' bg-socialBlue rounded-md transition-all hover:scale-110 hover: -mx-2 px-2 text-white': 'text-gray-700'
                 }`}
             >
                <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
                </div>
                <div className='text-sm'>
               Hide post
               </div>
             </a>
           )}
         </Menu.Item>
         <Menu.Item>
           {({ active }) => (
             <a
               onClick={confirmDelete}                
               className={`flex gap-2 mx-4 py-2 cursor-pointer items-center ${active ? ' bg-socialBlue rounded-md transition-all hover:scale-110 hover: -mx-2 px-2 text-white': 'text-gray-700'
                 }`}
             >
            <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
            </div>
            <div className='text-sm'>
               Delete
            </div>
             </a>
           )}
         </Menu.Item>
         <Menu.Item>
           {({ active }) => (
             <a
               className={`flex gap-2 mx-4 py-2 items-center ${active ? ' bg-socialBlue rounded-md transition-all hover:scale-110 hover: -mx-2 px-2 text-white': 'text-gray-700'
                 }`}
             >
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
            </div>
            <div className='text-sm'>
               Report
            </div>
             </a>
           )}
         </Menu.Item>
       </Menu.Items>
       </Transition>
     </Menu>
     {showConfirmDialog && (
        <div className="fixed backdrop-blur-lg inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-1/3 border border-gray-400 rounded-lg shadow-lg p-6 backdrop-blur">
            <p className="text-lg mb-4 text-white">Are you sure you want to delete this post?</p>
            <div className="flex justify-center">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2"
                onClick={deletepost}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={cancelDelete}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      {isauthor && (
        <div className="fixed backdrop-blur-lg inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-900 w-1/3 border border-gray-400 rounded-lg shadow-lg p-6 backdrop-blur">
            <p className="text-lg mb-4 text-white">This is not your post!!</p>
            <div className="flex justify-center">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                onClick={cancelDelete}
              >
                ok
              </button>
            </div>
          </div>
        </div>
      )}
   </div>
 )
}


export default Dropdown;