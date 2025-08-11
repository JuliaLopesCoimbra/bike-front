"use client";
import { useState, useEffect, useCallback } from "react";
import FormSignUpUser from "../../../../components/forms/FormSignUpUser";
import PageRest from "../../../../components/rest/PageRest"; // ajuste o caminho se necessário
import { motion } from "framer-motion";

export default function SignUpPage() {
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

    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
          
                <FormSignUpUser />
            
        </motion.div>
    );
}
