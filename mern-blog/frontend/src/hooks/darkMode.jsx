//workspaces/codespaces-blank/mern-blog/frontend/src/hooks/darkMode.jsx
import { useState ,useEffect } from 'react';

export const useDarkMode = () => {
    const [darkModeOn, setdarkModeOn] = useState(false); // Start with lights ON

    // When we flip switch, remember our choice
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkModeOn));
        if (darkModeOn) {
            document.documentElement.classList.add('dark'); // Turn lights OFF
        } else {
            document.documentElement.classList.remove('dark'); // Turn lights ON
        }
    }, [darkModeOn]);

    return [darkModeOn, () => setdarkModeOn(!darkModeOn)]; // The light switch!
}
export default useDarkMode;