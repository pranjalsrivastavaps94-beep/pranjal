import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Dumbbell, Flame, TimerReset, Search, CheckCircle2, Home, User, CalendarDays } from "lucide-react";

type Exercise = {
  id: number;
  name: string;
  duration: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  target: string;
  instructions: string[];
};

type WorkoutPlan = {
  id: number;
  title: string;
  subtitle: string;
  days: number;
  calories: string;
  target: string;
  exercises: Exercise[];
};

const allExercises: Exercise[] = [
  {
    id: 1,
    name: "Jumping Jacks",
    duration: 30,
    level: "Beginner",
    target: "Full Body",
    instructions: [
      "Stand upright with feet together and hands by your sides.",
      "Jump feet apart while raising arms overhead.",
      "Jump back to the starting position and repeat."
    ]
  },
  {
    id: 2,
    name: "Push-Ups",
    duration: 30,
    level: "Intermediate",
    target: "Chest",
    instructions: [
      "Place hands slightly wider than shoulder-width apart.",
      "Lower your chest toward the floor with a straight back.",
      "Push back up and repeat."
    ]
  },
  {
    id: 3,
    name: "Squats",
    duration: 40,
    level: "Beginner",
    target: "Legs",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Lower hips back and down like sitting in a chair.",
      "Drive through heels to stand up."
    ]
  },
  {
    id: 4,
    name: "Plank",
    duration: 45,
    level: "Intermediate",
    target: "Core",
    instructions: [
      "Keep elbows under shoulders.",
      "Make a straight line from shoulders to heels.",
      "Tighten core and hold steadily."
    ]
  },
  {
    id: 5,
    name: "High Knees",
    duration: 30,
    level: "Beginner",
    target: "Cardio",
    instructions: [
      "Run in place.",
      "Lift knees high toward your chest.",
      "Keep a quick, controlled rhythm."
    ]
  },
  {
    id: 6,
    name: "Lunges",
    duration: 40,
    level: "Intermediate",
    target: "Legs",
    instructions: [
      "Step one foot forward.",
      "Lower until both knees bend around 90 degrees.",
      "Push back and switch sides."
    ]
  }
];

const workoutPlans: WorkoutPlan[] = [
  {
    id: 1,
    title: "Full Body Starter",
    subtitle: "Best for daily no-equipment training",
    days: 28,
    calories: "120–220 kcal",
    target: "Full Body",
    exercises: [allExercises[0], allExercises[2], allExercises[1], allExercises[3]]
  },
  {
    id: 2,
    title: "Abs & Core Burn",
    subtitle: "Short sessions for stronger core",
    days: 21,
    calories: "90–160 kcal",
    target: "Core",
    exercises: [allExercises[0], allExercises[3], allExercises[4], allExercises[2]]
  },
  {
    id: 3,
    title: "Leg Strength",
    subtitle: "Bodyweight lower-body program",
    days: 30,
    calories: "140–240 kcal",
    target: "Legs",
    exercises: [allExercises[2], allExercises[5], allExercises[4], allExercises[3]]
  }
];

function CircularTimer({ seconds }: { seconds: number }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);

  React.useEffect(() => {
    if (!running || timeLeft <= 0) return;
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [running, timeLeft]);

  const progress = (timeLeft / seconds) * 100;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-36 w-36 rounded-full border-8 border-muted flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 rounded-full" style={{ background: `conic-gradient(currentColor ${progress * 3.6}deg, transparent 0deg)` }} />
        <div className="absolute inset-3 rounded-full bg-background" />
        <div className="relative text-center">
          <div className="text-4xl font-bold">{timeLeft}</div>
          <div className="text-xs text-muted-foreground">seconds</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => setRunning((v) => !v)}>{running ? "Pause" : "Start"}</Button>
        <Button variant="outline" onClick={() => { setTimeLeft(seconds); setRunning(false); }}>
          Reset
        </Button>
      </div>
    </div>
  );
}

