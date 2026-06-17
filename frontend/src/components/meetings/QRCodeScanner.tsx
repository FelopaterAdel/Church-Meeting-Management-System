import { useEffect, useRef, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { Html5Qrcode, type CameraDevice } from 'html5-qrcode';

type QRCodeScannerProps = {
  open: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClose: () => void;
  onScan: (qrCode: string) => Promise<void>;
};

const getScannerErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return 'Unable to start the camera.';
};

export const QRCodeScanner = ({ open, disabled = false, loading = false, onClose, onScan }: QRCodeScannerProps) => {
  const scannerId = "qr-scanner";
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isProcessingRef = useRef(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [cameraIndex, setCameraIndex] = useState(0);
  const [startupError, setStartupError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    if (!open || disabled) return undefined;

    let isMounted = true;
    
    isProcessingRef.current = false;

   const startScanner = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      if (!isMounted) return;

      setStartupError(null);
      setIsStarting(true);

      try {
        const availableCameras = await Html5Qrcode.getCameras();
        if (!isMounted) return;

        setCameras(availableCameras);
        const selectedCamera = availableCameras[cameraIndex] ?? availableCameras[0];

        if (!selectedCamera) {
          setStartupError('No camera was found on this device.');
          return;
        }
const scanner = new Html5Qrcode("qr-scanner", false);
    scannerRef.current = scanner;
        await scanner.start(
          selectedCamera.id,
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            if (isProcessingRef.current || !decodedText.trim()) return;

            isProcessingRef.current = true;
            void onScan(decodedText.trim()).finally(() => {
              window.setTimeout(() => {
                isProcessingRef.current = false;
              }, 1200);
            });
          },
          () => undefined
        );
      } catch (error) {
        if (isMounted) {
          setStartupError(getScannerErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsStarting(false);
        }
      }
    };

    void startScanner();

    return () => {
      isMounted = false;
      const activeScanner = scannerRef.current;
      scannerRef.current = null;
      if (!activeScanner) {
        return;
      }

      if (activeScanner.isScanning) {
        void activeScanner.stop().then(() => activeScanner.clear()).catch(() => undefined);
      } else {
        void activeScanner.clear();
      }
    };
  }, [cameraIndex, disabled, onScan, open, scannerId]);

  const handleSwitchCamera = () => {
    if (cameras.length < 2) return;
    setCameraIndex((currentIndex) => (currentIndex + 1) % cameras.length);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" alignItems="center" spacing={1}>
          <QrCodeScannerIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            Scan Student QR Code
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {disabled && <Alert severity="warning">This meeting is closed and cannot accept attendance.</Alert>}
          {startupError && <Alert severity="error">{startupError}</Alert>}
          {loading && <Alert severity="info">Recording attendance...</Alert>}

          <Box
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              bgcolor: 'grey.900',
              minHeight: 320,
              '& video': {
                width: '100% !important',
                height: 'auto !important',
              },
            }}
          >
            {isStarting && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', zIndex: 1 }}>
                <CircularProgress />
              </Box>
            )}
            <Box id={scannerId} sx={{ width: '100%', minHeight: 320 }} />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button startIcon={<CameraswitchIcon />} onClick={handleSwitchCamera} disabled={cameras.length < 2 || loading}>
          Switch
        </Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
