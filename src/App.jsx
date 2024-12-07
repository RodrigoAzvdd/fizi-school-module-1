import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "./components/ui/card";
import { Shuffle, Trophy, Clock, CheckCircle } from 'lucide-react';

const MatchingGame = () => {
  const lessons = [
    {
      id: 1,
      title: "Basic Components",
      terms: [
        { term: "Computer", definition: "Electronic machine that processes information and stores data" },
        { term: "Monitor", definition: "Display device that shows visual output from computer" },
        { term: "Keyboard", definition: "Input device used to type texts and commands" },
        { term: "Mouse", definition: "Digital pointer used to move cursor and select items" }
      ]
    },
    {
      id: 2,
      title: "Basic Controls",
      terms: [
        { term: "Left Click", definition: "Select items and open programs with double-click" },
        { term: "Right Click", definition: "Opens menus with additional options" },
        { term: "Space Bar", definition: "Create spaces between words" },
        { term: "Enter Key", definition: "Start new line or confirm actions" },
        { term: "Mouse Scroll", definition: "Wheel in the middle used to scroll through pages" },
        { term: "Backspace", definition: "Erases characters behind the cursor" }
      ]
    },
    {
      id: 3,
      title: "Essential Shortcuts",
      terms: [
        { term: "CTRL + C", definition: "Copy selected text or files" },
        { term: "CTRL + V", definition: "Paste copied content" },
        { term: "CTRL + Z", definition: "Undo the last action" },
        { term: "CAPS LOCK", definition: "Toggle uppercase writing mode" },
        { term: "CTRL + A", definition: "Select all content in active window" },
        { term: "CTRL + S", definition: "Save the current document" }
      ]
    },
    {
      id: 4,
      title: "File Management",
      terms: [
        { term: "Folder", definition: "Digital container to organize and store files" },
        { term: "File", definition: "Document or item stored on the computer" },
        { term: "Save", definition: "Store a document permanently" },
        { term: "New Folder", definition: "Create a container for organizing files" },
        { term: "Delete", definition: "Remove files or folders from the computer" },
        { term: "Rename", definition: "Change the name of a file or folder" }
      ]
    }
  ];

  const [currentLesson, setCurrentLesson] = useState(0);
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [incorrectPair, setIncorrectPair] = useState([]);
  const [isChecking, setIsChecking] = useState(false);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const initializeLesson = () => {
    const lessonTerms = lessons[currentLesson].terms;
    const allCards = [
      ...lessonTerms.map((item) => ({
        id: `term-${item.term}`,
        content: item.term,
        type: 'term'
      })),
      ...lessonTerms.map((item) => ({
        id: `def-${item.term}`,
        content: item.definition,
        type: 'definition'
      }))
    ];

    setCards(shuffleArray(allCards));
  };

  const handleCardClick = (card) => {
    if (!gameStarted) {
      setGameStarted(true);
    }

    if (isChecking) return;
    if (matchedPairs.includes(card.id)) return;
    if (selectedCards.find(selected => selected.id === card.id)) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setIsChecking(true);
      setMoves(prev => prev + 1);
      checkMatch(newSelected);
    }
  };

  const checkMatch = (selected) => {
    const [first, second] = selected;
    const isMatch = first.id.split('-')[1] === second.id.split('-')[1];

    if (isMatch) {
      const newMatched = [...matchedPairs, first.id, second.id];
      setMatchedPairs(newMatched);
      setIncorrectPair([]);

      if (newMatched.length === lessons[currentLesson].terms.length * 2) {
        if (!completedLessons.includes(currentLesson)) {
          setCompletedLessons([...completedLessons, currentLesson]);
        }
      }
    } else {
      setIncorrectPair([first.id, second.id]);
    }

    setTimeout(() => {
      setSelectedCards([]);
      setIncorrectPair([]);
      setIsChecking(false);
    }, 1000);
  };

  const resetGame = () => {
    setSelectedCards([]);
    setMatchedPairs([]);
    setIncorrectPair([]);
    setIsChecking(false);
    setMoves(0);
    setTimer(0);
    setGameStarted(false);
    initializeLesson();
  };

  const selectLesson = (index) => {
    setCurrentLesson(index);
    resetGame();
  };

  const getCardStyle = (cardId) => {
    if (matchedPairs.includes(cardId)) {
      return 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200';
    }
    if (incorrectPair.includes(cardId)) {
      return 'bg-gradient-to-br from-red-50 to-red-100 border-red-200';
    }
    return 'bg-gradient-to-br from-white to-gray-50 hover:from-blue-50 hover:to-blue-100';
  };

  useEffect(() => {
    initializeLesson();
  }, [currentLesson]);

  useEffect(() => {
    let interval;
    if (gameStarted && matchedPairs.length !== lessons[currentLesson].terms.length * 2) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, matchedPairs.length, currentLesson]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-semibold text-gray-700">
            {lessons[currentLesson].title}
          </h2>
          <div className="flex justify-center gap-3">
            {lessons.map((lesson, index) => (
              <button
                key={lesson.id}
                onClick={() => selectLesson(index)}
                className={`
                  px-4 py-2 rounded-lg flex items-center gap-2 transition-all
                  ${currentLesson === index
                    ? 'bg-blue-500 text-white border-2 border-blue-600 shadow-lg'
                    : 'bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300'
                  }
                  ${completedLessons.includes(index) ? 'border-green-300' : ''}
                `}
              >
                {completedLessons.includes(index) && (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                Lesson {lesson.id}
              </button>
            ))}
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <span className="text-lg font-semibold text-gray-700">{formatTime(timer)}</span>
          </div>
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-lg flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-semibold text-gray-700">
              {matchedPairs.length / 2} / {lessons[currentLesson].terms.length}
            </span>
          </div>
          <button
            onClick={resetGame}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Shuffle className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <Card
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`
                cursor-pointer transition-all duration-300 transform
                ${getCardStyle(card.id)}
                ${selectedCards.map(c => c.id).includes(card.id) ? 'ring-2 ring-purple-400 scale-105' : ''}
                ${isChecking ? 'pointer-events-none' : 'hover:scale-105'}
                shadow-lg hover:shadow-xl rounded-xl border-2 border-white/50
              `}
            >
              <CardContent className="p-4">
                <p className={`
                  text-center min-h-20 flex items-center justify-center
                  ${card.type === 'term' ? 'font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' : 'text-gray-700 text-base'}
                  ${incorrectPair.includes(card.id) ? 'text-red-600' : ''}
                `}>
                  {card.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Status */}
        {matchedPairs.length === lessons[currentLesson].terms.length * 2 && (
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 p-4 rounded-xl shadow-lg text-center">
            <p className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              🎉 Congratulations! You've completed {lessons[currentLesson].title}!
            </p>
            <p className="text-emerald-700 mt-2">
              Time: {formatTime(timer)} | Moves: {moves}
            </p>
            {currentLesson < lessons.length - 1 && (
              <button
                onClick={() => selectLesson(currentLesson + 1)}
                className="mt-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                Continue to Lesson {currentLesson + 2}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchingGame;