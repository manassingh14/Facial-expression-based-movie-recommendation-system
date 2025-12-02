import 'boxicons/css/boxicons.min.css';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import Footer from './Footer';

const Hero = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showFooter, setShowFooter] = useState(false);

  const handleGetStarted = () => {
    setShowFooter(true);
  };
  return (
    <main className="flex lg:mt-20 flex-col lg:flex-row items-center justify-between min-h-[calc(90vh-6rem)] relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1E3C72, #2A5298)'
      }}>

        <div className="max-w-xl ml-[5%] z-10 mt-[90%] md:mt-[60%] lg:mt-0">

            {/* Tag box-with gradient border */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className='relative w-[95%] sm:w-48 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 
            shadow-[0_0_20px_rgba(59,130,246,0.5)] rounded-full mb-4'>
                <div className='absolute inset-[3px] bg-gradient-to-r from-blue-900 to-purple-900 rounded-full flex items-center 
                justify-center gap-1 text-white text-xs font-semibold'>
                    <i class='bx bx-diamond'></i> INTRODUCING
                </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
            tracking-wider my-8 text-white drop-shadow-lg'>
                MOVIES FOR 
                <br />
                YOUR MOOD
            </motion.h1>

            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className='text-base sm:text-lg tracking-wider text-blue-100 max-w-[25rem] 
            lg:max-w-[30rem]'>
                Discover movies that match your mood. 
                Using facial expressions, 
                MoodFlix recommends the perfect film for you.
            </motion.p>

            {/* Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className='flex gap-4 mt-12'>
                <motion.button
                  onClick={handleGetStarted}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='border-2 border-white py-2 sm:py-3 px-8 sm:px-10 rounded-full 
                  sm:text-lg text-sm font-semibold tracking-wider bg-transparent text-white shadow-lg hover:shadow-xl relative overflow-hidden group'
                >
                  <motion.span
                    className="absolute inset-0 bg-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10 flex items-center gap-2 group-hover:text-blue-600 transition-colors duration-300">
                    Get Started <i className='bx bx-link-external'></i>
                  </span>
                </motion.button>
            </motion.div>
        </div>

        {/* Animated floating shapes */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="relative w-full h-full flex items-center justify-center lg:w-auto lg:h-auto"
        >
          <div className="relative w-96 h-96 lg:w-[500px] lg:h-[500px]">
            {/* Floating circles */}
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full blur-xl"
              animate={{
                y: [0, -30, 0],
                x: [0, 20, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute top-32 right-20 w-32 h-32 bg-cyan-300/30 rounded-full blur-xl"
              animate={{
                y: [0, 30, 0],
                x: [0, -20, 0],
                scale: [1, 0.8, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            />
            <motion.div
              className="absolute bottom-20 left-1/4 w-24 h-24 bg-purple-300/30 rounded-full blur-xl"
              animate={{
                y: [0, -25, 0],
                x: [0, 15, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.div
              className="absolute bottom-32 right-1/3 w-28 h-28 bg-blue-300/30 rounded-full blur-xl"
              animate={{
                y: [0, 35, 0],
                x: [0, -15, 0],
                scale: [1, 0.9, 1],
              }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.5,
              }}
            />
            
            {/* Central animated icon */}
            <motion.div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="text-white/80 text-9xl lg:text-[200px] drop-shadow-2xl">
                <i className="bx bx-movie-play"></i>
              </div>
            </motion.div>
            
            {/* Orbiting small circles */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 360) / 8;
              const radius = 120;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              return (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3 h-3 bg-white/70 rounded-full"
                  animate={{
                    x: [
                      x,
                      Math.cos(((angle + 360) * Math.PI) / 180) * radius,
                      x,
                    ],
                    y: [
                      y,
                      Math.sin(((angle + 360) * Math.PI) / 180) * radius,
                      y,
                    ],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.1,
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Footer Component */}
        <Footer isVisible={showFooter} onClose={() => setShowFooter(false)} />
    </main>
  )
}

export default Hero
