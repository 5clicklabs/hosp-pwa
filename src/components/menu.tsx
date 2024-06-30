import menuAtom from "@/atoms/menuAtom";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import { Ambulance, ClipboardPlus, PhoneCall } from "lucide-react";
import AddToHomeScreenPrompt from "./add-to-homescreen-prompt";
import { FrequentlyUsedCard } from "@/lib/types";
import React from "react";

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

export default function HamburgerMenu() {
  const [menuIsOpen, setMenuIsOpen] = useRecoilState(menuAtom);

  const onClose = () => {
    setMenuIsOpen({ isOpen: false });
  };

  return (
    <>
      <Drawer isOpen={menuIsOpen.isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody p={10}>
            <Text
              textAlign="left"
              fontSize={{ base: "16px", lg: "18px" }}
              fontWeight="bold"
              mb={3}
            >
              Most Frequently Asked
            </Text>
            <Stack spacing={2}>
              {options.map((item, index) => (
                <Row key={index} {...item} />
              ))}
            </Stack>
          </DrawerBody>

          <DrawerFooter className="w-full">
            <AddToHomeScreenPrompt />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

function Row(card: FrequentlyUsedCard) {
  const [isClicked, setIsClicked] = React.useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 100);
    card.directive();
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
      border="1px solid #E0E0E0"
      bg="#FCFCFC"
      p={4}
      cursor="pointer"
      borderRadius="12px"
      transform={isClicked ? "scale(0.9)" : "scale(1)"}
      transition="transform 0.1s ease-in-out"
      onClick={handleClick}
    >
      <card.logo className={`h-6 w-6 text-[${card.color}]`} />
      <Flex direction="column">
        <Text
          textAlign="right"
          fontSize={{ base: "16px", lg: "18px" }}
          fontWeight="bold"
          color={card.color}
        >
          {card.heading}
        </Text>

        <Text
          textAlign="right"
          fontSize={{ base: "14px", lg: "16px" }}
          color="#323641"
        >
          {card.subheading}
        </Text>
      </Flex>
    </Flex>
  );
}
