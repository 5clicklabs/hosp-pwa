import useFrequentlyAskedOperations from "@/hooks/frequent-ops";
import useOperations from "@/hooks/operations";
import { MANIPAL_DOCTORS } from "@/lib/doctors";
import { Flex, Spinner, VStack } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AppointmentData, Doctor, Message, UserDetails } from "../lib/types";
import { AppointmentCalendar } from "./chat/appointment-calendar";
import AppointmentForm from "./chat/appointment-form";
import DoctorSelection from "./chat/doctor-selection";
import InputForm from "./chat/input-form";
import MessageList from "./chat/message-list";
import WelcomeOptions from "./chat/welcome-options";
import CText from "./core/ctext";
import { Button } from "./ui/button";
import { downloadICSFile } from "@/lib/utils";

const Chat: React.FC = () => {
  const { sendMessageToGPT, messages, setMessages } =
    useFrequentlyAskedOperations();
  const [showOptions, setShowOptions] = useState(false);
  const [showInputForm, setShowInputForm] = useState(false);
  const [showUserDetailsForm, setShowUserDetailsForm] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [departments, setDepartments] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: "",
    email: "",
    phone: "",
    dob: "",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showDoctorSelection, setShowDoctorSelection] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showAppointmentCalendar, setShowAppointmentCalendar] = useState(false);
  const [previouslySelectedDoctor, setPreviouslySelectedDoctor] =
    useState<Doctor | null>(null);
  const [showConfirmAppointmentButton, setShowConfirmAppointmentButton] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const { bookAppointment, isBooking } = useOperations();

  useEffect(() => {
    const welcomeMessage: Message = {
      id: 1,
      text: "Welcome to Manipal Hospital. How may I help you?",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages([welcomeMessage]);
    setShowOptions(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: `${option}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowOptions(false);

    if (option === "Book an appointment") {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: "What can we help you with?",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      setShowInputForm(true);
    }

    // Handle other options here
  };

  const handleSubmit = async (message: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: message,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowInputForm(false);
    setIsFetching(true);

    const aiMessageId = Date.now() + 1;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: aiMessageId,
        text: "",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      },
    ]);

    try {
      const extractedDepartments = await sendMessageToGPT(message, (chunk) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg
          )
        );
      });

      if (extractedDepartments.length > 0) {
        setDepartments(extractedDepartments);
      } else {
        const clarificationMessage: Message = {
          id: Date.now(),
          text: "I'm sorry, I couldn't determine a specific department based on your input. Could you please provide more details about your symptoms or the type of medical assistance you need?",
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        };
        setMessages((prev) => [...prev, clarificationMessage]);
        setShowInputForm(true);
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
    const userMessage: Message = {
      id: Date.now(),
      text: `${department}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setSelectedDepartment(department);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setDepartments([]);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: "Great! Please provide your personal details for the appointment.",
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setShowUserDetailsForm(true);
  };

  const handleUserDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const handleUserDetailsSubmit = () => {
    if (
      !userDetails.name ||
      !userDetails.email ||
      !userDetails.phone ||
      !userDetails.dob
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      text: `Name: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}\nDate of Birth: ${userDetails.dob}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowUserDetailsForm(false);

    const departmentDoctors = MANIPAL_DOCTORS.filter(
      (doctor) => doctor.department === selectedDepartment
    );
    setFilteredDoctors(departmentDoctors);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: `Please select a doctor from the ${selectedDepartment} department to continue. `,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setShowDoctorSelection(true);
  };

  const handleDoctorSelect = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowDoctorSelection(false);

    const userMessage: Message = {
      id: Date.now(),
      text: `${doctor.fullName}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: `Let's proceed to schedule your appointment.`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setShowAppointmentCalendar(true);
  };

  const handleAppointmentSelect = (date: Date, time: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: `Selected appointment: ${date.toDateString()} at ${time}`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setShowAppointmentCalendar(false);
    setSelectedDate(date);
    setSelectedSlot(time);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: `Do I confirm your appointment with ${
        selectedDoctor!.fullName
      } on ${date.toDateString()} at ${time}?`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    setShowConfirmAppointmentButton(true);
  };

  const handleBackToDoctors = () => {
    setPreviouslySelectedDoctor(selectedDoctor);
    setSelectedDoctor(null);
    setShowAppointmentCalendar(false);
    setShowDoctorSelection(true);

    const userMessage: Message = {
      id: Date.now(),
      text: `I'd like to select a different doctor.`,
      sender: "user",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const assistantMessage: Message = {
      id: Date.now() + 1,
      text: `Okay, Please select from the available doctors below.`,
      sender: "assistant",
      timestamp: new Date().toLocaleString(),
    };
    setMessages((prevMessages) => [...prevMessages, assistantMessage]);
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
        "Appointment booked successfully. Your Appointment ID is " +
          appointmentId
      );
      setShowConfirmAppointmentButton(false);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        text: `Your appointment has been booked successfully.`,
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);

      const addToCalendarMessage: Message = {
        id: Date.now() + 2,
        text: "Would you like to add this appointment to your calendar? ",
        sender: "assistant",
        timestamp: new Date().toLocaleString(),
        action: {
          type: "button",
          text: "Add to Calendar",
          onClick: () => downloadICSFile(appointmentData),
        },
      };
      setMessages((prevMessages) => [...prevMessages, addToCalendarMessage]);

      setTimeout(() => {
        const assistantMessage2: Message = {
          id: Date.now() + 1,
          text: `Is there anything else I can help you with?`,
          sender: "assistant",
          timestamp: new Date().toLocaleString(),
        };
        setMessages((prevMessages) => [...prevMessages, assistantMessage2]);
        setShowOptions(true);
      }, 5000);
    } catch (error: any) {
      console.error("Failed to book appointment:", error);
      toast.error("Failed to book appointment. Please try again.");
    }
  };

  return (
    <Flex
      className="rounded-2xl items-end"
      bg="#F5F5F5"
      height={{ base: "85%", "2xl": "95%" }}
      justify="flex-end"
      direction="column"
      p={2}
    >
      <Flex
        height="95%"
        width="100%"
        direction="column"
        overflowY="auto"
        p={2}
        mb={2}
      >
        <MessageList messages={messages} />
        {showOptions && <WelcomeOptions onOptionSelect={handleOptionSelect} />}
        {departments.length > 0 && (
          <VStack align="stretch" spacing={2} mt={4}>
            {departments.map((dept) => (
              <Button key={dept} onClick={() => handleDepartmentSelect(dept)}>
                <CText>Proceed with {dept}</CText>
              </Button>
            ))}
          </VStack>
        )}
        {showUserDetailsForm && (
          <AppointmentForm
            handleUserDetailsChange={handleUserDetailsChange}
            handleUserDetailsSubmit={handleUserDetailsSubmit}
            userDetails={userDetails}
          />
        )}
        {showDoctorSelection && (
          <DoctorSelection
            doctors={filteredDoctors}
            onDoctorSelect={handleDoctorSelect}
            previouslySelectedDoctor={previouslySelectedDoctor}
          />
        )}
        {showAppointmentCalendar && selectedDoctor && (
          <AppointmentCalendar
            doctorName={selectedDoctor.fullName}
            onAppointmentSelect={handleAppointmentSelect}
            onBackToDoctors={handleBackToDoctors}
          />
        )}
        {showConfirmAppointmentButton && (
          <Button onClick={handleConfirmAppointment}>
            {isBooking ? <Spinner size="sm" /> : "Confirm Appointment"}
          </Button>
        )}
        <div ref={messagesEndRef} />
      </Flex>
      {showInputForm && (
        <InputForm onSubmit={handleSubmit} isFetching={isFetching} />
      )}
    </Flex>
  );
};

export default Chat;
