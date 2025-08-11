"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { URL_BASE } from "../../services/api";

export default function FormSignUpUser() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        handleSubmit,
        register,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm();

    const Start = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${URL_BASE}/register_quiz`, {
                method: "POST",
            });

            const result = await response.json();

            if (response.ok) {
                const { quiz_session_id } = result;

                localStorage.setItem("quiz_session_id", quiz_session_id);
                toast.success("Sessão iniciada com sucesso!");
                reset();

                router.push("/pages/user/session");
            } else {
                toast.error("Erro ao iniciar sessão: " + result.detail);
            }

        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na conexão com o servidor");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatCPF = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    };
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, "");

        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        let soma = 0;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        let resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf.charAt(10));
    }

    const formatCelular = (value) => {
        return value
            .replace(/\D/g, "")
            .replace(/(\d{2})(\d)/, "($1) $2")
            .replace(/(\d{5})(\d)/, "$1-$2")
            .replace(/(-\d{4})\d+?$/, "$1");
    };
    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });
    return (
        <>
            <motion.div
                {...fadeIn(0)}
                onClick={(e) => {
                    if (e.target === e.currentTarget && !isSubmitting) {
                        Start();
                    }
                }}
                style={{ backgroundImage: "url('/img/fundo_descanso.png')", backgroundSize: 'cover' }}
                className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
            >
                {/* Conteúdo interno aqui */}
                <motion.div {...fadeIn(0.3)}>
                    {/* outros elementos */}
                </motion.div>
            </motion.div>

        </>
    );
}