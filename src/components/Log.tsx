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
        <div className="flex flex-col-reverse items-start border-l-2  ring-white py-4 overflow-y-scroll ">
          {log.map((val, index) => {
            if (!val.rolls) return;

            return (
              <div key={index} className="flex flex-col w-full">
                <div className="pl-1 flex gap-2">
                  <div className="font-bold">{val.rollName}</div>
                  <div>{val.date}</div>
                </div>
                <div className="pl-2">
                  {val.rolls.map((r, i) => {
                    const maxResult = Math.max(
                      ...val.rolls.map((roll) => Number(r.totalResult))
                    );
                    return (
                      <div key={i} className="flex gap-2">
                        <span>{val.name}</span>
                        <span
                          className={
                            Number(r.totalResult) === maxResult
                              ? "text-green-500"
                              : "text-red-500"
                          }
                        >
                          {r.totalResult}
                        </span>
                        {r.specialResult == "0"
                          ? ` (${r.dice})`
                          : `[${r.baseResult} (${r.dice}) + ${r.specialResult} (${r.specialDice})]`}
                      </div>
                    );
                  })}
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
