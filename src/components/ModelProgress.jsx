import { motion } from 'framer-motion';

export default function ModelProgress({ isRunning }) {
  if (!isRunning) return null;

  return (
    <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-blue-500"
        initial={{ width: "0%" }}
        animate={{
          width: ["0%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}
