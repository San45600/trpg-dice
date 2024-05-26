"use client";

import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";

type PopupVariant = "danger" | "default";

export function ConfirmPopup({
  children,
  callback,
  variant = "danger",
}: {
  variant?: PopupVariant;
  children: React.ReactNode;
  callback?: () => void;
}) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <Popover placement="bottom" isOpen={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="p-4 flex flex-col justify-center items-center gap-2 bg-white rounded-xl text-black ">
          <div className="text-small font-bold">Are you sure?</div>
          <Button
            size="sm"
            className="text-tiny"
            color={variant}
            onClick={() => {
              if (callback) callback();
              onClose();
            }}
          >
            Confirm
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
