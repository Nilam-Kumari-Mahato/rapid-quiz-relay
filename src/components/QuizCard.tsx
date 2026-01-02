import React from "react";

interface QuizCardProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
  timeLeft: number;
}

const QuizCard: React.FC<QuizCardProps> = ({ question, options, onSelect, timeLeft }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-semibold text-indigo-600">Rapid Relay</span>
        <span className={`text-sm font-bold ${timeLeft < 10 ? 'text-red-500' : 'text-green-500'}`}>
          ⏱ {timeLeft}s
        </span>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">{question}</h2>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelect(option)}
            className="w-full text-left px-4 py-3 rounded-lg border hover:bg-indigo-50 hover:border-indigo-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizCard;