export default function HomeWorkoutClone() {
  const [tab, setTab] = useState("home");
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan>(workoutPlans[0]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [search, setSearch] = useState("");
  const [completed, setCompleted] = useState<number[]>([]);

  const filteredPlans = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return workoutPlans;
    return workoutPlans.filter(
      (plan) =>
        plan.title.toLowerCase().includes(q) ||
        plan.target.toLowerCase().includes(q) ||
        plan.subtitle.toLowerCase().includes(q)
    );
  }, [search]);

  const todayProgress = Math.round((completed.length / selectedPlan.exercises.length) * 100);

  const toggleComplete = (id: number) => {
    setCompleted((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Home Workout</h1>
            <p className="text-muted-foreground">No-equipment workout app starter made in React</p>
          </div>
          <Badge className="rounded-full px-4 py-2 text-sm">Demo App</Badge>
        </motion.div>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-2xl h-14">
            <TabsTrigger value="home" className="gap-2"><Home className="h-4 w-4" />Home</TabsTrigger>
            <TabsTrigger value="plans" className="gap-2"><Dumbbell className="h-4 w-4" />Plans</TabsTrigger>
            <TabsTrigger value="workout" className="gap-2"><Play className="h-4 w-4" />Workout</TabsTrigger>
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="rounded-3xl md:col-span-2 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flame className="h-5 w-5" /> Today’s Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-3xl bg-white p-5 border">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedPlan.title}</h2>
                        <p className="text-muted-foreground">{selectedPlan.subtitle}</p>
                      </div>
                      <Button onClick={() => setTab("workout")}>Start Now</Button>
                    </div>
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="rounded-2xl border p-3">
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-semibold">{selectedPlan.days} days</div>
                      </div>
                      <div className="rounded-2xl border p-3">
                        <div className="text-xs text-muted-foreground">Calories</div>
                        <div className="font-semibold">{selectedPlan.calories}</div>
                      </div>
                      <div className="rounded-2xl border p-3">
                        <div className="text-xs text-muted-foreground">Target</div>
                        <div className="font-semibold">{selectedPlan.target}</div>
                      </div>
                      <div className="rounded-2xl border p-3">
                        <div className="text-xs text-muted-foreground">Exercises</div>
                        <div className="font-semibold">{selectedPlan.exercises.length}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5" /> Daily Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>Completed</span>
                      <span>{todayProgress}%</span>
                    </div>
                    <Progress value={todayProgress} className="h-3 rounded-full" />
                  </div>
                  <div className="rounded-2xl border p-4">
                    <div className="text-sm text-muted-foreground">Current streak</div>
                    <div className="text-3xl font-bold">7 days</div>
                  </div>
                  <div className="rounded-2xl border p-4">
                    <div className="text-sm text-muted-foreground">Workout time today</div>
                    <div className="text-3xl font-bold">18 min</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>Popular Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  {workoutPlans.map((plan) => (
                    <motion.div key={plan.id} whileHover={{ y: -3 }}>
                      <Card className="rounded-3xl cursor-pointer border-2 hover:border-primary transition" onClick={() => { setSelectedPlan(plan); setCompleted([]); }}>
                        <CardContent className="p-5 space-y-3">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{plan.target}</Badge>
                            <span className="text-sm text-muted-foreground">{plan.days} days</span>
                          </div>
                          <h3 className="text-xl font-semibold">{plan.title}</h3>
                          <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                          <Button className="w-full rounded-2xl" variant={selectedPlan.id === plan.id ? "default" : "outline"}>
                            {selectedPlan.id === plan.id ? "Selected" : "Choose Plan"}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="mt-6 space-y-6">
            <Card className="rounded-3xl shadow-sm">
              <CardContent className="p-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search full body, abs, legs..."
                    className="pl-10 rounded-2xl h-12"
                  />
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredPlans.map((plan) => (
                <Card key={plan.id} className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle>{plan.title}</CardTitle>
                      <Badge>{plan.target}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">{plan.subtitle}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{plan.days} days</Badge>
                      <Badge variant="secondary">{plan.calories}</Badge>
                      <Badge variant="secondary">{plan.exercises.length} moves</Badge>
                    </div>
                    <Button className="w-full rounded-2xl" onClick={() => { setSelectedPlan(plan); setTab("workout"); setCompleted([]); }}>
                      Open Program
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workout" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <Card className="rounded-3xl shadow-sm">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle>{selectedPlan.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{selectedPlan.subtitle}</p>
                    </div>
                    <Badge>{selectedPlan.target}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px] pr-3">
                    <div className="space-y-4">
                      {selectedPlan.exercises.map((exercise, index) => {
                        const done = completed.includes(exercise.id);
                        return (
                          <motion.div key={exercise.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="rounded-3xl border">
                              <CardContent className="p-5">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <Badge variant="outline">#{index + 1}</Badge>
                                      <Badge variant="secondary">{exercise.target}</Badge>
                                      <Badge variant="secondary">{exercise.level}</Badge>
                                    </div>
                                    <h3 className="text-xl font-semibold">{exercise.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                      <TimerReset className="h-4 w-4" /> {exercise.duration} sec
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button variant="outline" className="rounded-2xl" onClick={() => setSelectedExercise(exercise)}>
                                      Details
                                    </Button>
                                    <Button
                                      className="rounded-2xl"
                                      variant={done ? "secondary" : "default"}
                                      onClick={() => toggleComplete(exercise.id)}
                                    >
                                      {done ? "Completed" : "Mark Done"}
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Exercise Timer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CircularTimer seconds={selectedExercise?.duration || 30} />
                  </CardContent>
                </Card>

                <Card className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Exercise Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedExercise ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-xl font-semibold">{selectedExercise.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedExercise.target} • {selectedExercise.level}</p>
                        </div>
                        <div className="rounded-2xl border p-4 space-y-3">
                          {selectedExercise.instructions.map((step, i) => (
                            <div key={i} className="flex gap-3">
                              <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0" />
                              <p className="text-sm">{step}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground">Select an exercise to see instructions.</div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="mt-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="rounded-3xl shadow-sm md:col-span-1">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto h-24 w-24 rounded-full bg-white border shadow-sm flex items-center justify-center text-3xl font-bold">
                    P
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Pranjal</h3>
                    <p className="text-sm text-muted-foreground">Beginner • Home Fitness</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="rounded-2xl border p-3"><div className="font-bold">16</div><div className="text-xs text-muted-foreground">Workouts</div></div>
                    <div className="rounded-2xl border p-3"><div className="font-bold">7</div><div className="text-xs text-muted-foreground">Streak</div></div>
                    <div className="rounded-2xl border p-3"><div className="font-bold">320</div><div className="text-xs text-muted-foreground">Min</div></div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-3xl shadow-sm md:col-span-2">
                <CardHeader>
                  <CardTitle>Weekly Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>4 workouts this week</span>
                      <span>3 / 4</span>
                    </div>
                    <Progress value={75} className="h-3 rounded-full" />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border p-4">
                      <div className="text-sm text-muted-foreground">Fitness level</div>
                      <div className="text-lg font-semibold">Beginner</div>
                    </div>
                    <div className="rounded-2xl border p-4">
                      <div className="text-sm text-muted-foreground">Goal</div>
                      <div className="text-lg font-semibold">Stronger body at home</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
