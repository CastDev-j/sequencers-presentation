import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const QUESTIONS = [
  {
    id: 1,
    question:
      "Un secuenciador se construye con dos componentes principales. ¿Cuales son?",
    hint: "Observa el diagrama interactivo en la seccion anterior",
    options: [
      { label: "A", text: "Contador y Decodificador" },
      { label: "B", text: "Sumador y Restador" },
      { label: "C", text: "Memoria RAM y ROM" },
    ],
    correct: 0,
  },
  {
    id: 2,
    question: "¿Cuantas fases tiene el ciclo de instruccion de una CPU?",
    hint: "Cuenta las fases en el ejemplo del Ciclo de CPU",
    options: [
      { label: "A", text: "2 fases" },
      { label: "B", text: "4 fases (Fetch, Decode, Execute, Store)" },
      { label: "C", text: "6 fases" },
    ],
    correct: 1,
  },
  {
    id: 3,
    question:
      "En el ejemplo del semaforo, ¿cual es la secuencia correcta de colores?",
    hint: "Observa el semaforo interactivo",
    options: [
      { label: "A", text: "Rojo, Verde, Ambar" },
      { label: "B", text: "Verde, Ambar, Rojo" },
      { label: "C", text: "Ambar, Rojo, Verde" },
    ],
    correct: 1,
  },
  {
    id: 4,
    question: "¿Que hace que el contador avance al siguiente paso?",
    hint: "Mira el indicador pulsante en el diagrama del secuenciador",
    options: [
      { label: "A", text: "La temperatura del procesador" },
      { label: "B", text: "La senal del reloj (pulso)" },
      { label: "C", text: "La entrada del teclado" },
    ],
    correct: 1,
  },
  {
    id: 5,
    question: "¿Cual es la funcion del decodificador en un secuenciador?",
    hint: "Observa que hace el decodificador con cada numero del contador",
    options: [
      { label: "A", text: "Sumar numeros binarios" },
      { label: "B", text: "Activar una salida diferente segun el paso actual" },
      { label: "C", text: "Almacenar datos permanentemente" },
    ],
    correct: 1,
  },
];

export function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(QUESTIONS.length).fill(null),
  );
  const [showResults, setShowResults] = useState(false);
  const [submitted, setSubmitted] = useState<boolean[]>(
    new Array(QUESTIONS.length).fill(false),
  );

  const handleSelectAnswer = (answerIndex: number) => {
    if (submitted[currentQuestion]) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmitAnswer = () => {
    const newSubmitted = [...submitted];
    newSubmitted[currentQuestion] = true;
    setSubmitted(newSubmitted);
  };

  const handleNext = () => {
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(QUESTIONS.length).fill(null));
    setSubmitted(new Array(QUESTIONS.length).fill(false));
    setShowResults(false);
  };

  const correctCount = selectedAnswers.reduce(
    (acc: number, answer: number | null, index: number) => {
      if (answer === QUESTIONS[index].correct) return acc + 1;
      return acc;
    },
    0,
  );

  const question = QUESTIONS[currentQuestion];
  const isAnswered = selectedAnswers[currentQuestion] !== null;
  const isSubmitted = submitted[currentQuestion];
  const isCorrect = selectedAnswers[currentQuestion] === question.correct;

  if (showResults) {
    const percentage = (correctCount / QUESTIONS.length) * 100;

    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <p className="text-6xl font-bold text-neutral-900 mb-2">
            {correctCount}/{QUESTIONS.length}
          </p>
          <p className="text-neutral-500">Respuestas correctas</p>
        </div>

        <div className="w-full bg-neutral-100 rounded-full h-2 mb-8">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="space-y-3 mb-8">
          {QUESTIONS.map((q, index) => {
            const wasCorrect = selectedAnswers[index] === q.correct;
            const selectedOption = selectedAnswers[index];
            const correctOption = q.correct;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-lg border ${
                  wasCorrect
                    ? "bg-emerald-50 border-emerald-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-start gap-3 mb-2">
                  {wasCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900">
                      Pregunta {index + 1}
                    </p>
                    <p className="text-xs text-neutral-600 mt-1">
                      {q.question}
                    </p>
                  </div>
                </div>
                <div className="ml-8 space-y-1 text-xs">
                  <div
                    className={wasCorrect ? "text-emerald-700" : "text-red-700"}
                  >
                    <span className="font-medium">Tu respuesta:</span>
                    {selectedOption !== null
                      ? " " + q.options[selectedOption].text
                      : " No respondida"}
                  </div>
                  {!wasCorrect && (
                    <div className="text-emerald-700">
                      <span className="font-medium">Respuesta correcta:</span>
                      {" " + q.options[correctOption].text}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm text-neutral-500">
          {currentQuestion + 1} / {QUESTIONS.length}
        </span>
        <div className="flex gap-1">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentQuestion
                  ? "bg-neutral-800"
                  : submitted[i]
                    ? selectedAnswers[i] === QUESTIONS[i].correct
                      ? "bg-emerald-500"
                      : "bg-red-500"
                    : "bg-neutral-200"
              }`}
            />
          ))}
        </div>
      </div>

      <h3 className="text-xl font-semibold text-neutral-900 mb-2 text-balance">
        {question.question}
      </h3>

      <p className="text-sm text-neutral-500 mb-6">{question.hint}</p>

      <div className="space-y-2 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswers[currentQuestion] === index;
          const isCorrectAnswer = index === question.correct;

          let stateClass =
            "border-neutral-200 hover:border-neutral-300 bg-white";
          let labelClass = "bg-neutral-100 text-neutral-500";

          if (isSubmitted) {
            if (isCorrectAnswer) {
              stateClass = "border-emerald-300 bg-emerald-50";
              labelClass = "bg-emerald-500 text-white";
            } else if (isSelected) {
              stateClass = "border-red-300 bg-red-50";
              labelClass = "bg-red-500 text-white";
            }
          } else if (isSelected) {
            stateClass = "border-neutral-800 bg-neutral-50";
            labelClass = "bg-neutral-800 text-white";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              disabled={isSubmitted}
              className={`w-full flex items-center gap-3 p-4 rounded-lg border text-left transition-all ${stateClass} ${
                isSubmitted ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold leading-none text-center shrink-0 ${labelClass}`}
              >
                {option.label}
              </span>
              <span className="text-sm text-neutral-800 flex-1">
                {option.text}
              </span>
              {isSubmitted && isCorrectAnswer && (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              )}
              {isSubmitted && isSelected && !isCorrectAnswer && (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {isSubmitted && (
        <div
          className={`p-4 rounded-lg mb-6 text-sm ${
            isCorrect
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {isCorrect
            ? "Correcto"
            : `La respuesta correcta es: ${question.options[question.correct].label}) ${question.options[question.correct].text}`}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="flex-1" />

        {!isSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!isAnswered}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-neutral-800 text-white hover:bg-neutral-700 transition-colors disabled:opacity-40 disabled:hover:bg-neutral-500"
          >
            Verificar
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg bg-neutral-800 text-white hover:bg-neutral-600 transition-colors"
          >
            {currentQuestion === QUESTIONS.length - 1
              ? "Ver resultados"
              : "Siguiente"}
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
