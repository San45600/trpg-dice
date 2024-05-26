"use client";

import Image from "next/image";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { Button, Card, Divider } from "@nextui-org/react";
import { ConfirmPopup } from "@/components/ConfirmPopup";
import { Log } from "@/components/Log";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Home() {
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [num, setNum] = useState(-1);
  const [log, setLog] = useState<string[]>([]);
  const [rolling, setRolling] = useState(false)

  const firstArray = Array.from({ length: 24 }, (_, i) => i + 1);
  const secondArray = Array.from({ length: 100 }, (_, i) => i + 1);

  const callback = (val: string) => {
    const newLog = [...log, val];
    localStorage.setItem("log", JSON.stringify(newLog));
    setLog(newLog);
  };

  useEffect(() => {
    const log = localStorage.getItem("log");
    if (!!log) setLog(JSON.parse(log));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center xl:flex-row flex-col bg-black">
      <div className="flex gap-8 flex-wrap p-12 w-full justify-center">
        <Section
          name="1d3"
          max={3}
          callback={(val) => {
            callback(val);
          }}
        />
        <Section
          name="1d4"
          max={4}
          callback={(val) => {
            callback(val);
          }}
        />
        <Section
          name="1d6"
          max={6}
          callback={(val) => {
            callback(val);
          }}
        />
        <Section
          name="1d10"
          max={10}
          callback={(val) => {
            callback(val);
          }}
        />
        <Section
          name="1d100"
          max={100}
          callback={(val) => {
            callback(val);
          }}
          isCrit
        />
        <Section
          name="2d3"
          max={3}
          time={2}
          callback={(val) => {
            callback(val);
          }}
        />
        <Card className="flex flex-col gap-4 justify-center items-center border p-12 text-black">
          <div className="flex gap-2 items-center">
            <Select
              onValueChange={(val) => {
                setFirst(val);
              }}
            >
              <SelectTrigger className="w-[72px] !min-w-0">
                <SelectValue placeholder="..." />
              </SelectTrigger>
              <SelectContent>
                {firstArray.map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-white">d</span>
            <Select
              onValueChange={(val) => {
                setSecond(val);
              }}
            >
              <SelectTrigger className="w-[72px] !min-w-0">
                <SelectValue placeholder="..." />
              </SelectTrigger>
              <SelectContent>
                {secondArray.map((val) => (
                  <SelectItem key={val} value={val.toString()}>
                    {val}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-white">{handleError(num)}</div>
          <Button
            className=""
            isDisabled={Number(first) <= 0 || Number(second) <= 0 || rolling}
            onClick={async () => {
              setRolling(true)
              let count = 0 
              while (count < 50) {
                setNum(getRandomInt(Number(first) * Number(second)));
                await new Promise((resolve) => setTimeout(resolve, 10));
                count++;
              }
              let total = 0;
              for (let i = 0; i < Number(first); i++) {
                total += getRandomInt(Number(second));
              }
              setNum(total);
              const date = getDate();
              const dateWithVal = date + ` | ${total} (${first}d${second})`;
              callback(dateWithVal);
              setRolling(false)
            }}
          >
            Start
          </Button>
        </Card>
      </div>
      <div className="px-12 w-full xl:w-[30%] h-full pb-4">
        <Card className=" text-white border h-[90vh]">
          <div className="flex flex-col items-center py-4">Log</div>
          <Log log={log}>
            <Button
              color="primary"
              className="absolute top-3 left-2 bg-blue-500"
              size="sm"
            >
              Full log
            </Button>
          </Log>
          <ConfirmPopup
            callback={() => {
              localStorage.setItem("log", "");
              setLog([]);
            }}
          >
            <Button color="danger" className="absolute top-3 right-2" size="sm">
              Clear
            </Button>
          </ConfirmPopup>

          <Divider />
          <div className="flex flex-col-reverse items-start pl-4 py-4">
            {log.map((val, index) => (
              <div key={index}>{val}</div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  );
}

function Section({
  name,
  max,
  time,
  callback,
  isCrit,
}: {
  name: string;
  max: number;
  time?: number;
  isCrit?: boolean;
  callback?: (val: string) => void;
}) {
  const [number, setNumber] = useState(-1);
  const [showText, setShowText] = useState(false);
  const [rolling, setRolling] = useState(false)
  return (
    <Card className="flex flex-col gap-4 justify-center items-center border w-[240px] h-[220px] p-12 text-white">
      <div>{name}</div>
      {handleError(number)}
      <Button
      isDisabled={rolling}
        onClick={async () => {
          setRolling(true)
          setShowText(false);
          let count = 0;
          while (count < 50) {
            setNumber(getRandomInt(max));
            await new Promise((resolve) => setTimeout(resolve, 10));
            count++;
          }
          let total = 0;
          const iterations = time ?? 1;
          for (let i = 0; i < iterations; i++) {
            total += getRandomInt(max);
          }
          setNumber(total);
          setShowText(true);
          const date = getDate();
          const dateWithVal = date + ` | ${total} (${name})`;
          if (callback) callback(dateWithVal);
          setRolling(false)
        }}
      >
        Start
      </Button>
      {isCrit && showText && (
        <div className="text-red-500 font-bold text-sm absolute bottom-6">
          {number <= 5 && number > 0 && "Critical Success!"}
          {number >= 95 && "Critical Fail!"}
        </div>
      )}
    </Card>
  );
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max) + 1;
}

function addZero(val: number) {
  return val <= 9 ? "0" + val : val;
}

function getDate() {
  const asd = new Date();
  return `${asd.getMonth() + 1}/${asd.getDate()} ${addZero(
    asd.getHours()
  )}:${addZero(asd.getMinutes())}:${addZero(asd.getSeconds())}`;
}

function handleError(val: number) {
  return val == -2 ? "error" : val == -1 ? "Let's Roll !" : val;
}
