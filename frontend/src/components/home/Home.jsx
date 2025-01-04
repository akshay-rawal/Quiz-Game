import { useState } from "react";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import './Home.css';
function Home() {
  const [categories] = useState([
    "Cinema",
    "General Knowledge",
    "History",
    "Politics",
  ]); 
  const navigate = useNavigate();
const {isDark} = useTheme();  
  const handleCategorySelect = (category) => {
    navigate(`/questions/${category}`); // Navigate to the category's questions
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <Navbar />
      <div className="cards  flex flex-col sm:flex-row gap-4 sm:gap-8 ">
        {categories.map((category,index) => (
          <div
            key={category}
            className={` card card-${index+1}
             ${isDark ? 'bg-gray-800 text-white' :  'text-black'
            } p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer transform hover:scale-105`} 
            onClick={() => handleCategorySelect(category)}
          >
            <h2 className={`text-xl font-bold mb-4 text-center ${isDark ? ' text-white' : ' text-black'}`}>
              {category}
            </h2>
            <p className={` text-center ${
              isDark ? ' text-white' : ' text-black'}`}>
              Click to explore questions
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
