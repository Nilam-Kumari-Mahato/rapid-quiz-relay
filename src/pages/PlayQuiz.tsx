// src/pages/PlayQuiz.tsx
import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Clock, Trophy, Loader2, ArrowLeft } from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api"; 
import { Id } from "../../convex/_generated/dataModel"; 

const PlayQuiz = () => {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get('participant');
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const sessionData = useQuery(
    api.sessions.getPlayerSessionData,
    sessionId && participantId 
      ? { 
          sessionId: sessionId as Id<"quiz_sessions">, 
          participantId: participantId as Id<"participants"> 
        } 
      : "skip"
  );
  
  const submitAnswerMutation = useMutation(api.gameplay.submitAnswer);

  const session = sessionData?.session;
  const quiz = sessionData?.quiz;
  const participant = sessionData?.participant;
  const allParticipants = sessionData?.allParticipants;
  const currentQuestion = sessionData?.currentQuestion;
  const answerStats = sessionData?.answerStats;
  
  const hasAnswered = (sessionData as any)?.hasAnswered ?? false;
  const submittedAnswer = (sessionData as any)?.submittedAnswer ?? null;
  
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    setSelectedAnswer(null);
  }, [currentQuestion?._id]);
  useEffect(() => {
    
    if (hasAnswered && submittedAnswer) {
      setSelectedAnswer(submittedAnswer);
    }
  }, [hasAnswered, submittedAnswer]);
  
  useEffect(() => {
    if (!session) {
      return;
    }

    if (session.status === 'active' && !session.show_leaderboard && session.currentQuestionEndTime && !hasAnswered) {
      const updateTimer = () => {
        const now = Date.now();
        const remainingMs = session.currentQuestionEndTime! - now;
        const remainingSeconds = Math.max(0, Math.floor(remainingMs / 1000));
        
        setTimeLeft(remainingSeconds);

        if (remainingSeconds === 0 && !hasAnswered) {
          toast({ title: "Time's up!", description: "Waiting for next question."});
        }
      };

      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
      
    } else if (hasAnswered) {
      // --- PLAYER HAS ANSWERED ---
      setTimeLeft(0);
    } else if (session.status === 'waiting' && currentQuestion) {
      // --- TIMER IS WAITING (show full time) ---
      setTimeLeft(currentQuestion.time_limit);
    }
    
  }, [
    session?.status, 
    session?.show_leaderboard, 
    session?.currentQuestionEndTime,
    hasAnswered,
    currentQuestion?.time_limit, // <-- THIS IS THE FIX
  ]);
  // --- END FIX ---


  const handleOptionSelect = (option: string) => {
    if (hasAnswered || timeLeft === 0) return;
    setSelectedAnswer(option);
  };

  const submitAnswer = async () => {
    if (hasAnswered || !selectedAnswer || !currentQuestion || !sessionId || !participantId) return;

    const time_taken = session.currentQuestionStartTime 
      ? (Date.now() - session.currentQuestionStartTime) / 1000 
      : currentQuestion.time_limit; 

    try {
      await submitAnswerMutation({
        participantId: participantId as Id<"participants">, 
        questionId: currentQuestion._id, 
        sessionId: sessionId as Id<"quiz_sessions">,
        answer: selectedAnswer,
        time_taken: time_taken 
      });
      
      toast({ title: "Answer submitted!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };
  
  // Handle loading state
  if (sessionData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Handle not found or invalid participant
  if (sessionData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Session Not Found</h1>
        <p className="text-muted-foreground mb-4">
          This quiz session may have ended, or the link is invalid.
        </p>
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/40 via-white/60 to-white/80 dark:bg-gradient-to-b dark:from-black/80 dark:via-black/80 dark:to-black/80 pt-4 pb-4">
      <div className="container max-w-md sm:max-w-2xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mt-12">
        <Card className="p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
            <h1 className="text-3xl font-bold mb-2 text-white/80">{quiz?.title}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Your Score</p>
              <p className="text-xl font-bold text-primary">{participant?.score || 0}</p>
            </div>
          </div>
        </Card>

        {session.status === 'waiting' && (
          <Card className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Get Ready!</h2>
            <p className="text-xl text-muted-foreground">
              Waiting for the host to start the quiz...
            </p>
          </Card>
        )}

        {session.status === 'active' && !session.show_leaderboard && currentQuestion && (
          <Card className="p-6 bg-card border-border rounded-3xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-base font-semibold text-muted-foreground">Question</h3>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="text-xl font-bold">{timeLeft}s</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xl font-bold mb-4">{currentQuestion.question_text}</p>
              {currentQuestion.question_image_url && (
                <img 
                  src={currentQuestion.question_image_url} 
                  alt="Question" 
                  className="w-full max-h-48 object-contain rounded-2xl"
                />
              )}
            </div>

            <div className="space-y-2 mb-5">
              {['A', 'B', 'C', 'D'].map(option => {
                const optionText = currentQuestion[`option_${option.toLowerCase()}`];
                if (!optionText) return null;
                
                const isSelected = selectedAnswer === option;
                // Stats are only shown when the user has answered and leaderboard is on
                const showStats = hasAnswered && session.show_leaderboard;
                const percentage = 0; // getPercentage(option)
                // Determine if this option is the correct one to highlight when host reveals
                const isCorrect = !!currentQuestion?.correct_answer && session?.reveal_answer && currentQuestion.correct_answer === option;
                
                return (
                  <div
                    key={option}
                    onClick={() => handleOptionSelect(option)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      (hasAnswered || timeLeft === 0)
                        ? 'cursor-default' 
                        : 'cursor-pointer hover:border-primary/50'
                    } ${
                      isSelected && !(hasAnswered || timeLeft === 0)
                        ? 'border-primary bg-primary/10' 
                        : 'border-border bg-card/50'
                    } ${
                      hasAnswered && isSelected
                        ? 'border-primary bg-primary/20'
                        : ''
                    } 
                    ${isCorrect ? 'ring-4 ring-success/50 bg-success/10 border-success scale-105' : ''}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {option}
                      </div>
                      <span className="text-base font-medium flex-1">{optionText}</span>
                      {showStats && (
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">{answerStats?.[option] || 0} votes</div>
                          <div className="text-base font-bold text-primary">{percentage}%</div>
                        </div>
                      )}
                    </div>
                    {showStats && (
                      <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!hasAnswered ? (
              <div className="flex justify-center">
                <Button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer || timeLeft === 0}
                  size="lg"
                  className="w-56 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <p className="text-center text-base font-semibold text-primary">
                <Loader2 className="inline-block mr-2 h-4 w-4 animate-spin" />
                Answer submitted! Waiting for the host...
              </p>
            )}
          </Card>
        )}

        {session.status === 'active' && session.show_leaderboard && (
          <Card className="p-8 text-center">
            <Trophy className="h-16 w-16 mx-auto mb-4 text-warning" />
            <h2 className="text-3xl font-bold mb-8">Current Standings</h2>
            <div className="mb-8">
              <h4 className="text-xl text-white/90 font-semibold">Your Position - {}</h4>
              <p className="text-sm text-white/70">Correct answers: {}</p>
              <p className="text-sm text-white/70">Voting time: {}</p>
              </div>
            <div className="space-y-3">
              {allParticipants?.map((p, i) => (
                <div 
                  key={p._id}
                  className={`flex justify-between items-center p-4 rounded-lg ${
                    p._id === participantId ? 'bg-primary/20 border-2 border-primary' :
                    i === 0 ? 'bg-warning/20 border-2 border-warning' :
                    'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">{i + 1}</span>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                  <span className="text-xl font-bold text-primary">{p.score}</span>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground mt-8">Waiting for host to start the next question...</p>
          </Card>
        )}

        {session.status === 'finished' && (
          <Card className="px-5 pb-8 text-center">
            <DotLottieReact src="../../public/Trophy.lottie" autoplay
            className="h-32 w-32 sm:h-32 sm:w-32 md:h-32 md:w-32 lg:h-40 lg:w-40  mx-auto" />
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl  font-bold mb-2">Final Leaderboard!</h2>
            <div className="my-5">
              <h4 className="text-xl font-semibold text-white/90">You finished {}!</h4>
              <p className="text-sm text-white/70">Correct answers: {}</p>
              <p className="text-sm text-white/70">Voting time: {}</p>
              </div>
            <div className="space-y-3">
              {allParticipants?.map((p, i) => (
                <div 
                  key={p._id}
                  className={`flex justify-between items-center p-2 rounded-lg ${
                    p._id === participantId ? 'bg-primary/20 border-2 border-primary' :
                    i === 0 ? 'bg-warning/20 border-2 border-warning' :
                    'bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">{i + 1}</span>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                  <span className="text-xl font-bold text-primary">{p.score}</span>
                </div>
              ))}
            </div>
            <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="my-3 mt-6 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PlayQuiz;
