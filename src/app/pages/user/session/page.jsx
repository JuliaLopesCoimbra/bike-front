'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from "framer-motion";
import { URL_BASE } from '../../../../services/api';
import PageRest from "../../../../components/rest/PageRest"; // ajuste o caminho se necessário

export default function SessionTypeBike() {
    const router = useRouter();
    const [quizSessionId, setQuizSessionId] = useState(null);

    useEffect(() => {
        const id = localStorage.getItem("quiz_session_id");
        if (!id) {
            router.push("/"); // Redireciona se não tiver ID válido
        } else {
            setQuizSessionId(Number(id));
        }
    }, [router]);

    const handleSelectBikeType = async (typeId) => {
        try {
            const response = await fetch(`${URL_BASE}/bike_type`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quiz_session_id: quizSessionId,
                    user_bike_tipe: typeId
                })
            });
            const result = await response.json(); // ✅ precisa dessa linha antes de usar result
            if (response.ok) {
                // Salva tudo no localStorage
                localStorage.setItem("user_session_id", result.user_session_id);
                localStorage.setItem("questions", JSON.stringify(result.questions));
                router.push("/pages/user/questions"); // Redireciona para SessionQuestionsBike
            } else {
                const error = await response.json();
                alert("Erro ao enviar tipo de bike: " + error.detail);
            }
        } catch (err) {
            console.error("Erro ao enviar tipo de bike:", err);
            alert("Erro de conexão");
        }
    };

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });
    function breakAfterSecondWord(text) {
        const words = text.trim().split(' ');
        if (words.length <= 2) return text;
        const firstLine = words.slice(0, 3).join(' ');
        const secondLine = words.slice(3).join(' ');
        return `${firstLine}\n${secondLine}`;
    }
    const [inactive, setInactive] = useState(false);
        const [lastActivity, setLastActivity] = useState(Date.now());
    
        const TIMEOUT = 30 * 1000; // 30 segundos
    
        // Função que reseta o timer de inatividade
        const resetTimer = useCallback(() => {
            setLastActivity(Date.now());
            if (inactive) setInactive(false);
        }, [inactive]);
    
        // Monitora inatividade com base no tempo
        useEffect(() => {
            const interval = setInterval(() => {
                if (Date.now() - lastActivity > TIMEOUT) {
                    setInactive(true);
                }
            }, 1000);
    
            return () => clearInterval(interval);
        }, [lastActivity]);
    
        // Detecta qualquer atividade do usuário
        useEffect(() => {
            const events = ["mousemove", "keydown", "click", "touchstart"];
            events.forEach((event) => window.addEventListener(event, resetTimer));
    
            return () => {
                events.forEach((event) => window.removeEventListener(event, resetTimer));
            };
        }, [resetTimer]);
    

    return (
        <>
            {inactive ? (
                <PageRest onWakeUp={resetTimer} />
            ) : (
                <motion.div {...fadeIn(0)}
                    style={{
                        backgroundImage: "url('/img/fundo_perguntas.png')",
                        backgroundSize: 'cover',
                        //  border: "solid 10px red"
                    }}
                    className="flex flex-col items-center min-h-screen bg-gray-100"
                >
                    <div className=' mt-[19vh] ' style={{
                        // border: "solid 1px white",
                        width: "58%",
                    }} >
                        <span
                            className="uppercase  tracking-tight leading-none text-[4.8vh] mb-[3vh] block"
                            // style={{ border: "solid 1px blue"}}
                        >
                            {breakAfterSecondWord("QUAL O SEU TIPO DE BIKE?")
                                .split('\n')
                                .map((line, index) => (
                                    <span key={index}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                        </span>

                        <div className="flex flex-col "
                        // style={{ border: "solid 1px red"}}
                        >
                            <button style={{
                                backgroundImage: "url('/button/road.png')", 
                                // border: "solid 1px red"
                            }} onClick={() => handleSelectBikeType(1)}
                                className="w-full h-[10.5vh] rounded bg-center bg-cover">

                            </button>
                            <button style={{
                                backgroundImage: "url('/button/lazer.png')"
                            }} onClick={() => handleSelectBikeType(3)}
                                className="w-full h-[10.5vh] rounded bg-center bg-cover">

                            </button>
                            <button style={{
                                backgroundImage: "url('/button/mountain.png')",

                            }} onClick={() => handleSelectBikeType(2)}
                                className="w-full h-[10.5vh] rounded bg-center bg-cover">

                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
}
