import menuAtom from "@/atoms/menuAtom";
import useFrequentlyAskedOperations from "@/hooks/frequent-ops";
import { FrequentlyUsedCard } from "@/lib/types";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import AddToHomeScreenPrompt from "./add-to-homescreen-prompt";
import CText from "./core/ctext";

export default function HamburgerMenu() {
  const [menuIsOpen, setMenuIsOpen] = useRecoilState(menuAtom);

  const onClose = () => {
    setMenuIsOpen({ isOpen: false });
  };

  const { options } = useFrequentlyAskedOperations();

  return (
    <>
      <Drawer isOpen={menuIsOpen.isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody p={10}>
            <CText
              textAlign="left"
              fontSize={{ base: "16px", lg: "18px" }}
              fontWeight="bold"
              mb={3}
            >
              Most Frequently Asked
            </CText>
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
      <card.logo className={`h-6 w-6`} />
      <Flex direction="column">
        <CText
          textAlign="right"
          fontSize={{ base: "16px", lg: "18px" }}
          fontWeight="bold"
          color={card.color}
        >
          {card.heading}
        </CText>

        <CText
          textAlign="right"
          fontSize={{ base: "14px", lg: "16px" }}
          color="#323641"
        >
          {card.subheading}
        </CText>
      </Flex>
    </Flex>
  );
}
