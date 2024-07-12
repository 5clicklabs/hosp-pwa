import React from "react";
import { Button, VStack } from "@chakra-ui/react";
import CText from "../core/ctext";

interface WelcomeOptionsProps {
  onOptionSelect: (option: string) => void;
}

const WelcomeOptions: React.FC<WelcomeOptionsProps> = ({ onOptionSelect }) => (
  <VStack align="stretch" spacing={2} mt={4}>
    <Button
      size="md"
      bg="#1f2937"
      color="white"
      onClick={() => onOptionSelect("Book an appointment")}
    >
      <CText>Book an appointment</CText>
    </Button>
    <Button
      size="md"
      bg="#1f2937"
      color="white"
      onClick={() => onOptionSelect("Get Lab Reports")}
    >
      <CText>Get Lab Reports</CText>
    </Button>
    <Button
      size="md"
      bg="#1f2937"
      color="white"
      onClick={() => onOptionSelect("General Inquiry")}
    >
      <CText>General Inquiry</CText>
    </Button>
  </VStack>
);

export default WelcomeOptions;
