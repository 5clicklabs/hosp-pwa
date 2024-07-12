import React from "react";
import { VStack } from "@chakra-ui/react";
import CText from "../core/ctext";
import { Button } from "../ui/button";

interface WelcomeOptionsProps {
  onOptionSelect: (option: string) => void;
}

const WelcomeOptions: React.FC<WelcomeOptionsProps> = ({ onOptionSelect }) => (
  <VStack align="stretch" spacing={2} mt={4}>
    <Button onClick={() => onOptionSelect("Book an appointment")}>
      <CText>Book an appointment</CText>
    </Button>
    <Button onClick={() => onOptionSelect("Get Lab Reports")}>
      <CText>Get Lab Reports</CText>
    </Button>
    <Button onClick={() => onOptionSelect("General Inquiry")}>
      <CText>General Inquiry</CText>
    </Button>
  </VStack>
);

export default WelcomeOptions;
