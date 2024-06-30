import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Flex } from "@chakra-ui/react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const AddToHomeScreenPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState<boolean | undefined>(
    undefined
  );

  useEffect(() => {
    const checkStandalone = () => {
      const isInStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone;
      setIsStandalone(isInStandalone);
    };

    checkStandalone();
    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handler = (e: BeforeInstallPromptEvent) => {
    e.preventDefault();
    setPrompt(e);
  };

  const handleAddToHomeScreen = () => {
    if (prompt) {
      prompt.prompt();
      prompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the A2HS prompt");
        } else {
          console.log("User dismissed the A2HS prompt");
        }
        setPrompt(null);
      });
    }
  };

  if (isStandalone || !prompt) {
    return null;
  }

  return (
    <Flex width="100%" align="center" justify="center">
      <Button onClick={handleAddToHomeScreen}>
        Add this App to your Home Screen
      </Button>
    </Flex>
  );
};

export default AddToHomeScreenPrompt;
