import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { enUS } from "date-fns/locale";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  subMonths,
  addMonths,
} from "date-fns";
import { useState } from "react";
import { Calendar1Icon, ArrowLeftToLine, ArrowRightToLine } from "lucide-react";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./data-calendar.css";

import { Task } from "@/features/tasks/types";
import { EventCard } from "./event-card";
import { Button } from "./ui/button";

interface DataCalendarProps {
  data: Task[];
}

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export function DataCalendar({ data }: DataCalendarProps) {
  const [value, setValues] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date(),
  );

  const events = data.map((t) => ({
    start: new Date(t.dueDate),
    end: new Date(t.dueDate),
    title: t.name,
    project: t.project,
    assignee: t.assignee,
    status: t.status,
    id: t.$id,
  }));

  const handleNavigate = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") setValues(subMonths(value, 1));
    else if (action === "NEXT") setValues(addMonths(value, 1));
    else setValues(new Date());
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard
            id={event.id}
            title={event.title}
            assignee={event.assignee}
            project={event.project}
            status={event.status}
          />
        ),
        toolbar: () => (
          <CustomToolbar date={value} onNavigate={handleNavigate} />
        ),
      }}
    />
  );
}

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
      <Button
        variant="secondary"
        className="size-8"
        onClick={() => onNavigate("PREV")}
        size="icon"
      >
        <ArrowLeftToLine className="size-4" />
      </Button>

      <div
        onClick={() => onNavigate("TODAY")}
        className="flex h-8 w-full cursor-pointer items-center justify-center rounded-md border border-input px-3 py-2 lg:w-auto"
      >
        <Calendar1Icon className="mr-2 size-4" />
        <p className="text-sm">{format(date, "MMMM yyyy")}</p>
      </div>

      <Button
        variant="secondary"
        className="size-8"
        onClick={() => onNavigate("NEXT")}
        size="icon"
      >
        <ArrowRightToLine className="size-4" />
      </Button>
    </div>
  );
};
