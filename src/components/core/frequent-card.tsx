import { FrequentlyUsedCard } from "@/lib/types";
import { Flex, Text } from "@chakra-ui/react";

export default function Card(card: FrequentlyUsedCard) {
  return (
    <Flex
      bg="#FCFCFC"
      height="250px"
      minW={{ base: "250px", lg: "30%" }}
      maxWidth="90%"
      borderRadius="12px"
      p={6}
      direction="column"
      justify="space-between"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      border="1px solid #E0E0E0"
      onClick={() => card.directive()}
      cursor="pointer"
      mx={2}
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

      <Text
        fontSize={{ base: "16px", lg: "18px" }}
        color={card.color}
        fontWeight="bold"
      >
        {card.heading}
      </Text>

      <Text fontSize={{ base: "14px", lg: "16px" }} color="#323641">
        {card.subheading}
      </Text>
    </Flex>
  );
}
