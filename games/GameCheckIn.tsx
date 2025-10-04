import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';
import { toast } from 'react-hot-toast';
import QrCodeIcon from '../../icons/QrCodeIcon';
import { useAppContext } from '../../../context/AppContext';

interface GameCheckInProps {
    barId: string;
}

const GameCheckIn: React.FC<GameCheckInProps> = ({ barId }) => {
    const { checkInUser } = useAppContext();
    const videoRef = useRef<HTMLVideoElement>(null);
    const scannerRef = useRef<QrScanner | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    useEffect(() => {
        if (videoRef.current && !scannerRef.current) {
            const qrScanner = new QrScanner(
                videoRef.current,
                (result: QrScanner.ScanResult) => {
                    scannerRef.current?.stop();
                    const data = result.data.trim();
                    let locationName: string | null = null;
                    let scannedBarId: string | null = null;
                    
                    try {
                        // Try parsing as a URL first
                        const url = new URL(data);
                        scannedBarId = url.searchParams.get('barId');
                        locationName = url.searchParams.get('location');
                        if (locationName) {
                            locationName = decodeURIComponent(locationName);
                        }
                    } catch (e) {
                        // Scanned data is not a URL, so it's invalid for check-in
                         console.error("Scanned data is not a valid check-in URL:", data);
                    }

                    if (locationName && scannedBarId === barId) {
                        checkInUser(locationName); // This will handle toast and state update
                    } else {
                        toast.error("QR Code de check-in inválido para este bar. Tente novamente.");
                        setTimeout(() => {
                            if (scannerRef.current) {
                                scannerRef.current.start().catch(err => {
                                    console.error("Failed to restart scanner", err);
                                    setFeedback('Não foi possível reiniciar a câmera.');
                                });
                            }
                        }, 2000);
                    }
                },
                { highlightScanRegion: true, highlightCodeOutline: true }
            );
            scannerRef.current = qrScanner;

            qrScanner.start().catch(err => {
                console.error("Failed to start QR scanner:", err);
                setFeedback('Câmera não encontrada ou permissão negada.');
            });

            return () => {
                if (scannerRef.current) {
                    scannerRef.current.destroy();
                    scannerRef.current = null;
                }
            };
        }
    }, [barId, checkInUser]);

    return (
        <div className="text-center">
            <QrCodeIcon className="w-16 h-16 text-brand-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Confirme sua presença</h2>
            <p className="text-dark-text-secondary mb-6">
                Para acessar os jogos, escaneie o QR Code em sua mesa ou comanda para provar que você está no bar.
            </p>
            <div className="w-full max-w-xs mx-auto aspect-square bg-gray-900 rounded-lg overflow-hidden relative shadow-inner mb-4">
                <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    playsInline
                ></video>
                <div className="absolute inset-0 border-8 border-white/20 rounded-lg pointer-events-none"></div>
            </div>
            {feedback && <p className="text-red-400 mt-2">{feedback}</p>}
        </div>
    );
};

export default GameCheckIn;