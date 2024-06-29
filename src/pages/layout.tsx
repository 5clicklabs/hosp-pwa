import menuAtom from "@/atoms/menuAtom";
import { Container, Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useSetRecoilState } from "recoil";
import { Menu } from "lucide-react";
import HamburgerMenu from "@/components/menu";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Container className="space-y-4" p={3} maxW={"3xl"}>
        <Header />
        {children}
        <HamburgerMenu />
      </Container>
    </>
  );
}

function Header() {
  const setIsMenuOpen = useSetRecoilState(menuAtom);

  return (
    <>
      <Flex direction="row" align="center" justify="space-between">
        <Image w="200px" src="/assets/logo.webp" alt="Manipal Hospitals Logo" />
        <Menu
          className="h-8 w-8"
          onClick={() => setIsMenuOpen({ isOpen: true })}
        />
      </Flex>
    </>
  );
}
