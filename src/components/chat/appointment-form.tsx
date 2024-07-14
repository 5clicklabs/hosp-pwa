import { UserDetails } from "@/lib/types";
import { Box, Input, VStack } from "@chakra-ui/react";
import React from "react";
import CText from "../core/ctext";
import { Button } from "../ui/button";

interface AppointmentFormProps {
  userDetails: UserDetails;
  handleUserDetailsChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUserDetailsSubmit: () => void;
}

export default function AppointmentForm({
  handleUserDetailsChange,
  userDetails,
  handleUserDetailsSubmit,
}: AppointmentFormProps) {
  return (
    <>
      <Box bg="white" p={4} borderRadius="md" shadow="md" mt={4}>
        <VStack spacing={3}>
          <Input
            name="name"
            placeholder="Full Name"
            value={userDetails.name}
            onChange={handleUserDetailsChange}
            required
          />
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={userDetails.email}
            onChange={handleUserDetailsChange}
            required
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            type="tel"
            value={userDetails.phone}
            onChange={handleUserDetailsChange}
            required
          />
          <Input
            name="dob"
            placeholder="Date of Birth (DD/MM/YYYY)"
            type="date"
            value={userDetails.dob}
            onChange={handleUserDetailsChange}
          />
          <Button onClick={handleUserDetailsSubmit} className="w-full">
            <CText>Submit Details</CText>
          </Button>
        </VStack>
      </Box>
    </>
  );
}
