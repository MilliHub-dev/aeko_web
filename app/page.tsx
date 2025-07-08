export default function SocialMediaLayout() {
  return (
    <div className="">
      {/* Main Content Placeholder */}
      <div className="bg-purple-100 border-2 border-dashed border-purple-300 rounded-lg p-8 text-center">
        <span className="text-purple-600 font-medium block text-lg">
          Main Content Area
        </span>
        <span className="text-purple-500 text-sm">Feed / Posts / Videos</span>
      </div>

      {/* Additional Content Blocks */}
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="bg-purple-50 border border-purple-200 rounded-lg p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="bg-purple-200 rounded-full w-10 h-10 flex items-center justify-center">
              <span className="text-purple-600 text-xs font-bold">U{item}</span>
            </div>
            <div className="bg-purple-200 rounded px-3 py-1">
              <span className="text-purple-600 text-xs">Actions</span>
            </div>
          </div>
          <div className="bg-purple-100 rounded h-32 mb-3 flex items-center justify-center">
            <span className="text-purple-500 text-sm">
              Content Block {item}
            </span>
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
  );
}
