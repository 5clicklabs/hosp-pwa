import { Box, Flex, Text } from "@chakra-ui/react";
import { ClipboardPlus, LucideIcon, Ambulance, PhoneCall } from "lucide-react";

interface FrequentlyUsedCard {
  logo: LucideIcon;
  color: string;
  heading: string;
  subheading: string;
  directive: () => void;
}

function Card(card: FrequentlyUsedCard) {
  return (
    <Flex
      bg="#FCFCFC"
      height="250px"
      width="32%"
      borderRadius="18px"
      p={6}
      direction="column"
      justify="space-between"
      className="shadow-2xl"
      border="0.5px"
      borderColor="gray.400"
      onClick={() => card.directive()}
    >
      <Flex
        height="fit-content"
        width="fit-content"
        borderRadius={99}
        bg={card.color}
        p={2}
        align="center"
        justify="center"
      >
        <card.logo color="white" className="h-6 w-6" />
      </Flex>

      <Flex direction="column">
        <Text fontSize="18px" color={card.color}>
          {card.heading}
        </Text>
        <Text fontSize="18px" color="#323641">
          {card.subheading}
        </Text>
      </Flex>
    </Flex>
  );
}

export default function Hero() {
  return (
    <Flex direction="column">
      <Text>Hi,</Text>
      <Text variant="subheading">What can I help you with?</Text>
      <MostFrequentlyAsked />
    </Flex>
  );
}

const options: Array<FrequentlyUsedCard> = [
  {
    logo: ClipboardPlus,
    color: "#FF6B04",
    heading: "Access Lab Reports",
    subheading: "Access reports",
    directive: () => {
      console.log("access lab is being called");
    },
  },
  {
    logo: Ambulance,
    color: "#00B6F1",
    heading: "Make Appointments",
    subheading: "Book Appointments in seconds",
    directive: () => {
      console.log("ambulance was called");
    },
  },
  {
    logo: PhoneCall,
    color: "#A51514",
    heading: "Emergency",
    subheading: "Call the nearest Manipal Hospital",
    directive: () => {
      console.log("phone call was called");
    },
  },
];

function MostFrequentlyAsked() {
  return (
    <>
      <Text variant="subheading" className="mt-10">
        Most Frequently Asked
      </Text>

      <Flex align="center" justify="space-evenly">
        {options.map((item, index) => (
          <Card
            color={item.color}
            logo={item.logo}
            heading={item.heading}
            subheading={item.subheading}
            directive={item.directive}
            key={index}
          />
        ))}
      </Flex>
    </>
  );
}
