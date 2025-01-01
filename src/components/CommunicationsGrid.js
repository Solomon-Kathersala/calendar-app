import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
const companies = [
  {
    name: "Company A",
    communications: [
      { key: "Company A1", type: "LinkedIn Post", date: "2024-12-26", notes: "Scheduled for next campaign", status: "overdue"},
      { key: "Company A2", type: "Email", date: "2024-12-25", notes: "Customer engagement email", status: "finished"},
      { key: "Company A3", type: "Team Meeting", date: "2024-12-28", notes: "Monthly team sync", status: "finished"},
      { key: "Company A4", type: "Webinar", date: "2024-12-24", notes: "Product training webinar", status: "finished"},
      { key: "Company A5", type: "Phone Call", date: "2024-12-30", notes: "Follow up with client", status: "scheduled"},
    ],
  },
  {
    name: "Company B",
    communications: [
      { key: "Company B1", type: "Email", date: "2024-12-22", notes: "Monthly updates to users", status: "finished"},
      { key: "Company B2", type: "LinkedIn Post", date: "2024-12-18", notes: "Post about new feature", status: "finished"},
      { key: "Company B3", type: "Phone Call", date: "2024-12-21", notes: "Discuss progress on project", status: "finished"},
      { key: "Company B4", type: "Marketing Campaign", date: "2024-12-23", notes: "Launch new marketing ads", status: "overdue"},
      { key: "Company B5", type: "Project Update", date: "2024-12-29", notes: "Finalizing project deliverables", status: "scheduled"},
    ]
  },
];

const CalendarWithYearDropdown = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const calendarRef = useRef(null);

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setSelectedYear(newYear);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const newDate = new Date(currentDate);
      newDate.setFullYear(newYear);

      calendarApi.gotoDate(newDate.toISOString().split("T")[0]);
    }
  };

  const handleDatesSet = (arg) => {
    // Calculate the middle of the visible range to determine the year
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    const middleDate = new Date((start.getTime() + end.getTime()) / 2);
    const middleYear = middleDate.getFullYear();

    // Synchronize the dropdown year with the middle year of the current visible range
    setSelectedYear(middleYear);
  };

  return (
    <div>
      {/* Year Dropdown */}
      <div style={{ marginBottom: "10px" }}>
        <select
          id="year-dropdown"
          value={selectedYear}
          onChange={handleYearChange}
        >
          {Array.from({ length: 21 }, (_, index) => currentYear - 10 + index).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>

      {/* FullCalendar Component */}
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        initialDate={today.toISOString().split("T")[0]}
        events={companies.flatMap((company) =>
          company.communications.map((com) => ({
            title: com.type,
            start: com.date,
          }))
        )}
        datesSet={handleDatesSet} // Trigger when navigation occurs
      />
    </div>
  );
};

export default CalendarWithYearDropdown;
