import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Control } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import FormTooltip from './FormTooltip';


type ManufacturingOptionsProps = {
  control: Control<any>;
  disabled?: boolean;
};

const locationOptions = [
  { label: 'Standard Black', value: 'standard_black' },
  { label: 'Solid Colour', value: 'solid_colour' },
  { label: 'Translucent Colour', value: 'translucent_colour' },
];

const defaultLocationValues = [
  'standard_black',
  'solid_colour',
  'translucent_colour',
];

const defaultQuantities = [500, 1000, 1500];

const ManufacturingOptions = ({
  control,
  disabled,
}: ManufacturingOptionsProps) => {
  const locations = [1, 2, 3];

  return (
    <div className="space-y-4 mb-10">
      <h3 className="font-display font-medium text-lg">Manufacturing Options</h3>
      <Separator className="mb-4" />
<FormField
  control={control}
  name="splitManufacturing"
  render={({ field }) => (
    <div className="space-y-1">
      <FormItem className="flex items-center space-y-0 space-x-2">
        <FormControl>
          <Checkbox
            checked={field.value}
            onCheckedChange={field.onChange}
            disabled={disabled}
          />
        </FormControl>
        <FormLabel className="m-0 flex">Split manufacturing across different locations           
            <FormTooltip content="The total number of vinyl records you want to order. Higher quantities typically result in a lower per-unit cost." />
     </FormLabel>
      </FormItem>
      <p className="text-sm text-muted-foreground ml-6">
       Divide your total quantity across up to 3 different locations.
      </p>
    </div>
  )}
/>

     <p className="text-muted-foreground mt-4">
     Specify quantities for each location (total should equal your main quantity).
    </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
        {locations.map((index, i) => (
          <React.Fragment key={index}>
            {/* Location Select */}
            <FormField
              control={control}
              name={`location${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    Location {index} - Country/Territory
                     {index > 1 && <span className='pl-1'> (Optional)</span>}

                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? defaultLocationValues[i]}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger className="disabled-opacity-100">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Quantity Input */}
            <FormField
              control={control}
              name={`quantity${index}`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex'>Quantity for Location {index}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g., 500"
                      {...field}
                      value={field.value ?? defaultQuantities[i]}
                      disabled={disabled}
                      className="disabled-opacity-100 flex items-center"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default ManufacturingOptions;
