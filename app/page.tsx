import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="hidden md:flex fixed top-0 z-10 w-full h-14 bg-blue-500 border-b border-gray-700 justify-center items-center">
        <h1>Desktop Nav Bar</h1>
      </header>

      {/* Main container */}
      <div className="flex mx-auto">
        {/* Left sidebar */}
        <div className="hidden md:flex fixed left-0 top-14 w-[280px] h-[calc(100vh-3.5rem)] bg-background border-r border-gray-700">
          <h1>Left Sidebar</h1>
        </div>

        {/* Main content */}
        <main className="flex-1 min-h-screen  mt-14">
          <div className="max-w-[600px] mx-auto py-4 px-6">
            <h1>Aeko Main Feed Section</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate accusamus ipsam nobis amet officiis excepturi debitis necessitatibus deleniti deserunt accusantium earum tenetur dolorem, molestias eum possimus cumque veniam assumenda a!</p>
            </div>
        </main>

        {/* Right sidebar */}
        <div className="hidden md:flex fixed right-0 top-14 w-[320px] h-[calc(100vh-3.5rem)] bg-background border-l border-gray-700">
          <h1>Right Sidebar</h1>
        </div>
      </div>

      {/* Mobile navbar */}
      <div className="flex md:hidden fixed bottom-0 z-10 w-full h-14 bg-blue-500 border-b border-gray-700 justify-center items-center">
        <h1>Mobile Nav Bar</h1>
      </div>
    </div>
  );
}
