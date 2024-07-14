import { fontSizeAtom } from "@/atoms/utils";
import { Text, TextProps } from "@chakra-ui/react";
import React from "react";
import { useRecoilValue } from "recoil";

interface Props extends TextProps {
  children: React.ReactNode;
}

export default function CText({ children, ...props }: Props) {
  const useFS = useRecoilValue(fontSizeAtom);

  return (
    <Text fontSize={`${useFS.fontSize}px`} {...props}>
      {children}
    </Text>
  );
}
