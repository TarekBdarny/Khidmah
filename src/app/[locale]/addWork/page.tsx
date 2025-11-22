"use client";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";
import React, { useEffect } from "react";
import { type DateRange } from "react-day-picker";

const page = () => {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  useEffect(() => {
    console.log(dateRange);
  }, [dateRange]);

  return (
    <section className="flex flex-col gap-6 my-10 px-4 items-center justify-center   ">
      <div className="text-center flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Post a Work </h1>
        <p className="text-muted-foreground">
          Share your job opportunity with the workers community
        </p>
      </div>
      <Card className="w-full md:w-1/2">
        <CardContent>
          <div className="">
            <Label htmlFor="work-description" className="mb-3">
              {" "}
              Work Description *
            </Label>
            <Textarea
              className="resize-none h-30"
              placeholder="Describe work in details ..."
              id="work-description"
            />
          </div>
          <div className="">
            <div className="flex items-center justify-center w-full my-4">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                className="rounded-lg border shadow-sm"
              />
            </div>
            <div className="flex items-center gap-4">
              <div>
                <Label className="mb-2" id="start-time">
                  Start Time
                </Label>
                <Input
                  disabled
                  id="start-time"
                  value={dateRange && formatDate(dateRange.from)}
                  placeholder="Select first date"
                />
              </div>
              <div>
                <Label className="mb-2" id="end-time">
                  End Time
                </Label>
                <Input
                  disabled
                  value={dateRange && dateRange.to && formatDate(dateRange.to)}
                  id="end-time"
                  placeholder="Select second date"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default page;
