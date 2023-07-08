import PostCard from "./PostCard";
import Card from "./Card";
import FriendInfo from "./FriendInfo";
import {useEffect, useState} from "react";
import {useSession, useSupabaseClient} from "@supabase/auth-helpers-react";

export default function ProfileContent({activeTab,userId}) {
  const [posts,setPosts] = useState([]);
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [about, setAbout] = useState('');
  const [originalAbout, setOriginalAbout] = useState('');
  const supabase = useSupabaseClient();
  const session=useSession();
  const isMyUser = userId === session?.user?.id;
  console.log(userId);
  useEffect(() => {
    if (!userId) {
      return () => {};
    }
    if (activeTab === 'posts') {
      loadPosts().then(() => {});
      loadProfile().then(() => {});
    }
    if (activeTab === 'about') {
      loadProfile().then(() => {});
    }
  }, [userId, activeTab]);

  useEffect(() => {
    if (profile) {
      setAbout(profile?.about || '');
      setOriginalAbout(profile?.about || '');
    }
  }, [profile]);

  async function loadPosts() {
    const posts = await userPosts(userId);
    setPosts(posts);
  }

  async function loadProfile() {
    const profile = await userProfile(userId);
    setProfile(profile);
  }

  async function userPosts(userId) {
    const { data } = await supabase
      .from('posts')
      .select('id,content,created_at,author,photos')
      .eq('author', userId);
      console.log(data);

    return data;
  }

  async function userProfile(userId) {
    const { data } = await supabase
      .from('profiles')
      .select()
      .eq('id', userId);
    return data?.[0];
  }

  async function saveAbout() {
    await supabase
      .from('profiles')
      .update({ about })
      .eq('id', userId);
    setEditMode(false);
    setOriginalAbout(about);
  }

  function cancelEdit() {
    setEditMode(false);
    setAbout(originalAbout);
  }

  // console.log(profile);
  console.log()

  return (
    <div>
      {activeTab === 'posts' && (
        <div>
          {posts?.length > 0 && posts.map(post => (
            <PostCard key={post.created_at} {...post} profiles={profile} />
          ))}
        </div>
      )}
      {activeTab === 'about' && (
        <div>
        <Card>
          <div className="">
            <div>
              <h2 className="text-3xl mb-2 text-gray-600">About me</h2>
              {editMode ? (
                <textarea
                  value={about}
                  onChange={e => setAbout(e.target.value)}
                  className="text-white bg-black border-2 rounded-md border-gray-700 border-dotted text-sm mb-2 w-full"
                ></textarea>
              ) : (
                <p className="text-sm text-gray-300 mb-2">{about}</p>
              )}
            </div>
            <div className="flex justify-end">
              {isMyUser && editMode ? (
                <>
                  <button
                    onClick={saveAbout}
                    className="bg-white text-gray-600 p-1 rounded-full border-2"
                  >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="bg-white text-gray-600 p-1 rounded-full border-2"
                  >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                  </button>
                </>
              ) : (
                isMyUser && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-white text-gray-600 p-1 rounded-full border-2"
                  >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                  </button>
                )
              )}
            </div>
          </div>
        </Card>
      </div>
    )}
      
      {activeTab === 'photos' && (
        <div>
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1601581875039-e899893d520c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt=""/>
              </div>
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1563789031959-4c02bcb41319?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt=""/>
              </div>
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1560703650-ef3e0f254ae0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt=""/>
              </div>
              <div className="rounded-md overflow-hidden h-48 flex items-center shadow-md">
                <img src="https://images.unsplash.com/photo-1601581874834-3b6065645e07?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt=""/>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}