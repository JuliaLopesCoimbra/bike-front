"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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

    const onSubmit = async (data) => {
        setIsSubmitting(true); // ⏳ começa o loading

        try {
            // const response = await fetch("http://127.0.0.1:8000/register", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(data),
            // });

            // const result = await response.json();

            // if (response.ok) {
            //     toast.success("Cadastro realizado com sucesso!");
            //     reset();

            
            // } else {
            //     toast.error("Erro ao cadastrar: " + result.detail);
            // }
            //salva o token no localStorage
            // localStorage.setItem('token', response.data.token);


            router.push("pages/user/session"); // Redireciona para a página de login após o cadastro
            toast.success("Cadastro realizado com sucesso! Redirecionando para o login...");
            reset(); // Limpa o formulário após o envio bem-sucedido
        } catch (error) {
            console.error("Erro na requisição:", error);
            toast.error("Erro na conexão com o servidor");
        } finally {
            setIsSubmitting(false); // ✅ encerra o loading
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
            <motion.div {...fadeIn(0)}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md mx-auto text-white">
                    <div>
                        <label>Nome Completo</label>
                        <input
                            {...register("nome", { required: "Campo obrigatório" })}
                            className="border p-2 w-full rounded-md text-black"
                            placeholder="Digite seu nome"
                            autoComplete="off"
                            value="Julia Lopes"
                        />
                        {errors.nome && <p className="text-red-500 text-sm">{errors.nome.message}</p>}
                    </div>

                    {/* <div>
                <label>Sobrenome</label>
                <input
                    {...register("sobrenome", { required: "Campo obrigatório" })}
                    className="border p-2 w-full"
                    placeholder="Digite seu sobrenome"
                    autoComplete="off"
                />
                {errors.sobrenome && <p className="text-red-500 text-sm">{errors.sobrenome.message}</p>}
            </div> */}

                    <div>
                        <label>Email</label>
                        <input
                            {...register("email", { required: "Campo obrigatório" })}
                            className="border p-2 w-full rounded-md text-black"
                            placeholder="exemplo@email.com"
                            autoComplete="off"
                            type="email"
                            value={"julia@gmail.com"}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label>CPF</label>
                        <input
                            {...register("cpf", {
                                required: "Campo obrigatório",
                                validate: (value) =>
                                    validarCPF(value) || "CPF inválido",
                            })}
                            className="border p-2 w-full rounded-md text-black"
                            placeholder="000.000.000-00"
                            onChange={(e) => setValue("cpf", formatCPF(e.target.value))}
                            value={watch("cpf") || "42117733808"}
                            autoComplete="off"
                        />
                        {errors.cpf && <p className="text-red-500 text-sm">{errors.cpf.message}</p>}

                    </div>

                    <div>
                        <label>Celular</label>
                        <input
                            {...register("celular", { required: "Campo obrigatório" })}
                            className="border p-2 w-full rounded-md text-black"
                            placeholder="(11) 9 8765-4321"
                            onChange={(e) => setValue("celular", formatCelular(e.target.value))}
                            value={watch("celular") || "16992848085"}
                            autoComplete="off"
                        />
                        {errors.celular && <p className="text-red-500 text-sm">{errors.celular.message}</p>}
                    </div>
                    {/* ✅ Checkbox 1: Termos de uso */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            {...register("aceita_termos", { required: "Você precisa aceitar os termos de uso de dados." })}
                        />
                        <label className="text-sm">
                            Eu aceito os <a href="#" className="underline">termos de uso de dados</a>.
                        </label>
                    </div>
                    {errors.aceita_termos && <p className="text-red-500 text-sm">{errors.aceita_termos.message}</p>}


                  


                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`p-2 rounded w-full transition-colors ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                            } text-white`}
                    >
                        {isSubmitting ? "Enviando..." : "Enviar"}
                    </button>

                </form>
                {/* tratar se ja for cadastrado chamar o login */}
            </motion.div>
        </>
    );
}