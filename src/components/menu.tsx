import menuAtom from "@/atoms/menuAtom";
import { FrequentlyUsedCard } from "@/lib/types";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerOverlay,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import { useRecoilState } from "recoil";
import CText from "./core/ctext";
import OpenAIStatus from "./status";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase.config";

export default function HamburgerMenu() {
  const [menuIsOpen, setMenuIsOpen] = useRecoilState(menuAtom);

  const onClose = () => {
    setMenuIsOpen({ isOpen: false });
  };

  const [user] = useAuthState(auth);

  return (
    <>
      <Drawer isOpen={menuIsOpen.isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody mt={12}>
            <Flex height="100%" width="100%"></Flex>
          </DrawerBody>

          <DrawerFooter
            className="w-full"
            display="flex"
            flexDirection={"column"}
          >
            {user ? (
              <div className="flex w-full items-center space-x-2 font-mono">
                <div className="h-4 w-4 bg-green-500 rounded-full "></div>
                <CText>Logged in as: {user.phoneNumber}</CText>
              </div>
            ) : (
              <div className="flex w-full items-center space-x-2 font-mono">
                <div className="h-4 w-4 bg-yellow-500 rounded-full"></div>
                <CText>Not logged in</CText>
              </div>
            )}
            {/* <OpenAIStatus /> */}
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
