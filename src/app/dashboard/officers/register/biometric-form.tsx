import React, { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fingerprint, AlertCircle } from "lucide-react";

export function BiometricForm() {
  const { setValue } = useFormContext();
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Check if biometric authentication is supported
  useEffect(() => {
    const checkSupport = async () => {
      try {
        // Check if the browser supports WebAuthn
        if (window.PublicKeyCredential) {
          // Check if platform authenticator is available
          const available =
            await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsSupported(available);
        } else {
          setIsSupported(false);
        }
      } catch (err) {
        setIsSupported(false);
        console.error("Error checking biometric support:", err);
      }
    };

    checkSupport();
  }, []);

  const enrollFingerprint = async () => {
    try {
      setStatus("enrolling");
      setError("");

      // Generate a random challenge
      const challenge = new Uint8Array(32);
      crypto.getRandomValues(challenge);

      // Create credential options
      const createCredentialOptions = {
        publicKey: {
          challenge,
          rp: {
            name: "Your App Name",
            // id should match your domain
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16), // Generate unique user ID
            name: "user@example.com", // This should come from your form
            displayName: "User Name", // This should come from your form
          },
          pubKeyCredParams: [
            {
              type: "public-key",
              alg: -7, // ES256
            },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            requireResidentKey: false,
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "direct",
        },
      };

      // Create the credential
      const credential = await navigator.credentials.create(
        // @ts-expect-error - WebAuthn CredentialCreationOptions type mismatch with publicKey
        createCredentialOptions
      );

      if (credential) {
        // Convert the credential to a format suitable for storage
        const pkCredential = credential as PublicKeyCredential;
        const credentialId = btoa(
          String.fromCharCode(...new Uint8Array(pkCredential.rawId))
        );

        alert("Credential ID: " + credentialId);

        // Store the credential ID
        setValue("fingerprint", credentialId);
        setStatus("success");
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      setError(getErrorMessage(err as Error));
      setStatus("error");
    }
  };

  const getErrorMessage = (error: Error) => {
    alert(error.name);
    if (error.name === "NotAllowedError") {
      return "Biometric enrollment was denied. Please try again and accept the prompt.";
    } else if (error.name === "NotSupportedError") {
      return "Your device does not support biometric enrollment.";
    }
    return "Failed to enroll biometric. Please try again.";
  };

  if (!isSupported) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Biometric Authentication</h2>
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Biometric authentication is not supported on this device. Please use
            a device with fingerprint or Face ID capability.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Biometric Authentication</h2>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <Label>
          Use your device&apos;s biometric sensor (fingerprint or Face ID) to
          authenticate
        </Label>

        <div className="border rounded-lg p-6 flex flex-col items-center space-y-4">
          <Fingerprint
            size={64}
            className={
              status === "enrolling"
                ? "animate-pulse text-primary"
                : "text-gray-400"
            }
          />

          <Button
            onClick={enrollFingerprint}
            type="button"
            disabled={status === "enrolling"}
            className="w-full"
          >
            {status === "enrolling" ? "Verifying..." : "Enroll Biometric"}
          </Button>
        </div>
      </div>

      {status === "success" && (
        <Alert>
          <Fingerprint className="h-4 w-4" />
          <AlertDescription>
            Biometric authentication successfully enrolled!
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
