import { Check } from "lucide-react";

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

export function FormProgressBar({
  currentStep,
  totalSteps,
  steps,
}: FormProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-8" dir="ltr">
      {/* Progress Bar */}
      {/* <div className="relative mb-8">
        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div> */}

      {/* Step Indicators */}
      <div className="flex justify-between items-start">
        {steps.map((stepName, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div
              key={index}
              className="flex flex-col items-center flex-1 relative"
            >
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`absolute top-5 left-1/2 h-0.5 w-full ${
                    isCompleted ? "bg-primary" : "bg-zinc-200"
                  }`}
                  style={{ zIndex: 0 }}
                />
              )}

              {/* Circle with Number or Check */}
              <div
                className={`
                  relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all
                  ${
                    isCompleted
                      ? "bg-primary text-white"
                      : isCurrent
                      ? "bg-white text-muted-foreground ring-3 ring-primary "
                      : "bg-white border-2 border-zinc-300 text-zinc-400"
                  }
                `}
              >
                {isCompleted ? (
                  <Check className="size-5" />
                ) : (
                  <span className="font-semibold">{stepNumber}</span>
                )}
              </div>

              {/* Step Name */}
              <span
                className={`
                  mt-2 text-xs text-center max-w-[80px] leading-tight
                  ${isCurrent ? "text-blue-900 font-medium " : "text-zinc-600"}
                `}
              >
                {stepName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
