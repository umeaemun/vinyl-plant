
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from 'react-hook-form';
import { Badge } from "@/components/ui/badge";
import FormTooltip from './FormTooltip';
import * as z from "zod";

type VinylDetailsSectionProps = {
  control: Control<any>;
  disabled?: boolean;
};

const VinylDetailsSection = ({
  control,
  disabled
}: VinylDetailsSectionProps) => {
  return <div className="space-y-4">
    <h3 className="font-display font-medium text-lg">Vinyl Specifications</h3>

    <FormField control={control} name="quantity" render={({
      field
    }) => <FormItem >
        <FormLabel className="flex items-center ">
          Quantity
          <FormTooltip content="The total number of vinyl records you want to order. Higher quantities typically result in a lower per-unit cost." />
        </FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
          <FormControl>
            <SelectTrigger className="disabled-opacity-100">
              <SelectValue placeholder="Select quantity" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
            <SelectItem value="150">150</SelectItem>
            <SelectItem value="200">200</SelectItem>
            <SelectItem value="300">300</SelectItem>
            <SelectItem value="500">500</SelectItem>
            <SelectItem value="700">700</SelectItem>
            <SelectItem value="1000">1000</SelectItem>
            <SelectItem value="1500">1500</SelectItem>
            <SelectItem value="2000">2000</SelectItem>
            <SelectItem value="3000">3000</SelectItem>
          </SelectContent>
        </Select>
      </FormItem>} />

    <FormField control={control} name="size" render={({
      field
    }) => <FormItem>
        <FormLabel className="flex items-center">
          Size
          <FormTooltip content="The physical diameter of the vinyl record. Standard 12-inch records are most common for full albums." />
        </FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
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
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
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
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
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
        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
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
