'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { URL_BASE } from "../../../../services/api";
import * as htmlToImage from 'html-to-image';
import QRCode from "react-qr-code";
export default function SessionCardBike() {
    const router = useRouter();
    const [photoFile, setPhotoFile] = useState(null);
    const [userSessionId, setUserSessionId] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const cardRef = useRef(null);
    const [isReady, setIsReady] = useState(false); // <- controla exibição do botão
    const [showCard, setShowCard] = useState(true);
    const [isLoadingQRCode, setIsLoadingQRCode] = useState(true);
    const [titles, setTitles] = useState(null);
    const handleImageLoad = () => {
        console.log("✅ Imagem carregada dentro do Card");

        setTimeout(() => {
            exportAndSendCard();
            setShowCard(false); // 🔁 Oculta o card só DEPOIS da captura
        }, 500); // tempo seguro para layout estabilizar
    };
    const fadeIn = (delay = 0) => ({
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, delay },
    });
    const exportAndSendCard = async () => {
        if (!cardRef.current || !userSessionId) return;
        setIsLoadingQRCode(true); // ⏳ Inicia loading
        const dataUrl = await htmlToImage.toPng(cardRef.current);
        if (!dataUrl.startsWith("data:image/")) {
            console.error("Data URL inválido:", dataUrl);
            return;
        }
        function dataURLtoBlob(dataurl) {
            const arr = dataurl.split(',');

            if (arr.length !== 2 || !arr[0].startsWith("data:image/")) {
                throw new Error("Formato inválido de data URL");
            }

            const mimeMatch = arr[0].match(/:(.*?);/);
            if (!mimeMatch) {
                throw new Error("Mime type inválido na data URL");
            }

            const mime = mimeMatch[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], { type: mime });
        }

        const blob = dataURLtoBlob(dataUrl);
        const file = new File([blob], "card.png", { type: "image/png" });

        const formData = new FormData();
        formData.append("card_file", file);
        formData.append("user_session_id", userSessionId);

        const response = await fetch(`${URL_BASE}/card?user_session_id=${userSessionId}`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            const result = await response.json();
            setImageUrl(result.url); // ← salva a URL
            setIsLoadingQRCode(false);
            console.log("✅ Card final disponível:", result.url);
        } else {
            const error = await response.json();
            alert("Erro ao gerar card: " + JSON.stringify(error.detail));
            setIsLoadingQRCode(false);
        }
    };
    const handleClick = () => {
        router.push("/");
    };
    function dataURLtoBlob(dataurl) {
        const arr = dataurl.split(',');

        if (arr.length !== 2 || !arr[0].startsWith("data:image/")) {
            throw new Error("Formato inválido de data URL");
        }

        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) {
            throw new Error("Mime type inválido na data URL");
        }

        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
    }
    useEffect(() => {
        const savedData = localStorage.getItem("user_card_data");
        // console.log("Dados salvos:", savedData);
        if (!savedData) {
            alert("Foto não encontrada.");
            router.push("/");
            return;
        }
        if (savedData) {
            const parsed = JSON.parse(savedData);
            const { filename, user_session_id, titles: savedTitles } = parsed;

            if (!filename || !user_session_id) {
                alert("Dados incompletos.");
                router.push("/");
                return;
            }
            setPhotoFile(filename);
            setUserSessionId(user_session_id);
            setTitles(savedTitles); // 👈 salvando os titles

        }
        // Ativa o botão após 10 segundos
        const timeout = setTimeout(() => setIsReady(true), 10000);
        return () => clearTimeout(timeout);
    }, []);
   
    return (
        <motion.div {...fadeIn(0)}
            style={{
                backgroundImage: "url('/img/fundo_card.png')",
                backgroundSize: 'cover',
                // border: "solid red 10px"
            }}
            className="flex flex-col items-center justify-center  min-h-screen "
        >
            {/* qrcode */}
            <div style={{
                width: "25.2vh",
                height: "25.5vh",
                marginTop: "15vh",
                // border: "solid red 1px"
            }}>
                {isLoadingQRCode ? (
                    <div className="w-[500px] h-[500px] flex items-center justify-center">
                        <div className="w-30 h-30 border-4 border-green-900 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    imageUrl && (   
                        <QRCode
                            value={imageUrl}
                            size={500}
                            style={{ backgroundColor: 'white', padding: '8px', borderRadius: '8px' }}
                        />
                    )
                )}
                <iframe
                    id="card-frame"
                    src="/pages/user/cardPreview"
                    style={{
                        width: "1080px",
                        height: "1920px",
                        border: "none",
                        position: "absolute",
                        top: "-9999px",
                        left: "-9999px",
                    }}
                    onLoad={() => {
                        // Aguarda carregar e processa a imagem depois de 1s
                        setTimeout(async () => {
                            const iframe = document.getElementById("card-frame");
                            if (!iframe?.contentWindow?.document?.body) return;

                            const dataUrl = await htmlToImage.toPng(iframe.contentWindow.document.body);
                            const blob = dataURLtoBlob(dataUrl);
                            const file = new File([blob], "card.png", { type: "image/png" });

                            const formData = new FormData();
                            formData.append("card_file", file);
                            formData.append("user_session_id", userSessionId);

                            const response = await fetch(`${URL_BASE}/card?user_session_id=${userSessionId}`, {
                                method: "POST",
                                body: formData
                            });

                            if (response.ok) {
                                const result = await response.json();
                                setImageUrl(result.url);
                                setIsLoadingQRCode(false);
                                console.log("✅ Card gerado via iframe:", result.url);
                            } else {
                                const error = await response.json();
                                alert("Erro ao gerar card: " + JSON.stringify(error.detail));
                                setIsLoadingQRCode(false);
                            }
                        }, 1000); // Aguarda o conteúdo do iframe carregar
                    }}
                />
                <motion.div {...fadeIn(0.3)}>
                    {isReady && (
                        <button
                            onClick={handleClick}
                            className={` ${'w-full bg-[#37611e] hover:bg-green-800 cursor-pointer'
                                } text-[2.9vh] text-white font-medium px-46 rounded-full border-4
                                     border-white  transition-all flex items-center justify-center mt-82`}
                        >
                            PRÓXIMO
                        </button>
                    )}

                </motion.div>
            </div>
        </motion.div>
    );
}
