
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';

interface FormTooltipProps {
  content: string;
}

const FormTooltip = ({ content }: FormTooltipProps) => {
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            type="button" 
            className="ml-1.5 inline-flex items-center text-muted-foreground hover:text-foreground focus:outline-none" 
            tabIndex={-1}
            aria-label="More information"
          >
            <Info className="h-4 w-4" />
            <span className="sr-only">Info</span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[250px] text-sm">
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FormTooltip;
