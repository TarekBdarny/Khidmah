import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, Users } from "lucide-react";
import React from "react";
import IconWithBackground from "./IconWithBackground";

const Cards = () => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-8">
      <Card
        className="shadow-md dark:shadow-muted/50
      hover:scale-[1.02] transition-transform
      "
      >
        <CardContent>
          <div className="flex gap-3 items-center ">
            <IconWithBackground
              backgroundColor="bg-indigo-400/20"
              Icon={<Users className="text-indigo-400" />}
            />
            <h2>Verified Workers</h2>
          </div>
          <p className="text-muted-foreground">
            All workers are background checked and verified
          </p>
        </CardContent>
      </Card>
      <Card
        className="shadow-md dark:shadow-muted/50
      hover:scale-[1.02] transition-transform
      "
      >
        <CardContent>
          <div className="flex gap-3 items-center ">
            <IconWithBackground
              backgroundColor="bg-green-300/20"
              Icon={<Clock className="text-green-500" />}
            />
            <h2>Quick Response</h2>
          </div>
          <p className="text-muted-foreground">
            Get applications from workers within 24 hours
          </p>
        </CardContent>
      </Card>
      <Card className="shadow-md dark:shadow-muted/50 hover:scale-[1.02] transition-transform">
        <CardContent>
          <div className="flex gap-3 items-center ">
            <IconWithBackground
              backgroundColor="bg-purple-300/20"
              Icon={<Briefcase className="text-purple-500" />}
            />
            <h2>No Commitment</h2>
          </div>
          <p className="text-muted-foreground">
            Review applications before hiring anyone
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cards;
