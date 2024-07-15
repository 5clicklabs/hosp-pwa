import { AppointmentCalendar } from "@/components/chat/appointment-calendar";
import AppointmentForm from "@/components/chat/appointment-form";
import DoctorSelection from "@/components/chat/doctor-selection";
import InputForm from "@/components/chat/input-form";
import { Button } from "@/components/ui/button";
import useOperations from "@/hooks/operations";
import { MANIPAL_DOCTORS } from "@/lib/doctors";
import { downloadICSFile } from "@/lib/utils";
import { Flex, Spinner, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppointmentData, Doctor, Message, UserDetails } from "../lib/types";

interface AppointmentFlowProps {
  addMessage: (message: Message) => void;
  sendMessageToGPT: (
    message: string
  ) => Promise<{ response: string; departments: string[] }>;
  onFlowComplete: () => void;
}

const AppointmentFlow: React.FC<AppointmentFlowProps> = ({
  addMessage,
  sendMessageToGPT,
  onFlowComplete,
}) => {
  const initialMessageSent = useRef(false);
  useEffect(() => {
    if (!initialMessageSent.current) {
      addMessage({
        id: Date.now(),
        text: "What can we help you with?",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
      setStep("input");
      initialMessageSent.current = true;
    }
  }, [addMessage]);

  const [step, setStep] = useState<
    | "input"
    | "departments"
    | "userDetails"
    | "doctorSelection"
    | "calendar"
    | "confirmation"
  >("input");
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  const { bookAppointment, isBooking } = useOperations();

  const handleSubmit = async (message: string) => {
    setIsFetching(true);
    addMessage({
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });

    try {
      const { response, departments } = await sendMessageToGPT(message);

      addMessage({
        id: Date.now(),
        text: response,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });

      if (departments.length > 0) {
        setDepartments(departments);
        setStep("departments");
      } else {
        addMessage({
          id: Date.now(),
          text: "I'm sorry, I couldn't determine a specific department based on your input. Could you please provide more details?",
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        });
      }
    } catch (error) {
      console.error("Error getting GPT response:", error);
      toast.error(
        "Sorry, there was an error processing your request. Please try again."
      );
    } finally {
      setIsFetching(false);
    }
  };

  const handleDepartmentSelect = (department: string) => {
    setSelectedDepartment(department);
    addMessage({
      id: Date.now(),
      text: `${department}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });
    addMessage({
      id: Date.now(),
      text: "Great! Please provide your personal details for the appointment.",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("userDetails");
  };

  const handleUserDetailsSubmit = (details: UserDetails) => {
    setUserDetails(details);
    addMessage({
      id: Date.now(),
      text: `Name: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}\nDate of Birth: ${details.dob}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });

    const departmentDoctors = MANIPAL_DOCTORS.filter(
      (doctor) => doctor.department === selectedDepartment
    );
    setFilteredDoctors(departmentDoctors);

    addMessage({
      id: Date.now(),
      text: `Select a doctor from the ${selectedDepartment} department to continue.`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("doctorSelection");
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    addMessage({
      id: Date.now(),
      text: `${doctor.fullName}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });
    addMessage({
      id: Date.now(),
      text: `Let's proceed to schedule your appointment.`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("calendar");
  };

  const handleAppointmentSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedSlot(time);
    addMessage({
      id: Date.now(),
      text: `Selected appointment: ${date.toDateString()} at ${time}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    });
    addMessage({
      id: Date.now(),
      text: `Do I confirm your appointment with ${
        selectedDoctor!.fullName
      } on ${date.toDateString()} at ${time}?`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    });
    setStep("confirmation");
  };

  const handleConfirmAppointment = async () => {
    try {
      const appointmentData: AppointmentData = {
        patientName: userDetails.name,
        patientEmail: userDetails.email,
        patientPhone: userDetails.phone,
        patientDOB: userDetails.dob,
        doctorId: selectedDoctor!.id,
        doctorName: selectedDoctor!.fullName,
        department: selectedDepartment,
        appointmentDate: selectedDate!,
        appointmentTime: selectedSlot!,
      };
      const appointmentId = await bookAppointment(appointmentData);

      toast.success(
        "Appointment booked successfully. You should receive an SMS shortly."
      );
      addMessage({
        id: Date.now(),
        text: `Your appointment has been booked successfully.`,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      });
      addMessage({
        id: Date.now(),
        text: "Would you like to add this appointment to your calendar? ",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
        action: {
          type: "button",
          text: "Add to Calendar",
          onClick: () => downloadICSFile(appointmentData),
        },
      });

      setTimeout(() => {
        addMessage({
          id: Date.now(),
          text: `Is there anything else I can help you with?`,
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        });
        onFlowComplete();
      }, 5000);
    } catch (error: any) {
      console.error("Failed to book appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Flex direction="column" gap={4}>
      {step === "input" && (
        <Flex mt={2}>
          <InputForm onSubmit={handleSubmit} isFetching={isFetching} />
        </Flex>
      )}
      {step === "departments" && (
        <VStack align="stretch" spacing={2} mt={4}>
          {departments.map((dept) => (
            <Button
              className="w-full"
              key={dept}
              onClick={() => handleDepartmentSelect(dept)}
            >
              Proceed with {dept}
            </Button>
          ))}
        </VStack>
      )}
      {step === "userDetails" && (
        <AppointmentForm
          userDetails={userDetails}
          handleUserDetailsChange={(e) =>
            setUserDetails({ ...userDetails, [e.target.name]: e.target.value })
          }
          handleUserDetailsSubmit={() => handleUserDetailsSubmit(userDetails)}
        />
      )}
      {step === "doctorSelection" && (
        <DoctorSelection
          doctors={filteredDoctors}
          onDoctorSelect={handleDoctorSelect}
          previouslySelectedDoctor={null}
        />
      )}
      {step === "calendar" && selectedDoctor && (
        <AppointmentCalendar
          doctorName={selectedDoctor.fullName}
          onAppointmentSelect={handleAppointmentSelect}
          onBackToDoctors={() => {
            addMessage({
              id: Date.now(),
              text: `I'd like to change my doctor.`,
              sender: "user",
              timestamp: new Date().toLocaleString(),
            });
            setStep("doctorSelection");
          }}
        />
      )}
      {step === "confirmation" && (
        <Button onClick={handleConfirmAppointment} className="w-full">
          {isBooking ? <Spinner size="sm" /> : "Confirm Appointment"}
        </Button>
      )}
    </Flex>
  );
};

export default AppointmentFlow;