export type CalendarView = "month" | "week" | "day" | "agenda";

export interface SimpleCalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  color?: EventColor;
  workOrder?: CalendarWorkOrder;
}

export interface WorkOrder {
  id: string;
  code: string;
  machine: string;
  moreMachines?: string[];
  notes?: string;
  dieCutter?: string;
  newDieCutter?: boolean;
  stamping?: string;
  newStamping?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalendarWorkOrder
  extends Omit<WorkOrder, "createdAt" | "updatedAt"> {
  date: Date;
}

export type EventColor =
  | "sky"
  | "amber"
  | "violet"
  | "rose"
  | "emerald"
  | "orange";
