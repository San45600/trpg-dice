"use client";

import Image from "next/image";
import { customAlphabet } from "nanoid";
import { useEffect, useState } from "react";
import { Button, Card, Divider, Input } from "@nextui-org/react";
import { ConfirmPopup } from "@/components/ConfirmPopup";
import { Log } from "@/components/Log";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IoMdAdd } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { HiMinus } from "react-icons/hi";

interface CardData {
  id: number;
  name: string;
  first: string;
  second: string;
  specialFirst: string;
  specialSecond: string;
  totalResult: string;
  baseResult: string;
  specialResult: string;
  isSpecial: boolean;
}

export interface LogEntry {
  rollName: string;
  name: string;
  date: string;
  rolls: {
    dice: string;
    specialDice: string;
    totalResult: string;
    baseResult: string;
    specialResult: string;
  }[];
}

export default function Home() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [rolling, setRolling] = useState(false);
  const [rollName, setRollName] = useState("");

  const [cards, setCards] = useState<CardData[]>([
    {
      id: 0,
      name: "",
      first: "",
      second: "",
      specialFirst: "",
      specialSecond: "",
      totalResult: "",
      baseResult: "",
      specialResult: "",
      isSpecial: false,
    },
  ]);

  const firstArray = Array.from({ length: 24 }, (_, i) => i + 1);
  const secondArray = Array.from({ length: 100 }, (_, i) => i + 1);

  const callback = (
    rolls: {
      dice: string;
      specialDice: string;
      totalResult: string;
      baseResult: string;
      specialResult: string;
    }[],
    name: string
  ) => {
    const newEntry: LogEntry = {
      rollName: rollName,
      name: name,
      date: getDate(),
      rolls: rolls,
    };
    const newLog = [...log, newEntry];
    localStorage.setItem("log", JSON.stringify(newLog));
    setLog(newLog);
  };
  const handleRoll = async (index: number) => {
    if (
      Number(cards[index].first) <= 0 ||
      Number(cards[index].second) <= 0 ||
      rolling
    )
      return;

    setRolling(true);
    let count = 0;
    while (count < 50) {
      setCards((prev) =>
        prev.map((c, i) =>
          i === index
            ? {
                ...c,
                baseResult: getRandomInt(
                  Number(c.first) * Number(c.second)
                ).toString(),
                specialResult: c.isSpecial
                  ? getRandomInt(Number(c.first) * Number(c.second)).toString()
                  : "0",
              }
            : c
        )
      );
      await new Promise((resolve) => setTimeout(resolve, 10));
      count++;
    }
    let base = 0;
    let special = 0;

    for (let i = 0; i < Number(cards[index].first); i++) {
      base += getRandomInt(Number(cards[index].second));
    }
    setCards((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, baseResult: base.toString() } : c
      )
    );
    if (cards[index].isSpecial) {
      for (let i = 0; i < Number(cards[index].specialFirst); i++) {
        special += getRandomInt(Number(cards[index].specialSecond));
      }
      setCards((prev) =>
        prev.map((c, i) =>
          i === index ? { ...c, specialResult: special.toString() } : c
        )
      );
    }
    setRolling(false);
    return {
      dice: `${cards[index].first}d${cards[index].second}`,
      specialDice: !cards[index].isSpecial
        ? ""
        : `${cards[index].specialFirst}d${cards[index].specialFirst}`,
      baseResult: base.toString(),
      specialResult: special.toString(),
      totalResult: (base + special).toString(),
    };
  };

  useEffect(() => {
    const log = localStorage.getItem("log");
    if (!!log) setLog(JSON.parse(log));
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center flex-row  bg-[#242424]">
      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-4 p-12 w-full auto-rows-min">
          {cards.map((cardId, index) => (
            <Card
              key={index}
              className="flex relative overflow-visible flex-row gap-4 w-full justify-between items-center border p-4 text-black"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCards((prev) =>
                    prev.map((c, i) =>
                      i === index
                        ? { ...c, isSpecial: !cards[index].isSpecial }
                        : c
                    )
                  );
                }}
                className="absolute right-5 -top-1 bg-white rounded-full flex justify-center items-center w-4 h-4"
              >
                {!cards[index].isSpecial ? (
                  <IoMdAdd size={10} />
                ) : (
                  <HiMinus size={10} />
                )}
              </button>
              {cards.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCards((prev) => prev.filter((_, i) => i !== index));
                  }}
                  className="absolute -right-1 -top-1 bg-red-500 rounded-full flex justify-center items-center w-4 h-4"
                >
                  <RxCross1 size={10} />
                </button>
              )}
              <Input
                className="w-24"
                value={cards[index].name}
                onChange={(e) => {
                  setCards((prev) =>
                    prev.map((c, i) =>
                      i === index ? { ...c, name: e.target.value } : c
                    )
                  );
                }}
              />
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <Select
                    onValueChange={(val) => {
                      setCards((prev) =>
                        prev.map((c, i) =>
                          i === index ? { ...c, first: val } : c
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-[72px] !min-w-0">
                      <SelectValue placeholder="...">
                        {cards[index].first}
                      </SelectValue>
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
                      setCards((prev) =>
                        prev.map((c, i) =>
                          i === index ? { ...c, second: val } : c
                        )
                      );
                    }}
                  >
                    <SelectTrigger className="w-[72px] !min-w-0">
                      <SelectValue placeholder="...">
                        {cards[index].second}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {secondArray.map((val) => (
                        <SelectItem key={val} value={val.toString()}>
                          {val}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="text-white">
                    {handleError(Number(cards[index].baseResult))}
                  </div>
                </div>
                {cards[index].isSpecial && (
                  <div className="flex gap-2 items-center">
                    <Select
                      onValueChange={(val) => {
                        setCards((prev) =>
                          prev.map((c, i) =>
                            i === index ? { ...c, specialFirst: val } : c
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-[72px] !min-w-0">
                        <SelectValue placeholder="...">
                          {cards[index].specialFirst}
                        </SelectValue>
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
                        setCards((prev) =>
                          prev.map((c, i) =>
                            i === index ? { ...c, specialSecond: val } : c
                          )
                        );
                      }}
                    >
                      <SelectTrigger className="w-[72px] !min-w-0">
                        <SelectValue placeholder="...">
                          {cards[index].specialSecond}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {secondArray.map((val) => (
                          <SelectItem key={val} value={val.toString()}>
                            {val}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="text-white">
                      {handleError(Number(cards[index].specialResult))}
                    </div>
                  </div>
                )}
              </div>

              <Button
                className=""
                isDisabled={
                  Number(cards[index].first) <= 0 ||
                  Number(cards[index].second) <= 0 ||
                  (cards[index].isSpecial &&
                    (Number(cards[index].specialFirst) <= 0 ||
                      Number(cards[index].specialSecond) <= 0)) ||
                  rolling
                }
                onClick={async () => {
                  const result = await handleRoll(index);
                  if (result) callback([result], cards[index].name);
                }}
              >
                Start
              </Button>
            </Card>
          ))}
        </div>

        <div className="flex justify-between w-full">
          <Button
            isIconOnly
            className="flex justify-center items-center rounded-full"
            isDisabled={cards.length >= 10}
            onClick={() => {
              setCards((prev) => [
                ...prev,
                {
                  id: prev.length,
                  name: "",
                  first: "",
                  second: "",
                  specialFirst: "",
                  specialSecond: "",
                  baseResult: "",
                  specialResult: "",
                  totalResult: "",
                  isSpecial: false,
                },
              ]);
            }}
          >
            <IoMdAdd />
          </Button>
          <div className="flex gap-2 justify-start items-start">
            <div className="flex items-center gap-2 text-white">
              Roll name:
              <Input
                className="w-24"
                onChange={(e) => setRollName(e.target.value)}
              ></Input>
            </div>
            <Button
              isDisabled={
                cards.some(
                  (card) =>
                    Number(card.first) <= 0 ||
                    Number(card.second) <= 0 ||
                    (card.isSpecial &&
                      (Number(card.specialFirst) <= 0 ||
                        Number(card.specialSecond) <= 0))
                ) || rolling
              }
              className="flex justify-center items-center"
              onClick={async () => {
                const results = [];
                for (let i = 0; i < cards.length; i++) {
                  const result = await handleRoll(i);
                  if (result) {
                    results.push({
                      ...result,
                      name: cards[i].name,
                    });
                  }
                }
                callback(results, rollName);
              }}
            >
              Roll all
            </Button>
          </div>
        </div>
      </div>
      <div className="px-12 w-[30%] h-full pb-4">
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
          <div className="flex flex-col-reverse items-start  pb-4">
            {log.map((val, index) => {
              if (!val.rolls) return;
              return (
                <div key={index} className="flex flex-col w-full">
                  <div className="pl-1  flex gap-2">
                    <div className="font-bold">{val.rollName}</div>
                    <div>{val.date}</div>
                  </div>
                  <div className="pl-2">
                    {val.rolls.map((r, i) => {
                      const maxResult = Math.max(
                        ...val.rolls.map((roll) => Number(roll.totalResult))
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
                            {Number(r.totalResult)}
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
        </Card>
      </div>
    </main>
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
