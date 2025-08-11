'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { URL_BASE } from "../../../../services/api";
import { ok } from "assert";

export default function SessionPhotoBike() {
    const router = useRouter();
    const videoRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null); // base64 para mostrar no lugar do vídeo
    const [userSessionId, setUserSessionId] = useState(null);
    const [countdown, setCountdown] = useState(null); // 3, 2, 1
    const [isLoading, setIsLoading] = useState(false); // Loading após tirar foto
    const [isCameraReady, setIsCameraReady] = useState(false); // Estado para verificar se a câmera está pronta
    useEffect(() => {
        const sessionId = localStorage.getItem("user_session_id");
        if (!sessionId) {
            router.push("/");
            return;
        }
        setUserSessionId(Number(sessionId));

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Erro ao acessar câmera:", err);
                alert("Erro ao acessar câmera.");
            });
    }, [router]);

    const capturePhoto = () => {
        const canvas = document.createElement("canvas");
        const video = videoRef.current;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);

        canvas.toBlob(blob => {
            const file = new File([blob], "photo.jpg", { type: "image/jpeg" });
            setPhoto(file);

            // 🟩 Salvar a foto como base64 no localStorage
            const reader = new FileReader();
            reader.onloadend = () => {
                localStorage.setItem("user_photo_base64", reader.result); // salva o base64 para a tela seguinte
            };
            reader.readAsDataURL(file);

            uploadPhoto(file);
        }, "image/jpeg");
    };
    const uploadPhoto = async (file) => {
        if (!file || !userSessionId) return;

        setIsLoading(true);
        const formData = new FormData();
        formData.append("photo_file", file);

        try {
            const response = await fetch(`${URL_BASE}/photo?user_session_id=${userSessionId}`, {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                // Salva no localStorage para uso na próxima página
                localStorage.setItem("user_card_data", JSON.stringify({
                    filename: result.filename,  // ex: photos/19_photo.png
                    user_session_id: userSessionId,
                    titles: result.titles       // opcional, se quiser reutilizar na próxima tela
                }));

                router.push("/pages/user/card"); // ou /card, dependendo da sua rota
            } else {
                const error = await response.json();
                alert("Erro ao enviar foto: " + JSON.stringify(error.detail));
            }
        } catch (err) {
            console.error("Erro ao enviar foto:", err);
            alert("Erro de conexão.");
        } finally {
            setIsLoading(false);
        }
    };
    const startCountdown = () => {
        let count = 3;
        setCountdown(count);
        const interval = setInterval(() => {
            count--;
            if (count === 0) {
                clearInterval(interval);
                setCountdown(null);
                capturePhoto();
            } else {
                setCountdown(count);
            }
        }, 1000);
    };
    function breakAfterSecondWord(text) {
        const words = text.trim().split(' ');
        if (words.length <= 2) return text;
        const firstLine = words.slice(0, 2).join(' ');
        const secondLine = words.slice(2).join(' ');
        return `${firstLine}\n${secondLine}`;
    }
    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });
    return (
        <motion.div {...fadeIn(0)}
            style={{
                backgroundImage: "url('/img/fundo_foto.png')",
                backgroundSize: 'cover',
            }}
            className="flex flex-col items-center justify-center min-h-screen p-4"
        >
            <div style={{ width: "85%", height: "100%" }}>
                <span className="uppercase block text-white tracking-tight leading-none gap-1 text-[4.8vh] mb-2" style={{ paddingTop: '2vh' }}>
                    {breakAfterSecondWord("SORRIA E TIRE SUA FOTO")
                        .split('\n')
                        .map((line, index) => (
                            <span key={index}>{line}<br /></span>
                        ))}
                </span>

                <div className="flex flex-col items-center justify-center h-full text-white">
                    {/* {!isCameraReady ? ( */}
                        {/* // <div style={{ width: "100%", height: '120%' }} > */}
                            {/* Carregando câmera... */}
                        {/* </div> */}
                    {/* // ) : ( */}
                        <video ref={videoRef} autoPlay playsInline muted className="rounded" style={{ width: "100%", height: '120%' }} />
                    {/* // )} */}

                    {countdown !== null && (
                        <div
                            style={{
                                width: "140px",
                                height: "140px",

                            }} className="mt-10 px-6 py-2 rounded mb-2 
                        text-6xl font-bold  animate-pulse">{countdown}</div>
                    )}

                    {isLoading && (
                        <div
                            style={{
                                width: "250px",
                                height: "140px",
                                // border: "solid 1px yellow",
                            }}
                            className="mt-10 px-6 py-2 rounded mb-2
                         text-2xl font-medium 
                          animate-pulse flex flex-col
                           items-center justify-center">Enviando foto...</div>
                    )}

                    {!countdown && !isLoading && (
                        <button onClick={startCountdown}
                            className="mt-10 px-6 py-2 rounded mb-2"
                            style={{
                                width: "140px",
                                height: "140px",
                                backgroundImage: "url('/icon/camera_icon.png')",
                                backgroundSize: 'cover'
                            }}>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
