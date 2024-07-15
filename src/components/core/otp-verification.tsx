import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Flex, Spinner } from "@chakra-ui/react";
import CText from "./ctext";
import React, { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  otp: string;
  onChangeOTP: (e: string) => void;
  onVerifyOTP: () => void;
  isFetching: boolean;
}

export function OTPVerification({
  otp,
  onChangeOTP,
  onVerifyOTP,
  isFetching,
}: Props) {
  return (
    <Flex
      bg="white"
      p={4}
      borderRadius="md"
      shadow="md"
      mt={4}
      justify={"center"}
      direction={"column"}
    >
      <CText className="font-semibold text-sm my-2">One-Time Password</CText>
      <InputOTP value={otp} onChange={(e) => onChangeOTP(e)} maxLength={6}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
        <InputOTPSeparator />
        <InputOTPGroup>
          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <label className="text-sm text-gray-500 my-2">
        Please enter the one-time password sent to your phone.
      </label>
      <Button onClick={onVerifyOTP}>
        {isFetching ? <Spinner size="sm" /> : "Submit"}
      </Button>
    </Flex>
  );
}
