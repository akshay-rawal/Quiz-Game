

import Question from '../../models/questionSchema.js';

export const insertQuestions = async () => {
  try {
    const questions = [{
      questionText: 'What is the capital of France?',
      options: ['Paris', 'London', 'Berlin', 'Madrid'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the capital of India?',
      options: ['Mumbai', 'New Delhi', 'Chennai', 'Kolkata'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who was the first Prime Minister of India?',
      options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Indira Gandhi'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which Indian state is known as the "Land of Five Rivers"?',
      options: ['Rajasthan', 'Punjab', 'Kerala', 'Uttar Pradesh'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the national animal of India?',
      options: ['Lion', 'Tiger', 'Elephant', 'Peacock'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who wrote the Indian national anthem?',
      options: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Subhash Chandra Bose', 'Sarojini Naidu'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which is the longest river in India?',
      options: ['Ganga', 'Brahmaputra', 'Yamuna', 'Godavari'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the official language of India?',
      options: ['Hindi', 'English', 'Sanskrit', 'Both Hindi and English'],
      correctAnswer: 'D',
      category: 'General Knowledge',
    },
    {
      questionText: 'In which year did India gain independence?',
      options: ['1945', '1947', '1950', '1952'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'What is the currency of India?',
      options: ['Rupee', 'Dollar', 'Pound', 'Yen'],
      correctAnswer: 'A',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which Indian city is known as the "Silicon Valley of India"?',
      options: ['Mumbai', 'Hyderabad', 'Bengaluru', 'Chennai'],
      correctAnswer: 'C',
      category: 'General Knowledge',
    },
    {
      questionText: 'Who is known as the "Father of the Nation" in India?',
      options: ['Jawaharlal Nehru', 'Mahatma Gandhi', 'Subhash Chandra Bose', 'Bhagat Singh'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    {
      questionText: 'Which festival is known as the "Festival of Lights" in India?',
      options: ['Holi', 'Diwali', 'Eid', 'Pongal'],
      correctAnswer: 'B',
      category: 'General Knowledge',
    },
    
    {
      questionText: 'Who is known as the "King of Bollywood"?',
      options: ['Amitabh Bachchan', 'Salman Khan', 'Shah Rukh Khan', 'Aamir Khan'],
      correctAnswer: 'C',
      category: 'Cinema',
    },
    {
      questionText: 'Which was the first Indian sound film?',
      options: ['Alam Ara', 'Raja Harishchandra', 'Mother India', 'Mughal-e-Azam'],
      correctAnswer: 'A',
      category: 'Cinema',
    },
    {
      questionText: 'Who is referred to as the "Tragedy King" of Bollywood?',
      options: ['Dilip Kumar', 'Raj Kapoor', 'Dev Anand', 'Guru Dutt'],
      correctAnswer: 'A',
      category: 'Cinema',
    },
    {
      questionText: 'Which Bollywood movie is the highest-grossing film of all time (as of 2023)?',
      options: ['Dangal', 'RRR', 'Pathaan', 'Baahubali: The Conclusion'],
      correctAnswer: 'C',
      category: 'Cinema',
    },
    {
      questionText: 'Who composed the music for the iconic Bollywood film "Dilwale Dulhania Le Jayenge"?',
      options: ['A.R. Rahman', 'Jatin-Lalit', 'Shankar-Ehsaan-Loy', 'Anu Malik'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which actress is known as the "Dream Girl" of Bollywood?',
      options: ['Madhuri Dixit', 'Hema Malini', 'Sridevi', 'Rekha'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Who directed the Bollywood classic "Sholay"?',
      options: ['Yash Chopra', 'Ramesh Sippy', 'Raj Kapoor', 'Karan Johar'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which Bollywood actor has the nickname "Bhai"?',
      options: ['Shah Rukh Khan', 'Salman Khan', 'Aamir Khan', 'Akshay Kumar'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which Bollywood movie won India’s first Oscar?',
      options: ['Mother India', 'Slumdog Millionaire', 'Gandhi', 'Lagaan'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Who was the first female superstar of Bollywood?',
      options: ['Madhubala', 'Sridevi', 'Rekha', 'Meena Kumari'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Which actor is famous for the dialogue "Kitne aadmi the?" in "Sholay"?',
      options: ['Amitabh Bachchan', 'Amjad Khan', 'Sanjeev Kumar', 'Dharmendra'],
      correctAnswer: 'B',
      category: 'Cinema',
    },
    {
      questionText: 'Who is the founder of Dharma Productions?',
      options: ['Aditya Chopra', 'Karan Johar', 'Yash Johar', 'Subhash Ghai'],
      correctAnswer: 'C',
      category: 'Cinema',
    },
    {
      questionText: 'Who was the first Mughal Emperor of India?',
      options: ['Akbar', 'Babur', 'Shah Jahan', 'Aurangzeb'],
      correctAnswer: 'B',
      category: 'History',
    },
    {
      questionText: 'In which year did India gain independence from British rule?',
      options: ['1945', '1946', '1947', '1948'],
      correctAnswer: 'C',
      category: 'History',
    },
    {
      questionText: 'Who was the founder of the Maurya Empire?',
      options: ['Chandragupta Maurya', 'Ashoka', 'Bindusara', 'Bimbisara'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Who is known as the Iron Man of India?',
      options: ['Jawaharlal Nehru', 'Sardar Vallabhbhai Patel', 'Subhas Chandra Bose', 'Lal Bahadur Shastri'],
      correctAnswer: 'B',
      category: 'History',
    },
    {
      questionText: 'Which famous battle marked the beginning of British rule in India?',
      options: ['Battle of Plassey', 'Battle of Panipat', 'Battle of Buxar', 'Battle of Talikota'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Who wrote the Indian national anthem, "Jana Gana Mana"?',
      options: ['Rabindranath Tagore', 'Bankim Chandra Chatterjee', 'Sarojini Naidu', 'Subramania Bharati'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Who was the last Viceroy of India?',
      options: ['Lord Mountbatten', 'Lord Wavell', 'Lord Linlithgow', 'Lord Curzon'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Who was the leader of the 1857 Revolt in Kanpur?',
      options: ['Tantia Tope', 'Rani Laxmibai', 'Bahadur Shah Zafar', 'Nana Saheb'],
      correctAnswer: 'D',
      category: 'History',
    },
    {
      questionText: 'Which movement was led by Mahatma Gandhi in 1942?',
      options: ['Non-Cooperation Movement', 'Civil Disobedience Movement', 'Quit India Movement', 'Swadeshi Movement'],
      correctAnswer: 'C',
      category: 'History',
    },
    {
      questionText: 'Who is referred to as the Father of the Indian Constitution?',
      options: ['Mahatma Gandhi', 'B.R. Ambedkar', 'Jawaharlal Nehru', 'Rajendra Prasad'],
      correctAnswer: 'B',
      category: 'History',
    },
    {
      questionText: 'Which ancient university was located in Bihar, India?',
      options: ['Nalanda', 'Takshashila', 'Vikramashila', 'Somapura'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Which ruler is known for his edicts inscribed on rocks and pillars?',
      options: ['Ashoka', 'Chandragupta Maurya', 'Harsha', 'Kanishka'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Who established the Brahmo Samaj in 1828?',
      options: ['Raja Ram Mohan Roy', 'Swami Vivekananda', 'Dayanand Saraswati', 'Ishwar Chandra Vidyasagar'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'The Dandi March was part of which movement?',
      options: ['Non-Cooperation Movement', 'Civil Disobedience Movement', 'Quit India Movement', 'Swadeshi Movement'],
      correctAnswer: 'B',
      category: 'History',
    },
    {
      questionText: 'Who was the first woman ruler of India?',
      options: ['Razia Sultana', 'Nur Jahan', 'Ahilyabai Holkar', 'Rani Laxmibai'],
      correctAnswer: 'A',
      category: 'History',
    },
    {
      questionText: 'Who is known as the Father of the Nation in India?',
      options: ['Jawaharlal Nehru', 'B.R. Ambedkar', 'Mahatma Gandhi', 'Sardar Patel'],
      correctAnswer: 'C',
      category: 'Politics',
    },
    {
      questionText: 'Which Article of the Indian Constitution guarantees the Right to Equality?',
      options: ['Article 12', 'Article 14', 'Article 16', 'Article 19'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Who was the first Prime Minister of India?',
      options: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Sardar Patel', 'Rajendra Prasad'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Who is the head of the Indian state according to the Constitution?',
      options: ['Prime Minister', 'President', 'Chief Justice', 'Vice President'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Which body is responsible for conducting elections in India?',
      options: ['Supreme Court', 'Election Commission of India', 'Parliament', 'Lok Sabha'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Who was the first President of India?',
      options: ['Rajendra Prasad', 'S. Radhakrishnan', 'Zakir Hussain', 'V.V. Giri'],
      correctAnswer: 'A',
      category: 'Politics',
    },
    {
      questionText: 'Which party was in power at the time of Indian independence?',
      options: ['Indian National Congress', 'Bharatiya Janata Party', 'Communist Party', 'Swaraj Party'],
      correctAnswer: 'A',
      category: 'Politics',
    },
    {
      questionText: 'Which amendment to the Indian Constitution is known as the "Mini Constitution"?',
      options: ['42nd Amendment', '44th Amendment', '73rd Amendment', '86th Amendment'],
      correctAnswer: 'A',
      category: 'Politics',
    },
    {
      questionText: 'Who was the first woman Prime Minister of India?',
      options: ['Sarojini Naidu', 'Indira Gandhi', 'Pratibha Patil', 'Sonia Gandhi'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'How many seats are there in the Lok Sabha?',
      options: ['500', '545', '250', '400'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Which part of the Indian Constitution deals with Fundamental Rights?',
      options: ['Part II', 'Part III', 'Part IV', 'Part V'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Who appoints the Governor of an Indian state?',
      options: ['Chief Minister', 'Prime Minister', 'President', 'Supreme Court'],
      correctAnswer: 'C',
      category: 'Politics',
    },
    {
      questionText: 'Which house of Parliament is also called the Council of States?',
      options: ['Lok Sabha', 'Rajya Sabha', 'Vidhan Sabha', 'Vidhan Parishad'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Who was the architect of the Indian Constitution?',
      options: ['Mahatma Gandhi', 'B.R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Patel'],
      correctAnswer: 'B',
      category: 'Politics',
    },
    {
      questionText: 'Which schedule of the Indian Constitution deals with the division of powers between Union and States?',
      options: ['Seventh Schedule', 'Eighth Schedule', 'Ninth Schedule', 'Tenth Schedule'],
      correctAnswer: 'A',
      category: 'Politics',
    },
  
    
    
    ];

    await Question.insertMany(questions);
    console.log('Question inserted successfully!');
  } catch (error) {
    console.error('Error inserting question:', error);
  } 
};
