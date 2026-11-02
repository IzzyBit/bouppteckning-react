import {
  DatePicker,
  DateInput,
  DateSegment,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridHeader,
  CalendarGridBody,
  CalendarHeaderCell,
  Button,
  Group,
  Popover,
  Dialog,
  Heading,
  Label,
  I18nProvider,
} from 'react-aria-components';

import { parseDate } from '@internationalized/date';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default function AutoDateField({ label, value, onChange }) {
  return (
    <I18nProvider locale="sv-SE">
      <DatePicker
        className="block min-w-0 space-y-1"
        value={value ? parseDate(value) : null}
        onChange={(date) => onChange(date?.toString() ?? '')}
      >
        <Label className="block text-xs font-semibold text-slate-700">
          {label}
        </Label>

        {/* Date input */}
        <Group className="flex w-full min-w-0 items-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
          <DateInput className="flex min-w-0 flex-1 items-center">
            {(segment) => (
              <DateSegment
                segment={segment}
                className="rounded-sm px-0.5 tabular-nums outline-none data-[focused]:bg-blue-600 data-[focused]:text-white data-[placeholder]:text-slate-400"
              />
            )}
          </DateInput>

          <Button
            className="ml-2 shrink-0 cursor-pointer text-slate-500 outline-none hover:text-blue-600"
            aria-label="Öppna kalender"
          >
            <CalendarDays size={16} />
          </Button>
        </Group>

        {/* Calendar popup */}
        <Popover
          placement="bottom start"
          className="z-50 rounded-lg border border-slate-200 bg-white p-4 shadow-xl outline-none"
        >
          <Dialog className="outline-none">
            <Calendar className="w-[252px]">
              {/* Month navigation */}
              <header className="mb-3 flex items-center justify-between">
                <Button
                  slot="previous"
                  aria-label="Föregående månad"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                >
                  <ChevronLeft size={18} />
                </Button>

                <Heading className="text-sm font-semibold capitalize text-slate-800" />

                <Button
                  slot="next"
                  aria-label="Nästa månad"
                  className="flex size-8 cursor-pointer items-center justify-center rounded-md text-slate-600 hover:bg-slate-100"
                >
                  <ChevronRight size={18} />
                </Button>
              </header>

              {/* Calendar days */}
              <CalendarGrid className="w-full table-fixed border-collapse">
                <CalendarGridHeader>
                  {(day) => (
                    <CalendarHeaderCell className="h-9 w-9 text-center text-xs font-semibold text-slate-500">
                      {day}
                    </CalendarHeaderCell>
                  )}
                </CalendarGridHeader>

                <CalendarGridBody>
                  {(date) => (
                    <CalendarCell
                      date={date}
                      className="h-9 w-9 cursor-pointer rounded-md text-center text-sm text-slate-700 outline-none hover:bg-blue-50 data-[selected]:bg-blue-600 data-[selected]:font-semibold data-[selected]:text-white data-[outside-month]:text-slate-300 data-[disabled]:cursor-default data-[disabled]:opacity-30 data-[focused]:ring-2 data-[focused]:ring-blue-400"
                    />
                  )}
                </CalendarGridBody>
              </CalendarGrid>
            </Calendar>
          </Dialog>
        </Popover>
      </DatePicker>
    </I18nProvider>
  );
}
