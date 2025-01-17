import { useState, useRef, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function BiometricForm() {
  const { setValue } = useFormContext();
  const [capturedFingerprint, setCapturedFingerprint] = useState<string | null>(
    null
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#f0f0f0";
        ctx.fillRect(0, 0, 300, 400);
      }
    }
  }, []);

  const captureFingerprint = () => {
    // Simulating fingerprint capture
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Clear previous drawing
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw simulated fingerprint
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          ctx.moveTo(x, y);
          ctx.arc(x, y, Math.random() * 2, 0, Math.PI * 2);
        }
        ctx.strokeStyle = "#333";
        ctx.stroke();

        // Convert canvas to base64 image
        const fingerprintData = canvas.toDataURL("image/png");
        setCapturedFingerprint(fingerprintData);
        setValue("fingerprint", fingerprintData);
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Capture Fingerprint</h2>
      <div className="space-y-2">
        <Label>Fingerprint</Label>
        <div className="border rounded-lg p-4 flex flex-col items-center">
          <canvas
            ref={canvasRef}
            width={300}
            height={400}
            className="border mb-4"
          />
          <Button onClick={captureFingerprint} type="button">
            Capture Fingerprint
          </Button>
        </div>
      </div>
      {capturedFingerprint && (
        <div className="mt-4">
          <p className="text-green-600 font-semibold">
            Fingerprint captured successfully!
          </p>
        </div>
      )}
    </div>
  );
}
