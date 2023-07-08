import Avatar from "./Avatar";
import Card from "./Card";
// import ClickOutHandler from 'react-clickout-handler'
import {useContext, useEffect, useState} from "react";
import Link from "next/link";
import ReactTimeAgo from "react-time-ago";
import {UserContext} from "../contexts/UserContext";
import {useSupabaseClient} from "@supabase/auth-helpers-react";
import Dropdown from "./dropdown"


export default function PostCard({id,content,created_at,photos,profiles:authorProfile}) {
  // const [dropdownOpen,setDropdownOpen] = useState(false);
  const [likes,setLikes] = useState([]);
  // console.log(authorProfile?.avatar);
  // if(!authorProfile) return;
  const [comments,setComments] = useState([]);
  const [commentText,setCommentText] = useState('');
  
  const {profile:myProfile} = useContext(UserContext);
  const supabase = useSupabaseClient();
  useEffect(() => {
    fetchLikes();
    fetchComments();
    // if (myProfile?.id) fetchIsSaved();
  }, [myProfile?.id]);
  // console.log(authorProfile);
  // if(!authorProfile)
  // function fetchIsSaved() {
  //   supabase
  //     .from('saved_posts')
  //     .select()
  //     .eq('post_id', id)
  //     .eq('user_id', myProfile?.id)
  //     .then(result => {
  //       if (result.data.length > 0) {
  //         setIsSaved(true);
  //       } else {
  //         setIsSaved(false);
  //       }
  //     })
  // }
  function fetchLikes() {
    supabase.from('likes').select().eq('post_id', id)
      .then(result => setLikes(result.data));
  }
  function fetchComments() {
    supabase.from('posts')
      .select('*, profiles(*)')
      .eq('parent', id)
      .then(result => setComments(result.data));
  }
  // function openDropdown(e) {
  //   e.stopPropagation();
  //   setDropdownOpen(true);
  // }
  // function handleClickOutsideDropdown(e) {
  //   e.stopPropagation();
  //   setDropdownOpen(false);
  // }


  const isLikedByMe = !!likes.find(like => like.user_id === myProfile?.id);

  function toggleLike() {
    if (isLikedByMe) {
      supabase.from('likes').delete()
        .eq('post_id', id)
        .eq('user_id', myProfile?.id)
        .then(() => {
          fetchLikes();
        });
      return;
    }
    supabase.from('likes')
      .insert({
        post_id: id,
        user_id: myProfile?.id,
      })
      .then(result => {
        fetchLikes();
      })
  }

  function postComment(ev) {
    ev.preventDefault();
    supabase.from('posts')
      .insert({
        content:commentText,
        author:myProfile?.id,
        parent:id,
      })
      .then(result => {
        console.log(result);
        fetchComments();
        setCommentText('');
      })
  }

  return (
    <Card>
      <div className="flex gap-3">
        <div>
          <Link href={'/profile/'+authorProfile?.id}>
            <span className="cursor-pointer">
              <Avatar url={authorProfile?.avatar} />
            </span>
          </Link>
        </div>
        <div className="grow">
          <p className="flex">
            <Link href={'/profile/'+authorProfile?.id}>
              <span className="mr-1 font-semibold cursor-pointer text-gray-300 hover:underline">
                {authorProfile?.name}
              </span>
            </Link>
            <div className="text-gray-400">shared a post</div>
          </p>
          <p className="text-gray-500 text-sm">
            <ReactTimeAgo date={ (new Date(created_at)).getTime() } />
          </p>
        </div>
        <div className="relative">
          <Dropdown postid={id} />
        </div>
      </div>
      <div>
        <p className="my-3 text-sm text-white">{content}</p>
        {photos?.length > 0 && (
          <div className="flex gap-4">
            {photos.map(photo => (
              <div key={photo} className="">
                <img src={photo} className="rounded-md" alt=""/>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-8">
        <button className="flex gap-2 items-center" onClick={toggleLike}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className={"w-6 h-6 " + (isLikedByMe ? ' fill-red-600 stroke-red-600' : '')}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <div className="text-white">{likes?.length}</div>
        </button>
        <button className="flex gap-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
          <div className="text-white">{comments?.length}</div>
        </button>
        <button className="flex gap-2 items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
          </svg>
        </button>
      </div>
      <div className="flex mt-4 gap-3">
        <div>
          <Link href={'/profile/'+myProfile?.id}>
            <span className="cursor-pointer">
              <Avatar url={myProfile?.avatar} />
            </span>
          </Link>
        </div>
        <div className="border grow rounded-full ">
          <form onSubmit={postComment}>
            <input
              value={commentText}
              onChange={ev => setCommentText(ev.target.value)}
              
              className="block w-full p-3 px-4 overflow-hidden h-12 rounded-full" placeholder="Leave a comment"/>
          </form>
        </div>
      </div>
      <div>
        {comments.length > 0 && (
          <div className="mt-4 mb-4 border-b border-b-gray-700 w-full"></div>
        )}
        {comments.length > 0 && comments.map(comment => (
          
          <div key={comment.id} className="mt-2 flex gap-2 items-center">
            <Avatar url={comment.profiles.avatar} />
            <div className="bg-gray-300 py-2 px-4 rounded-3xl ">
              <div>
                <Link href={'/profile/'+comment.profiles.id}>
                  <span className="hover:underline font-semibold mr-1">
                    {comment.profiles.name}
                  </span>
                </Link>
                <span className="text-sm text-gray-400">
                  <ReactTimeAgo timeStyle={'twitter'} date={(new Date(comment.created_at)).getTime()} />
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}