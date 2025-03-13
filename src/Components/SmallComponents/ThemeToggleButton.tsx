import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useColorScheme } from '@mui/joy';

export const ThemeToggleButton = () => {
  const { mode, setMode } = useColorScheme();
  console.log(mode);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className='flex items-center justify-center fixed top-4 right-8 z-50'>
      <FontAwesomeIcon icon={faSun} className={`text-2xl transition ${mode === 'dark' ? 'text-gray-700' : 'text-yellow-400'}`} />
      <div className='rounded-[5000px] bg-gray-300 dark:bg-gray-700 w-[50px] h-6 mx-2 flex items-center cursor-pointer' onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}>
        <div className={`rounded-[5000px] w-5 h-5 bg-white dark:bg-gray-500 transform transition-transform ${mode === 'dark' ? 'translate-x-6' : ' translate-x-1'}`}></div>
      </div>
      <FontAwesomeIcon icon={faMoon} className={`text-2xl transition duration-300 ${mode === 'dark' ? 'text-gray-500' : 'text-gray-200'}`} />
    </div>
  )
}
