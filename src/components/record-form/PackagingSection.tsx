
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Control } from 'react-hook-form';
import FormTooltip from './FormTooltip';
import * as z from "zod";

type PackagingSectionProps = {
  control: Control<any>;
};

const PackagingSection = ({
  control
}: PackagingSectionProps) => {
  return <div className="space-y-4">
      <h3 className="font-display font-medium text-lg">Packaging Specifications</h3>
      
      <FormField control={control} name="innerSleeve" render={({
      field
    }) => <FormItem>
            <FormLabel className="flex items-center">
              Inner Sleeve
              <FormTooltip content="The sleeve that holds the vinyl record inside the jacket. Different materials offer varying levels of protection and aesthetic appeal." />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select inner sleeve" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="white-paper">White Paper</SelectItem>
                <SelectItem value="white-poly-lined">White Poly-lined</SelectItem>
                <SelectItem value="black-paper">Black Paper</SelectItem>
                <SelectItem value="black-poly-lined">Black Poly-lined</SelectItem>
                <SelectItem value="printed">Printed</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>} />
      
      <FormField control={control} name="jacket" render={({
      field
    }) => <FormItem>
            <FormLabel className="flex items-center">
              Jacket
              <FormTooltip content="The outer cover that houses your vinyl record. Different types offer various design possibilities" />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select jacket" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="single-pocket-3mm">Single Pocket Jacket (3mm Spine)</SelectItem>
                <SelectItem value="single-pocket-5mm">Single Pocket Jacket (5mm Spine)</SelectItem>
                <SelectItem value="gatefold">Gatefold Jacket</SelectItem>
                <SelectItem value="trifold" disabled className="flex items-center justify-between">
                  Trifold Jacket
                  <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                    Coming Soon
                  </Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>} />
      
      <FormField control={control} name="inserts" render={({
      field
    }) => <FormItem>
            <FormLabel className="flex items-center">
              Inserts
              <FormTooltip content="Additional printed materials included with your vinyl, such as lyric sheets, artwork, or promotional materials." />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select inserts" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="no-insert">No Insert</SelectItem>
                <SelectItem value="single-insert">Single Insert</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>} />
      
      <FormField control={control} name="shrinkWrap" render={({
      field
    }) => <FormItem>
            <FormLabel className="flex items-center">
              Shrink Wrap
              <FormTooltip content="Protective plastic wrapping around the finished product. Provides protection during shipping and gives a professional retail-ready appearance." />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select shrink wrap option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>} />
    </div>;
};

export default PackagingSection;
