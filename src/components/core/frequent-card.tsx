import { FrequentlyUsedCard } from "@/lib/types";
import { Flex } from "@chakra-ui/react";
import React from "react";
import CText from "./ctext";

export default function Card(card: FrequentlyUsedCard) {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 100);
    card.directive();
  };

  return (
    <Flex
      bg="#FCFCFC"
      height="200px"
      minW={{ base: "200px", lg: "30%" }}
      maxWidth="90%"
      borderRadius="12px"
      p={6}
      direction="column"
      justify="space-between"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      border="1px solid #E0E0E0"
      cursor="pointer"
      mx={2}
      transform={isClicked ? "scale(0.9)" : "scale(1)"}
      transition="transform 0.1s ease-in-out"
      onClick={handleClick}
    >
      <Flex
        height="fit-content"
        width="fit-content"
        borderRadius="50%"
        bg={card.color}
        p={2}
        align="center"
        justify="center"
      >
        <card.logo color="white" className="h-6 w-6" />
      </Flex>

      <CText
        // fontSize={{ base: "16px", lg: "18px" }}
        color={card.color}
        fontWeight="bold"
      >
        {card.heading}
      </CText>

      <CText fontSize={{ base: "14px", lg: "16px" }} color="#323641">
        {card.subheading}
      </CText>
    </Flex>
  );
}
