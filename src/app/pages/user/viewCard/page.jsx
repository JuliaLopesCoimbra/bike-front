'use client';
import { useEffect, useState } from "react";

export default function Card({ onImageLoad }) {
    const [photoUrl, setPhotoUrl] = useState(null);
    const [titles, setTitles] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("user_card_data");
        if (saved) {
            const parsed = JSON.parse(saved);
            const filename = parsed.filename;
            const titlesData = parsed.titles;

            setPhotoUrl(`https://bicicleta-bucket.s3.sa-east-1.amazonaws.com/${filename}`);
            setTitles(titlesData);
        }
    }, []);

    useEffect(() => {
        if (imageLoaded && onImageLoad) {
            onImageLoad();
        }
    }, [imageLoaded]);

    return (
        <div
            style={{
                backgroundImage: "url('/img/fundo_foto.png')",
                backgroundSize: 'cover',
                // border: "solid 1px blue"
            }} className="items-center flex flex-col justify-center min-h-screen"
        >
            <div style={{
                width: "75%", height: "100%", paddingTop: "15vh",
                // paddingBottom:""
                // border: "solid 1px red"
            }}>
                <h1 style={{ fontSize: '3vh', fontWeight: 'bold' }}>PERFIL DO CICLISTA</h1>
                <div className="flex flex-col items-center justify-center h-full text-white">
                    {photoUrl && (
                        <img
                            src={photoUrl}
                            alt="Foto do ciclista"
                            onLoad={() => setImageLoaded(true)}
                            style={{
                                width: "100%", height: '120%', background: "white",
                                padding: "1.5vh", paddingBottom: "3vh"
                            }}
                        />
                    )}
                </div>
                <div className="flex flex-col items-center justify-center "
                    style={{
                        // border: "solid 1px blue",
                        width: "90%", // ou 600px, ou o que fizer sentido
                        margin: "0 auto",
                        transform: "translateY(-6vh)"
                    }}
                >
                    <div style={{
                        // border: "solid 1px yellow"
                    }}
                        className="w-full h-full items-center flex flex-col justify-center">
                        <div style={{
                            backgroundImage: "url('/card/apelido.png')",
                            backgroundSize: 'cover',
                            // border: "solid 1px white",
                            transform: "translateY(10px)"
                        }} className="w-[30vh] h-[4vh]"></div>
                        {titles && (
                            <div
                                className={` ${'w-full bg-[#122415] '
                                    } h-[7vh]  text-[min(3.5vh,5vw)] text-white font-medium px-1 rounded-full border-4
                                     border-white  transition-all flex items-center justify-center `}>{titles.user_pedal_nickname_title}</div>
                        )}
                    </div>
                    <div style={{
                        // border: "solid 1px yellow"
                    }}
                        className="w-full h-full items-center flex flex-col justify-center">
                        <div style={{
                            backgroundImage: "url('/card/playlist.png')",
                            backgroundSize: 'cover',
                            // border: "solid 1px white",
                            transform: "translateY(10px)"
                        }} className="w-[30vh] h-[4vh]"></div>
                        {titles && (
                            <div
                                className={` ${'w-full bg-[#122415] '
                                    } h-[7vh]
 text-[min(1.9vh,3vw)] text-white font-medium px-4 rounded-full border-4 
                                     border-white  transition-all flex items-center justify-center `}>{titles.user_music_title}</div>
                        )}
                    </div>
                    <div style={{
                        // border: "solid 1px yellow"
                    }}
                        className="w-full h-full items-center flex flex-col justify-center">
                        <div style={{
                            backgroundImage: "url('/card/grupo.png')",
                            backgroundSize: 'cover',
                            // border: "solid 1px white",
                            transform: "translateY(10px)"
                        }} className="w-[30vh] h-[4vh]"></div>
                        {titles && (
                            <div
                                className={` ${'w-full bg-[#122415] '
                                    } h-[7vh]  text-[min(3.5vh,5vw)] text-white font-medium px-2 rounded-full border-4
                                     border-white  transition-all flex items-center justify-center `}>{titles.user_pedal_group_title}
                            </div>

                        )}
                    </div>
                    <div style={{
                        // border: "solid 1px yellow"
                    }}
                        className="w-full h-full items-center flex flex-col justify-center">
                        <div style={{
                            backgroundImage: "url('/card/idade.png')",
                            backgroundSize: 'cover',
                            // border: "solid 1px white",
                            transform: "translateY(10px)"
                        }} className="w-[30vh] h-[4vh]"></div>
                        {titles && (
                            <div
                                className={` ${'w-full bg-[#122415] '
                                    } h-[7vh] text-[min(3.5vh,5vw)] text-white font-medium px-2 rounded-full border-4
                                     border-white  transition-all flex items-center justify-center `}>{titles.user_age_title}</div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
