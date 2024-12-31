import { LogEntry } from "@/app/page";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, Divider } from "@nextui-org/react";

export function Log({
  children,
  log,
}: {
  children: React.ReactNode;
  log: LogEntry[];
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="bg-black text-white">
        <div className="flex flex-col-reverse items-start pl-4 py-4 overflow-y-scroll h-[95%]">
          {log.map((val, index) => {
            if (!val.rolls) return;

            return (
              <div key={index} className="flex flex-col w-full">
                <div className="pl-1 flex gap-2">
                  <div className="font-bold">{val.rollName}</div>
                  <div>{val.date}</div>
                </div>
                <div className="pl-2">
                  {val.rolls.map((r, i) => (
                    <div key={i}>
                      <span className="text-red-500">{r.result}</span>
                      {` (${r.dice})`}
                    </div>
                  ))}
                </div>
                <Divider />
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
