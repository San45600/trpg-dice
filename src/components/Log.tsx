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
import { Button } from "@nextui-org/react";

export function Log({ children, log }: { children: React.ReactNode, log: string[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="bg-black text-white">
      <div className="flex flex-col-reverse items-start pl-4 py-4 overflow-y-scroll h-[95%]">
            {log.map((val, index) => (
              <div key={index}>{val}</div>
            ))}
          </div>
      </SheetContent>
    </Sheet>
  );
}
