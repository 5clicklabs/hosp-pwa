import { VStack, Button, Box, Input } from "@chakra-ui/react";
import React from "react";
import CText from "../core/ctext";
import { UserDetails } from "@/lib/types";

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
          />
          <Input
            name="email"
            placeholder="Email"
            type="email"
            value={userDetails.email}
            onChange={handleUserDetailsChange}
          />
          <Input
            name="phone"
            placeholder="Phone Number"
            type="tel"
            value={userDetails.phone}
            onChange={handleUserDetailsChange}
          />
          <Input
            name="dob"
            placeholder="Date of Birth (DD/MM/YYYY)"
            type="text"
            value={userDetails.dob}
            onChange={handleUserDetailsChange}
          />
          <Button onClick={handleUserDetailsSubmit}>
            <CText>Submit Details</CText>
          </Button>
        </VStack>
      </Box>
    </>
  );
}
