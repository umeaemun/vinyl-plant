
import React, { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from 'react-hook-form';
import { Badge } from "@/components/ui/badge";
import FormTooltip from './FormTooltip';
import { supabase } from '@/integrations/supabase/client';
import { useWatch } from "react-hook-form";
import { Input } from "@/components/ui/input";

type VinylDetailsSectionProps = {
  control: Control<any>;
  disabled?: boolean;
  selectedPlantId?: string;
};

const VinylDetailsSection = ({
  control,
  disabled,
  selectedPlantId
}: VinylDetailsSectionProps) => {

  const quantity = useWatch({ control, name: "quantity" });
  const size = useWatch({ control, name: "size" });
  const type = useWatch({ control, name: "type" });

  const checkOneDisable = async (quantity) => {

    console.log('Checking if one is disabled with:', { quantity, size, type, selectedPlantId });
    // Fetch vinyl pricing
    const { data: vinylPricingData, error: vinylError } = await supabase
      .from('vinyl_pricing')
      .select('plant_id, price, quantity, size, type')
      .eq('size', size)
      .eq('type', type)
      .eq('plant_id', selectedPlantId);

    if (vinylError) {
      console.error('Error fetching vinyl pricing:', vinylError);
      throw new Error('Failed to fetch vinyl pricing data');
    }

    if (vinylPricingData.length === 0) {
      console.warn('No vinyl pricing data found for the selected options');
      return true;
    }


    vinylPricingData.sort((a, b) => b.quantity - a.quantity);
    console.log('Vinyl pricing data:', vinylPricingData);

    const vinylPricing = vinylPricingData.find(item => quantity >= item.quantity);

    console.log('Vinyl pricing found:', quantity, !vinylPricing);
    return !vinylPricing;

  }


  return <div className="space-y-4">
    <h3 className="font-display font-medium text-lg">Vinyl Specifications</h3>

    <FormField control={control} name="quantity" render={({
      field
    }) => <FormItem >
        <FormLabel className="flex items-center ">
          Quantity
          <FormTooltip content="The total number of vinyl records you want to order. Higher quantities typically result in a lower per-unit cost." />
        </FormLabel>
        <FormControl>
          <Input
            type="number"
            {...field}
            placeholder="Enter quantity"
            onBlur={async () => {
              const enteredQuantity = parseInt(field.value);
              if (!enteredQuantity || !size || !type || !selectedPlantId) return;

              await checkOneDisable(enteredQuantity).then(disable => {
                if (disable) {
                  //show error or disable the field
                } else {
                  field.onChange(enteredQuantity);
                }
              });
            }}
          />
        </FormControl>

      </FormItem>} />

    <FormField control={control} name="size" render={({
      field
    }) => <FormItem>
        <FormLabel className="flex items-center">
          Size
          <FormTooltip content="The physical diameter of the vinyl record. Standard 12-inch records are most common for full albums." />
        </FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger className="disabled-opacity-100">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
              <span>7"</span>
              <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
              <span>10"</span>
              <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
            </div>
            <SelectItem value="12">12"</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>} />

    <FormField control={control} name="type" render={({
      field
    }) => <FormItem>
        <FormLabel className="flex items-center">
          Type
          <FormTooltip content="The number of vinyl records in your vinyl package e.g. 1LP means one vinyl disc (around 23 min per side max)" />
        </FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} >
          <FormControl>
            <SelectTrigger className="disabled-opacity-100">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="1LP">1LP</SelectItem>
            <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
              <span>2LP</span>
              <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
            </div>
            <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
              <span>3LP</span>
              <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
            </div>
          </SelectContent>
        </Select>
      </FormItem>} />

    <FormField control={control} name="weight" render={({
      field
    }) => <FormItem>
        <FormLabel className="flex items-center">
          Weight
          <FormTooltip content="The weight of the vinyl record. Standard weight is 140gm, while 180gm is considered audiophile quality with better durability." />
        </FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} >
          <FormControl>
            <SelectTrigger className="disabled-opacity-100">
              <SelectValue placeholder="Select weight" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="140gm">140gm (Standard)</SelectItem>
            <SelectItem value="180gm">180gm</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>} />

    <FormField control={control} name="colour" render={({
      field
    }) => <FormItem>
        <FormLabel className="flex items-center">
          Colour
          <FormTooltip content="The visual appearance / colour of your vinyl record" />
        </FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} >
          <FormControl>
            <SelectTrigger className="disabled-opacity-100">
              <SelectValue placeholder="Select colour" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="black">Standard Black</SelectItem>
            <SelectItem value="solid-colour">Solid Colour</SelectItem>
            <SelectItem value="translucent-colour">Translucent Colour</SelectItem>
            <SelectItem value="marbled">Marbled</SelectItem>
            <SelectItem value="splatter">Splatter</SelectItem>
            <SelectItem value="picture-disc">Picture Disc</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>} />
  </div>;
};

export default VinylDetailsSection;
