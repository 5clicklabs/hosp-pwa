import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  VStack,
} from "@chakra-ui/react";
import { MANIPAL_DEPARTMENTS } from "@/lib/departments";
import { Button } from "../ui/button";

interface DepartmentSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (department: string) => void;
}

const DepartmentSelectionModal: React.FC<DepartmentSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDepartments = MANIPAL_DEPARTMENTS.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      motionPreset="slideInBottom"
      isCentered
    >
      <ModalOverlay bg="#322c2cf2" />
      <ModalContent width="90%">
        <ModalHeader>Select a Department</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Input
            placeholder="Search departments..."
            mb={4}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <VStack align="stretch" maxHeight="60vh" overflowY="auto">
            {filteredDepartments.map((dept) => (
              <Button
                key={dept}
                onClick={() => {
                  onSelect(dept);
                  onClose();
                }}
                variant="outline"
              >
                {dept}
              </Button>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DepartmentSelectionModal;
