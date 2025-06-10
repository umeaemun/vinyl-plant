
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Control } from 'react-hook-form';
import FormTooltip from './FormTooltip';
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';

type PackagingSectionProps = {
  control: Control<any>;
  disabled?: boolean;
  selectedPlantId?: string;
};

const PackagingSection = ({
  control,
  disabled,
  selectedPlantId
}: PackagingSectionProps) => {

  const [validOptions, setValidOptions] = React.useState(null);

  React.useEffect(() => {
   
    const fetchPackageOptions = async () => {

      if (!selectedPlantId) {
        return;
      }

      const { data: packageOptions, error } = await supabase
        .from('packaging_pricing')
        .select('*')
        .eq('plant_id', selectedPlantId);

      if (error) {
        console.error('Error fetching packaging options:', error);
        setValidOptions({});
      }else {
        const options = {
          innerSleeve: [],
          jacket: [],
          inserts: [],
          shrinkWrap: []
        }
        packageOptions.forEach(item => {
          options[item.type].push(item.option)
        });

        // console.log('Fetched packaging options:', options);
        setValidOptions(options);
      }
    }
    fetchPackageOptions();

  }, [selectedPlantId]);



  return <div className="space-y-4">
      <h3 className="font-display font-medium text-lg">Packaging Specifications</h3>
      <FormField control={control} name="innerSleeve" render={({
      field
    }) => <FormItem>
            <FormLabel className="flex items-center">
              Inner Sleeve
              <FormTooltip content="The sleeve that holds the vinyl record inside the jacket. Different materials offer varying levels of protection and aesthetic appeal." />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} 
            // disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="disabled-opacity-100">
                  <SelectValue placeholder="Select inner sleeve" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="white-paper" disabled={!validOptions['innerSleeve']?.includes("white-paper")}>White Paper</SelectItem>
                <SelectItem value="white-poly-lined" disabled={!validOptions['innerSleeve']?.includes("white-poly-lined")}>White Poly-lined</SelectItem>
                <SelectItem value="black-paper" disabled={!validOptions['innerSleeve']?.includes("black-paper")}>Black Paper</SelectItem>
                <SelectItem value="black-poly-lined" disabled={!validOptions['innerSleeve']?.includes("black-poly-lined")}>Black Poly-lined</SelectItem>
                <SelectItem value="printed" disabled={!validOptions['innerSleeve']?.includes("printed")}>Printed</SelectItem>
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
            <Select onValueChange={field.onChange} defaultValue={field.value} 
            // disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="disabled-opacity-100">
                  <SelectValue placeholder="Select jacket" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="single-pocket-3mm" disabled={!validOptions['jacket']?.includes("single-pocket-3mm")}>Single Pocket Jacket (3mm Spine)</SelectItem>
                <SelectItem value="single-pocket-5mm" disabled={!validOptions['jacket']?.includes("single-pocket-5mm")}>Single Pocket Jacket (5mm Spine)</SelectItem>
                <SelectItem value="gatefold" disabled={!validOptions['jacket']?.includes("gatefold")}>Gatefold Jacket</SelectItem>
                <SelectItem value="trifold" disabled={!validOptions['jacket']?.includes("trifold")} className="flex items-center justify-between">
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
            <Select onValueChange={field.onChange} defaultValue={field.value} 
            // disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="disabled-opacity-100">
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
            <Select onValueChange={field.onChange} defaultValue={field.value} 
            // disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="disabled-opacity-100">
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
