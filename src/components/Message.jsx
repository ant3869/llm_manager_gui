import { motion } from "framer-motion";
import { ThumbUpIcon, ThumbDownIcon } from "@heroicons/react/outline";

export default function Message({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div className={`max-w-[80%] rounded-lg p-4 ${
        isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800'
      }`}>
        <p className="text-sm">{message.content}</p>
        
        {!isUser && (
          <div className="flex items-center mt-2 space-x-2">
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              <ThumbUpIcon className="h-4 w-4" />
            </button>
            <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
              <ThumbDownIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
