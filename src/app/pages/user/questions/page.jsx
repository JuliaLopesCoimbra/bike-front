'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { URL_BASE } from "../../../../services/api";

export default function SessionQuestionsBike() {
    const router = useRouter();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [userSessionId, setUserSessionId] = useState(null);

    useEffect(() => {
        const storedSession = localStorage.getItem("user_session_id");
        const storedQuestions = localStorage.getItem("questions");

        if (!storedSession || !storedQuestions) {
            router.push("/");
            return;
        }

        setUserSessionId(Number(storedSession));
        setQuestions(JSON.parse(storedQuestions));
    }, [router]);
    function breakInTwoLines(text) {
        const words = text.trim().split(' ');

        if (words.length === 2) {
            // Se forem exatamente 2 palavras, quebra entre elas
            return `${words[0]}\n${words[1]}`;
        }

        // Caso contrário, faz uma quebra equilibrada
        const middle = Math.ceil(words.length / 2);
        const firstLine = words.slice(0, middle).join(' ');
        const secondLine = words.slice(middle).join(' ');
        return `${firstLine}\n${secondLine}`;
    }


    const handleAnswer = async (answerId, questionId) => {
        const currentAnswers = questions[currentIndex]?.answers || [];

        // Encontra o índice da resposta selecionada dentro da lista (0-based, então +1)
        const answerIndex = currentAnswers.findIndex(a => a.answer_id === answerId);
        const answerValue = answerIndex + 1; // sempre de 1 a 4

        const newAnswer = {
            question_id: questionId,
            answer_id: answerId,
            answer_value: answerValue,
        };

        try {
            const response = await fetch(`${URL_BASE}/answer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_session_id: userSessionId,
                    question_id: questionId,
                    answer_id: answerId,
                    answer_value: answerValue, // novo campo enviado
                })
            });

            if (!response.ok) {
                const error = await response.json();
                console.error("Erro ao salvar resposta:", error);
                alert("Erro ao salvar resposta. Tente novamente.");
                return;
            }

            const updatedAnswers = [...answers, newAnswer];
            setAnswers(updatedAnswers);

            if (currentIndex + 1 < questions.length) {
                setCurrentIndex(currentIndex + 1);
            } else {
                router.push("/pages/user/photo");
            }

        } catch (err) {
            console.error("Erro de conexão ao salvar resposta:", err);
            alert("Erro de conexão. Tente novamente.");
        }
    };
    function breakAfterSecondWord(text) {
        const words = text.trim().split(' ');

        if (words.length <= 2) {
            return text; // Se tiver só 1 ou 2 palavras, retorna normal
        }

        const firstLine = words.slice(0, 2).join(' ');
        const secondLine = words.slice(2).join(' ');
        return `${firstLine}\n${secondLine}`;
    }
    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });

    const currentQuestion = questions[currentIndex];

    return (
        <motion.div {...fadeIn(0)}
            style={{
                backgroundImage: "url('/img/fundo_perguntas.png')", backgroundSize: 'cover',
                // border: "solid 1px red" 
            }}
            className="flex flex-col  min-h-screen bg-gray-700 p-10"
        >
            {currentQuestion && (
                <div className="text-white mt-[20vh] px-5"
                // style={{ border: "solid 1px red" }}
                >
                    <h2 className="flex text-white tracking-tight leading-none
                      gap-1 text-[4.5vh] mb-20"
                        // style={{ border: "solid 1px white" }}
                    >
                        <span className="w-40 h-40 rounded-full
                         bg-[#20a637] flex items-center justify-center
                          text-white text-[5vh]
                         leading-none tracking-tight px-4">
                            {(currentIndex + 1).toString().padStart(2, '0') + '.'}
                        </span>
                        <span
                            className="uppercase block leading-tight"
                            style={{
                                paddingTop: '2vh',
                            }}
                        >
                            {breakAfterSecondWord(currentQuestion.question_value)
                                .split('\n')
                                .map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                        </span>
                    </h2>
                    <div className="flex flex-col gap-4 ">
                        {currentQuestion.answers.map((a, index) => {
                            const letter = String.fromCharCode(97 + index);
                            return (
                                <button
                                    key={a.answer_id}
                                    onClick={() => handleAnswer(a.answer_id, currentQuestion.question_id)}
                                    className="bg-[#37611e] text-[2.9vh] hover:bg-green-800
                                     text-white font-medium py-1 px-6 rounded-full border-4
                                      border-white text-left transition-all flex items-center gap-3"


                                >
                                    <span className="w-20 h-20 text-[3vh] rounded-full border-4 border-white text-white 
                                    flex items-center justify-center font-bold uppercase">
                                        {letter}.
                                    </span>
                                    {a.value}
                                </button>
                            );
                        })}
                    </div>


                </div>
            )}
        </motion.div>
    );
}

// arrumar botao confirmar resposta
//arrumar tem perguntas e respostas que quebram o layout