export default function SocialMediaLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Header - Hidden on mobile */}
      <header className="hidden md:block fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-center h-full">
          <div className="bg-blue-100 border-2 border-dashed border-blue-300 rounded-lg px-6 py-2">
            <span className="text-blue-600 font-medium">Header / Top Navigation</span>
          </div>
        </div>
      </header>

      {/* Main Layout Container with max-width */}
      <div className="max-w-7xl mx-auto flex md:pt-16">
        {/* Left Sidebar - Compact on tablet, full width on desktop */}
        <aside className="hidden md:block fixed left-[max(0px,calc(50%-640px))] top-16 bottom-0 w-16 lg:w-64 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-2 lg:p-4 h-full">
            <div className="bg-green-100 border-2 border-dashed border-green-300 rounded-lg p-2 lg:p-4 h-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-green-600 font-medium block text-xs lg:text-base">
                  <span className="lg:hidden">Nav</span>
                  <span className="hidden lg:block">Left Sidebar</span>
                </span>
                <span className="text-green-500 text-xs hidden lg:block">Navigation Menu</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 md:ml-16 lg:ml-64 xl:mr-80">
          <div className="max-w-2xl mx-auto px-4 py-6 md:py-8">
            <div className="space-y-6">
              {/* Main Content Placeholder */}
              <div className="bg-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
                <span className="text-purple-600 font-medium block text-lg">Main Content Area</span>
                <span className="text-purple-500 text-sm">Feed / Posts / Videos</span>
              </div>

              {/* Additional Content Blocks */}
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-purple-200 rounded-full w-10 h-10 flex items-center justify-center">
                      <span className="text-purple-600 text-xs font-bold">U{item}</span>
                    </div>
                    <div className="bg-purple-200 rounded px-3 py-1">
                      <span className="text-purple-600 text-xs">Actions</span>
                    </div>
                  </div>
                  <div className="bg-purple-100 rounded h-32 mb-3 flex items-center justify-center">
                    <span className="text-purple-500 text-sm">Content Block {item}</span>
                  </div>
                  <div className="flex space-x-4">
                    <div className="bg-purple-200 rounded px-3 py-1 flex-1 text-center">
                      <span className="text-purple-600 text-xs">Like</span>
                    </div>
                    <div className="bg-purple-200 rounded px-3 py-1 flex-1 text-center">
                      <span className="text-purple-600 text-xs">Comment</span>
                    </div>
                    <div className="bg-purple-200 rounded px-3 py-1 flex-1 text-center">
                      <span className="text-purple-600 text-xs">Share</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar - Fixed positioning within container */}
        <aside className="hidden xl:block fixed right-[max(0px,calc(50%-640px))] top-16 bottom-0 w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-4 h-full">
            <div className="space-y-4">
              {/* Trending/Suggestions Section */}
              <div className="bg-orange-100 border-2 border-dashed border-orange-300 rounded-lg p-4">
                <span className="text-orange-600 font-medium block mb-2">Right Sidebar</span>
                <span className="text-orange-500 text-sm">Trending / Suggestions</span>
              </div>

              {/* Additional Right Sidebar Content */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center space-x-3">
                      <div className="bg-orange-200 rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-orange-600 text-xs">S{item}</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-orange-100 rounded h-4 mb-1"></div>
                        <div className="bg-orange-100 rounded h-3 w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who to Follow Section */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="bg-orange-200 rounded px-3 py-2 mb-3 text-center">
                  <span className="text-orange-600 text-sm font-medium">Who to Follow</span>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-orange-200 rounded-full w-6 h-6"></div>
                        <div className="bg-orange-100 rounded h-3 w-16"></div>
                      </div>
                      <div className="bg-orange-200 rounded px-2 py-1">
                        <span className="text-orange-600 text-xs">Follow</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation - Only visible on mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="flex items-center justify-around h-16 px-4">
          {["Home", "Search", "Create", "Activity", "Profile"].map((item) => (
            <div key={item} className="bg-red-100 border border-red-300 rounded-lg px-3 py-2 flex-1 mx-1">
              <div className="text-center">
                <div className="bg-red-200 rounded-full w-6 h-6 mx-auto mb-1"></div>
                <span className="text-red-600 text-xs font-medium">{item}</span>
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Padding */}
      <div className="md:hidden h-16"></div>
    </div>
  )
}
