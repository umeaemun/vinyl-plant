import React, { useEffect, useState } from 'react';
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
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';


interface OrderSummary {
  quantity: string;
  size: string;
  type: string;
  weight: string;
  colour: string;
  innerSleeve: string;
  jacket: string;
  inserts: string;
  shrinkWrap: string;
  perUnit: number;
  splitManufacturing?: boolean;
  splitManufacturingDetails?: any[];
}

type ManufacturingOptionsProps = {
  control: Control<any>;
  disabled?: boolean;
  setOrderSummary?: React.Dispatch<React.SetStateAction<OrderSummary>>;
};

const ManufacturingOptions = ({
  control,
  disabled,
  setOrderSummary
}: ManufacturingOptionsProps) => {

  const [locationOptions, setLocationOptions] = useState([]);
  const locations = [1, 2, 3];

  useEffect(() => {
    countries.registerLocale(enLocale);
    // Initialize country options
    const countryObj = countries.getNames('en');
    const countryList = Object.entries(countryObj).map(([code, name]) => {
      return {
        label: name,
        value: name,
      }
    }

    );
    setLocationOptions(countryList);
  }, []);

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
                  onCheckedChange={(value) => {
                    field.onChange(value);

                    setOrderSummary?.((prev) => ({
                      ...prev,
                      splitManufacturing: value ? true : false,
                    }));

                  }}
                // disabled={disabled}
                />
              </FormControl>
              <FormLabel className="m-0 flex">Split manufacturing across different locations
                <FormTooltip content="The total number of vinyl records you want to order. Higher quantities typically result in a lower per-unit cost." />
              </FormLabel>
            </FormItem>
            <p className="text-sm text-muted-foreground ml-6">
              Divide your total quantity across up to 3 different locations.
            </p>

            {field.value &&
              <>
                <p className="text-muted-foreground" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
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
                              onValueChange={(value => {
                                field.onChange(value);
                                setOrderSummary?.((prev) => {
                                  const newDetails = prev.splitManufacturingDetails;
                                  newDetails[i].location = value;
                                  return {
                                    ...prev,
                                    splitManufacturingDetails: newDetails
                                  };
                                });
                              })}
                              value={field.value || ''}
                            // disabled={disabled}
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
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                  setOrderSummary?.((prev) => {
                                    const newDetails = prev.splitManufacturingDetails;
                                    newDetails[i].quantity = value;
                                    return {
                                      ...prev,
                                      splitManufacturingDetails: newDetails
                                    };
                                  });
                                }}
                                value={field.value || 0}
                                // disabled={disabled}
                                className="disabled-opacity-100 flex items-center"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </>
            }
          </div>
        )}
      />


    </div>
  );
};

export default ManufacturingOptions;
