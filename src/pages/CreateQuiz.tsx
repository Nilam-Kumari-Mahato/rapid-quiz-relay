import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { useMutation } from "convex/react"; 
import { api } from "../../convex/_generated/api"; 

type Question = {
  question_text: string;
  question_image_url: string;
  options: string[];
  correct_answer: string; 
  time_limit: number;
  order_number: number;
};

const CreateQuiz = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question_text: "",
      question_image_url: "",
      options: ["", ""], 
      correct_answer: "A",
      time_limit: 30,
      order_number: 0
    }
  ]);

  const createQuizMutation = useMutation(api.quizzes.createQuiz);

  const TIME_OPTIONS: { label: string; value: number }[] = [
    { label: "5 secs", value: 5 },
    { label: "10 secs", value: 10 },
    { label: "15 secs", value: 15 },
    { label: "20 secs", value: 20 },
    { label: "25 secs", value: 25 },
    { label: "30 secs", value: 30 },
    { label: "45 secs", value: 45 },
    { label: "50 secs", value: 50 },
    { label: "1 min", value: 60 },
    { label: "1 min 30 secs", value: 90 },
    { label: "2 min", value: 120 },
    { label: "3 min", value: 180 },
    { label: "5 min", value: 300 },
    { label: "7 min", value: 420 },
    { label: "10 min", value: 600 },
  ];

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: "",
        question_image_url: "",
        options: ["", ""],
        correct_answer: "A",
        time_limit: 30,
        order_number: questions.length,
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof Question, value: string | number) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], [field]: value };
    setQuestions(updated);
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    opts[optIndex] = value;
    updated[qIndex] = { ...updated[qIndex], options: opts };
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    
    // FIX: Limit to 4 options (A, B, C, D) to match backend schema and prevent errors
    if (opts.length >= 4) {
      toast({ title: "Maximum Options", description: "You can add up to 4 options.", variant: "destructive" });
      return;
    }

    opts.push("");
    updated[qIndex] = { ...updated[qIndex], options: opts };
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, optIndex: number) => {
    const updated = [...questions];
    const opts = [...updated[qIndex].options];
    if (opts.length <= 2) return; // enforce minimum 2 options
    opts.splice(optIndex, 1);
    // if the removed option was before the correct answer, shift correct_answer
    const letters = opts.map((_, i) => String.fromCharCode(65 + i));
    let correct = updated[qIndex].correct_answer;
    if (!letters.includes(correct)) correct = letters[0] || "A";
    updated[qIndex] = { ...updated[qIndex], options: opts, correct_answer: correct };
    setQuestions(updated);
  };

  const createQuiz = async () => {
    if (!title.trim()) {
      toast({ title: "Error", description: "Please enter a quiz title", variant: "destructive" });
      return;
    }

    // Validate required fields and at least two options per question
    for (const q of questions) {
      if (!q.question_text.trim()) {
        toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
        return;
      }
      if (!q.options[0]?.trim() || !q.options[1]?.trim()) {
        toast({ title: "Error", description: "Each question needs at least two options", variant: "destructive" });
        return;
      }
      // ensure correct_answer is within available options
      const letters = q.options.map((_, i) => String.fromCharCode(65 + i));
      if (!letters.includes(q.correct_answer)) {
        toast({ title: "Error", description: "Correct answer must match an available option", variant: "destructive" });
        return;
      }
    }

    setLoading(true);
    try {
      const mappedQuestions = questions.map((q) => {
        const mapped: any = {
          question_text: q.question_text,
          question_image_url: q.question_image_url || undefined,
          correct_answer: q.correct_answer,
          time_limit: q.time_limit,
          order_number: q.order_number,
        };

        q.options.forEach((opt, i) => {
          const letter = String.fromCharCode(97 + i); // 'a', 'b', 'c', ...
          mapped[`option_${letter}`] = opt;
        });

        return mapped;
      });

      const quizId = await createQuizMutation({
        title,
        description,
        questions: mappedQuestions,
      });

      toast({ title: "Success!", description: "Quiz created successfully" });
      navigate("/dashboard");

    } catch (error: any) {
      toast({ title: "Error", description: `Failed to create quiz: ${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/40 via-white/60 to-white/80 dark:bg-gradient-to-b dark:from-black/80 dark:via-black/80 dark:to-black/80 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>

        <Card className="p-8 shadow-lg rounded-2xl border-2 border-transparent hover:border-primary transition-all duration-300">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Create Your Quiz
          </h1>

          <div className="space-y-6 mb-8">
            <div>
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an exciting title"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this quiz about?"
                className="mt-2"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Questions</h2>
            </div>

            {questions.map((question, index) => (
              <Card key={index} className="p-6 border-2">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">Question {index + 1}</h3>
                  {questions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Question Text *</Label>
                    <Textarea
                      value={question.question_text}
                      onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                      placeholder="Enter your question"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Image URL (optional)</Label>
                    <div className="flex gap-2 mt-2">
                      <ImageIcon className="text-muted-foreground mt-2" />
                      <Input
                        value={question.question_image_url}
                        onChange={(e) => updateQuestion(index, 'question_image_url', e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((opt, optIndex) => {
                      const letter = String.fromCharCode(65 + optIndex); // A, B, C...
                      return (
                        <div key={optIndex} className="flex items-start gap-3">
                          <div className="w-full">
                            <Label>{`Option ${letter}${optIndex < 2 ? ' *' : ''}`}</Label>
                            <Input
                              value={opt}
                              onChange={(e) => updateOption(index, optIndex, e.target.value)}
                              placeholder={`Option ${letter}`}
                              className="mt-2"
                            />
                          </div>
                          <div className="flex-1">
                            {/* spacer for layout - option text already inline */}
                          </div>
                          <div className="mt-6">
                            {question.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(index, optIndex)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div className="pt-2">
                      <Button 
                        onClick={() => addOption(index)} 
                        size="sm" 
                        className="rounded-full"
                        disabled={question.options.length >= 4} // Disable adding more than 4 options
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Option
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <Label>Correct Answer *</Label>
                      <select
                        value={question.correct_answer}
                        onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                        className="w-full mt-2 p-2 border rounded-md pr-3"
                      >
                        {question.options.map((_, i) => {
                          const letter = String.fromCharCode(65 + i);
                          return (
                            <option key={i} value={letter}>{letter}</option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex-1">
                      <Label>Time Limit *</Label>
                      <select
                        value={question.time_limit}
                        onChange={(e) => updateQuestion(index, 'time_limit', parseInt(e.target.value))}
                        className="w-full mt-2 p-2 border rounded-md pr-3"
                      >
                        {TIME_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="flex justify-end mt-5">
            <Button onClick={addQuestion} className="rounded-full bg-gradient-to-r from-primary to-secondary p-3 mr-5">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          <div className="w-23 mt-8 flex gap-4">
            <Button
              onClick={createQuiz}
              disabled={loading}
              size="lg"
              className=" flex-1 bg-gradient-to-t from-primary via-secondary to-primary-glow hover:opacity-90"
            >
              {loading ? "Creating..." : "Create Quiz"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateQuiz;
