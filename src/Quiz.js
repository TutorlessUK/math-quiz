

const PRIMARY_COLOR = '#1A4C2B';

const questions = [
  { 
    id: 1, 
    text: "What's 4+4?", 
    answer: "8",
    difficulty: "easy",
    hint: "Count up from 4 another 4 times"
  },
  { 
    id: 2, 
    text: "What's 19 x 3?", 
    answer: "57",
    difficulty: "medium",
    hint: "Break it down: (20 × 3) - (1 × 3)"
  },
  { 
    id: 3, 
    text: "Divide 117 by 33", 
    answer: "3.55",
    difficulty: "medium",
    hint: "Use long division or a calculator for this one"
  },
  { 
    id: 4, 
    text: "Solve: x/(x + 2) = 2", 
    answer: "-4",
    difficulty: "hard",
    hint: "Multiply both sides by (x + 2) to eliminate the fraction"
  },
  { 
    id: 5, 
    text: "A computer game load time has improved from 48 seconds to 30 seconds after an update. What is the percentage decrease in load time?", 
    answer: "37.5",
    difficulty: "hard",
    hint: "Use the formula: ((original - new) / original) × 100"
  }
];

const QuestionCard = ({ question, userInput, setUserInput, onSubmit, showHint, setShowHint }) => {
  const difficultyColors = {
    easy: 'bg-green-100',
    medium: 'bg-yellow-100',
    hard: 'bg-red-100'
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <span className={`px-3 py-1 rounded-full text-sm ${difficultyColors[question.difficulty]}`}>
          {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
        </span>
        <button
          onClick={() => setShowHint(!showHint)}
          className="text-gray-600 hover:text-gray-800"
        >
          <AlertCircle size={20} />
        </button>
      </div>
      
      <h2 className="text-2xl mb-4 text-gray-800">{question.text}</h2>
      
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4"
          >
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Hint</AlertTitle>
              <AlertDescription>{question.hint}</AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <input
        type="text"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:outline-none"
        style={{ 
          '--tw-ring-color': PRIMARY_COLOR,
          borderColor: 'focus' ? PRIMARY_COLOR : undefined
        }}
        placeholder="Enter your answer..."
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
      />
    </div>
  );
};

const Quiz = () => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userInput, setUserInput] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const resetQuiz = () => {
    setStarted(false);
    setCurrentQuestion(0);
    setAnswers({});
    setUserInput('');
    setShowResults(false);
    setLoading(false);
    setShowHint(false);
  };

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = () => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: userInput.trim()
    }));
    setUserInput('');
    setShowHint(false);
    
    if (currentQuestion === questions.length - 1) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        setShowResults(true);
      }, 1500);
    } else {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const getScore = () => {
    return Object.entries(answers).filter(([_, answer]) => {
      const questionIndex = parseInt([_]);
      return Math.abs(parseFloat(answer) - parseFloat(questions[questionIndex].answer)) < 0.1;
    }).length;
  };

  const ProgressBar = () => (
    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
      <motion.div
        style={{ backgroundColor: PRIMARY_COLOR }}
        initial={{ width: 0 }}
        animate={{ width: `${(currentQuestion / questions.length) * 100}%` }}
        transition={{ duration: 0.5 }}
        className="h-full"
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center bg-white p-8 rounded-lg shadow-lg"
            >
              <h1 className="text-4xl font-bold mb-8" style={{ color: PRIMARY_COLOR }}>Math Skills Assessment</h1>
              <p className="mb-8 text-lg text-gray-600">
                Test includes 5 questions of varying difficulty. Take your time and use hints if needed.
              </p>
              <button
                onClick={handleStart}
                className="text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                style={{ backgroundColor: PRIMARY_COLOR }}
              >
                Begin Assessment
              </button>
            </motion.div>
          )}

          {started && !showResults && !loading && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Question {currentQuestion + 1} of {questions.length}</span>
                </div>
                <ProgressBar />
              </div>

              <QuestionCard
                question={questions[currentQuestion]}
                userInput={userInput}
                setUserInput={setUserInput}
                onSubmit={handleAnswer}
                showHint={showHint}
                setShowHint={setShowHint}
              />

              <div className="flex justify-end">
                <button
                  onClick={handleAnswer}
                  className="text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center space-x-2"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
                  <CheckCircle2 size={20} />
                </button>
              </div>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center bg-white p-8 rounded-lg shadow-lg"
            >
              <p className="mb-4 text-lg text-gray-600">Analyzing your performance...</p>
              <Loader2 
                className="animate-spin mx-auto" 
                size={48} 
                style={{ color: PRIMARY_COLOR }}
              />
            </motion.div>
          )}

          {showResults && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-8 rounded-lg shadow-lg"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Assessment Complete!</h2>
                <div className="text-6xl font-bold mb-4">
                  <span style={{ color: PRIMARY_COLOR }}>{getScore()}</span>
                  <span className="text-gray-400">/5</span>
                </div>
                
                <div className="space-y-4">
                  <Alert variant={getScore() >= 4 ? "default" : "destructive"}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Recommendation</AlertTitle>
                    <AlertDescription>
                      {getScore() >= 4 
                        ? "Great work! Additional tutoring may not be necessary at this time."
                        : "Consider scheduling a consultation to discuss targeted improvement areas."}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={resetQuiz}
                  className="text-white px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: PRIMARY_COLOR }}
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;

```javascript
window.Quiz = Quiz;
```
