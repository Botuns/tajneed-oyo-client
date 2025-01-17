"use client";
// import React from "react";

// function Dashboard() {
//   return <div className="w-full text-red-500">Dashboard</div>;
// }

// export default Dashboard;

import { useState, useEffect } from "react";
import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

const BiometricAuth = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if WebAuthn is supported
    if (
      window.PublicKeyCredential &&
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
    ) {
      PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => {
          setIsAvailable(available);
        })
        .catch((error) => {
          setError("Error checking biometric availability");
          console.error(error);
        });
    }
  }, []);

  const startBiometricCapture = async () => {
    try {
      setIsCapturing(true);
      setError("");
      setSuccess(false);

      // Create challenge
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Create PublicKey credential parameters
      const publicKeyCredentialCreationOptions = {
        challenge: challenge,
        rp: {
          name: "Your App Name",
          id: window.location.hostname,
        },
        user: {
          id: Uint8Array.from("USER_ID", (c) => c.charCodeAt(0)),
          name: "user@example.com",
          displayName: "User Name",
        },
        pubKeyCredParams: [
          {
            type: "public-key",
            alg: -7, // ES256
          },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          requireResidentKey: false,
        },
        timeout: 60000,
        attestation: "direct",
      };

      // Start the biometric authentication
      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      });

      if (credential) {
        setSuccess(true);
        // Here you would typically send the credential to your server
        console.log("Biometric credential created:", credential);
      }
    } catch (error) {
      console.error("Biometric error:", error);
      setError(getBiometricErrorMessage(error));
    } finally {
      setIsCapturing(false);
    }
  };

  const getBiometricErrorMessage = (error) => {
    switch (error.name) {
      case "NotAllowedError":
        return "Biometric permission denied. Please allow biometric access.";
      case "SecurityError":
        return "Security error occurred. Make sure you're using HTTPS.";
      case "NotSupportedError":
        return "Biometric authentication not supported on this device.";
      default:
        return "An error occurred during biometric capture. Please try again.";
    }
  };

  if (!isAvailable) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Biometric authentication is not available on this device or browser.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Biometric Authentication</h2>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white">
          <Fingerprint className="w-16 h-16 text-blue-600" />

          <Button
            onClick={startBiometricCapture}
            disabled={isCapturing}
            className="w-full max-w-xs"
          >
            {isCapturing ? "Scanning..." : "Authenticate with Biometrics"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription>
                Biometric authentication successful!
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default BiometricAuth;
