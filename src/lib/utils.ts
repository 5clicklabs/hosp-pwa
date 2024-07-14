import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AppointmentData, DayAvailability } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateAvailability(
  startDate: Date = new Date()
): DayAvailability[] {
  const availability: DayAvailability[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    const availableSlots = Math.floor(Math.random() * 16); // 0 to 15 slots
    const slots: string[] = [];

    for (let j = 0; j < availableSlots; j++) {
      const hour = Math.floor(Math.random() * (18 - 8 + 1)) + 8; // 8 AM to 6 PM
      const minute = Math.random() < 0.5 ? "00" : "30"; // Either on the hour or half past
      slots.push(`${hour.toString().padStart(2, "0")}:${minute}`);
    }

    slots.sort();

    availability.push({ date, availableSlots, slots });
  }

  return availability;
}

function generateICSFile(appointmentData: AppointmentData): string {
  const startDate = new Date(appointmentData.appointmentDate);
  const [hours, minutes] = appointmentData.appointmentTime.split(":");
  startDate.setHours(parseInt(hours), parseInt(minutes));

  const endDate = new Date(startDate.getTime() + 30 * 60000); // Assuming 30 minutes duration

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Manipal Hospital//Appointment Booking//EN
BEGIN:VEVENT
UID:${appointmentData.doctorId}-${startDate.getTime()}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTSTART:${startDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
DTEND:${endDate.toISOString().replace(/[-:]/g, "").split(".")[0]}Z
SUMMARY:Appointment with Dr. ${appointmentData.doctorName}
DESCRIPTION:Appointment at Manipal Hospital with Dr. ${
    appointmentData.doctorName
  } (${appointmentData.department})
LOCATION:Manipal Hospital
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

export function downloadICSFile(appointmentData: AppointmentData) {
  const icsContent = generateICSFile(appointmentData);
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `appointment_${
    appointmentData.appointmentDate.toISOString().split("T")[0]
  }.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
