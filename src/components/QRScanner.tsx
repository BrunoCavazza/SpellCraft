import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface QRScannerProps {
  onCardScanned: (cardId: string) => void;
  isScanning: boolean;
}

const QRScanner: React.FC<QRScannerProps> = ({ onCardScanned, isScanning }) => {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startScanner = useCallback(() => {
    try {
      setError(null);
      setScanning(true);

      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false
      );

      scannerRef.current.render(
        (decodedText) => {
          // Validar que el QR contiene un ID válido (solo números)
          if (/^\d+$/.test(decodedText)) {
            onCardScanned(decodedText);
            // Pausar brevemente para evitar múltiples escaneos
            setTimeout(() => {
              if (scannerRef.current) {
                scannerRef.current.clear();
                startScanner();
              }
            }, 1000);
          } else {
            setError("QR inválido. Debe contener solo números.");
          }
        },
        (errorMessage) => {
          // Ignorar errores de escaneo continuo
          console.log("Error de escaneo:", errorMessage);
        }
      );
    } catch (err) {
      setError("Error al iniciar la cámara. Verifica los permisos.");
      setScanning(false);
    }
  }, [onCardScanned]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
    setError(null);
  };

  useEffect(() => {
    if (isScanning && !scanning) {
      startScanner();
    } else if (!isScanning && scanning) {
      stopScanner();
    }
  }, [isScanning, scanning, startScanner]);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="qr-scanner-container">
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      <div id="qr-reader" className="qr-reader"></div>
      {!isScanning && (
        <div className="scanner-placeholder">
          <p>Presiona "Escanear Cartas" para comenzar</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner; 