import { generateAvailability } from "@/lib/utils";
import { HStack, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import CText from "../core/ctext";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

interface AppointmentCalendarProps {
  doctorName: string;
  onAppointmentSelect: (date: Date, time: string) => void;
  onBackToDoctors: () => void;
}

export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  doctorName,
  onAppointmentSelect,
  onBackToDoctors,
}) => {
  const [availability, setAvailability] = useState(generateAvailability());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    setAvailability(generateAvailability());
  }, [doctorName]);

  const handleDayClick = (day: Date | undefined) => {
    if (day && isDateAvailable(day)) {
      setSelectedDate(day);
      setSelectedSlot(null);
    }
  };

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleConfirmAppointment = () => {
    if (selectedDate && selectedSlot) {
      onAppointmentSelect(selectedDate, selectedSlot);
    }
  };

  const isDateAvailable = (date: Date) => {
    const dayAvailability = availability.find(
      (day) => day.date.toDateString() === date.toDateString()
    );
    return dayAvailability ? dayAvailability.availableSlots > 0 : false;
  };

  const modifiers = {
    available: (date: Date) =>
      availability.some(
        (day) =>
          day.date.toDateString() === date.toDateString() &&
          day.availableSlots > 0
      ),
    unavailable: (date: Date) =>
      availability.some(
        (day) =>
          day.date.toDateString() === date.toDateString() &&
          day.availableSlots === 0
      ),
    manySlots: (date: Date) =>
      availability.some(
        (day) =>
          day.date.toDateString() === date.toDateString() &&
          day.availableSlots > 7
      ),
    fewSlots: (date: Date) =>
      availability.some(
        (day) =>
          day.date.toDateString() === date.toDateString() &&
          day.availableSlots > 0 &&
          day.availableSlots <= 7
      ),
  };

  const modifiersStyles = {
    available: { backgroundColor: "green", color: "white" },
    unavailable: {
      backgroundColor: "red",
      color: "white",
      cursor: "not-allowed",
    },
    manySlots: { backgroundColor: "green", color: "white" },
    fewSlots: { backgroundColor: "yellow", color: "black" },
    selected: { border: "2px solid blue" },
  };

  const selectedDaySlots =
    selectedDate && isDateAvailable(selectedDate)
      ? availability.find(
          (day) => day.date.toDateString() === selectedDate.toDateString()
        )?.slots || []
      : [];

  return (
    <VStack
      spacing={4}
      align="stretch"
      p={2}
      className="rounded-2xl"
      bg={"white"}
    >
      <CText fontWeight="bold">{doctorName}&apos;s Calendar</CText>
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleDayClick as any}
        disabled={(date) =>
          date < new Date() ||
          date > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ||
          !isDateAvailable(date)
        }
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
      />
      {selectedDate && isDateAvailable(selectedDate) && (
        <VStack align="stretch">
          <CText>Available slots for {selectedDate.toDateString()}:</CText>
          <HStack wrap="wrap">
            {selectedDaySlots.map((slot) => (
              <Button
                key={slot}
                onClick={() => handleSlotClick(slot)}
                variant={selectedSlot === slot ? "default" : "outline"}
              >
                <CText>{slot}</CText>
              </Button>
            ))}
          </HStack>
        </VStack>
      )}
      <HStack>
        {selectedDate && selectedSlot && (
          <Button className={`w-1/2`} onClick={handleConfirmAppointment}>
            Confirm Appointment
          </Button>
        )}
        <Button
          className={`${
            selectedDate && selectedSlot ? "w-1/2" : "w-full"
          } border border-black`}
          variant="outline"
          onClick={onBackToDoctors}
        >
          Choose Another Doctor
        </Button>
      </HStack>
    </VStack>
  );
};
