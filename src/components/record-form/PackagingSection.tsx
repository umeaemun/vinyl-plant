
import React, { useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Control, useFormContext, useWatch } from 'react-hook-form';
import FormTooltip from './FormTooltip';
import * as z from "zod";
import { supabase } from '@/integrations/supabase/client';

type PackagingSectionProps = {
  control: Control<any>;
  setAllOptionsValid: React.Dispatch<React.SetStateAction<any>>;
  orderSummary: any;
  setOrderSummary: any;
  disabled?: boolean;
  selectedPlantId?: string;
};

const PackagingSection = ({
  control,
  setAllOptionsValid,
  orderSummary,
  setOrderSummary,
  disabled,
  selectedPlantId
}: PackagingSectionProps) => {

  const { formState, setError, clearErrors } = useFormContext();

  const [validOptions, setValidOptions] = React.useState(null);

  const watchInnerSleeve = useWatch({ control, name: 'innerSleeve' });
  const watchJacket = useWatch({ control, name: 'jacket' });
  const watchInserts = useWatch({ control, name: 'inserts' });
  const watchShrinkWrap = useWatch({ control, name: 'shrinkWrap' });

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
      } else {

        const options = {
          innerSleeve: [],
          jacket: [],
          inserts: [],
          shrinkWrap: []
        }
        packageOptions.forEach(item => {
          // console.log('Processing item:', item, item.prices.find(price => price.quantity <= orderSummary?.quantity));
          if (item.prices.find(price => price.quantity <= orderSummary?.quantity)) {
            options[item.type].push(item.option)
          }
        });

        // console.log('Fetched packaging options:', options);
        setValidOptions(options);
      }
    }
    if (disabled) {
      fetchPackageOptions();
    }

  }, [selectedPlantId, orderSummary?.quantity]);

  React.useEffect(() => {
    if (disabled) {
      if (formState.errors.innerSleeve || formState.errors.jacket || formState.errors.inserts || formState.errors.shrinkWrap) {
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: false
        })
        );
      } else {
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: true
        }));
      }

      setOrderSummary && setOrderSummary((prevSummary => {
        return {
          ...prevSummary,
          innerSleeve: watchInnerSleeve,
          jacket: watchJacket,
          inserts: watchInserts,
          shrinkWrap: watchShrinkWrap,
        }
      }));

    }
  }, [watchInnerSleeve, watchJacket, watchInserts, watchShrinkWrap]);

  useEffect(() => {
    if (disabled && validOptions) {

      if (!validOptions['innerSleeve']?.includes(watchInnerSleeve)) {
        setError("innerSleeve", {
          type: "manual",
          message: "Selected option is not valid for the current order quantity."
        });
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: false
        }));
      } else {
        clearErrors("innerSleeve");
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: true
        }));
      }

      if (!validOptions['jacket']?.includes(watchJacket)) {
        setError("jacket", {
          type: "manual",
          message: "Selected option is not valid for the current order quantity."
        });
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: false
        }));
      } else {
        clearErrors("jacket");
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: true
        }));
      }

      if (!validOptions['inserts']?.includes(watchInserts)) {
        setError("inserts", {
          type: "manual",
          message: "Selected option is not valid for the current order quantity."
        });
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: false
        }));
      } else {
        clearErrors("inserts");
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: true
        }));
      }

      if (!validOptions['shrinkWrap']?.includes(watchShrinkWrap)) {
        setError("shrinkWrap", {
          type: "manual",
          message: "Selected option is not valid for the current order quantity."
        });
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: false
        }));
      } else {
        clearErrors("shrinkWrap");
        setAllOptionsValid && setAllOptionsValid((prev) => ({
          ...prev,
          packaging: true
        }));
      }

    }
  }, [validOptions]);

  return <div className="space-y-4">
    <h3 className="font-display font-medium text-lg">Packaging Specifications</h3>
    <FormField control={control} name="innerSleeve" render={({
      field,
      fieldState
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
            <SelectItem value="white-paper" disabled={validOptions && !validOptions['innerSleeve']?.includes("white-paper")}>White Paper</SelectItem>
            <SelectItem value="white-poly-lined" disabled={validOptions && !validOptions['innerSleeve']?.includes("white-poly-lined")}>White Poly-lined</SelectItem>
            <SelectItem value="black-paper" disabled={validOptions && !validOptions['innerSleeve']?.includes("black-paper")}>Black Paper</SelectItem>
            <SelectItem value="black-poly-lined" disabled={validOptions && !validOptions['innerSleeve']?.includes("black-poly-lined")}>Black Poly-lined</SelectItem>
            <SelectItem value="printed" disabled={validOptions && !validOptions['innerSleeve']?.includes("printed")}>Printed</SelectItem>
          </SelectContent>
        </Select>
        {fieldState.error && (
          <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
        )}
      </FormItem>} />

    <FormField control={control} name="jacket" render={({
      field,
      fieldState
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
            <SelectItem value="single-pocket-3mm" disabled={disabled && validOptions && !validOptions['jacket']?.includes("single-pocket-3mm")}>Single Pocket Jacket (3mm Spine)</SelectItem>
            <SelectItem value="single-pocket-5mm" disabled={disabled && validOptions && !validOptions['jacket']?.includes("single-pocket-5mm")}>Single Pocket Jacket (5mm Spine)</SelectItem>
            <SelectItem value="gatefold" disabled={disabled && validOptions && !validOptions['jacket']?.includes("gatefold")}>Gatefold Jacket</SelectItem>
            <SelectItem value="trifold" 
            // disabled={disabled && validOptions && !validOptions['jacket']?.includes("trifold")}
            disabled 
            className="flex items-center justify-between">
              Trifold Jacket
              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                Coming Soon
              </Badge>
            </SelectItem>
          </SelectContent>
        </Select>
        {fieldState.error && (
          <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
        )}
      </FormItem>} />

    <FormField control={control} name="inserts" render={({
      field,
      fieldState
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
            <SelectItem disabled={disabled && validOptions && !validOptions['inserts']?.includes("no-insert")} value="no-insert">No Insert</SelectItem>
            <SelectItem disabled={disabled && validOptions && !validOptions['inserts']?.includes("single-insert")} value="single-insert">Single Insert</SelectItem>
          </SelectContent>
        </Select>
        {fieldState.error && (
          <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
        )}
      </FormItem>} />

    <FormField control={control} name="shrinkWrap" render={({
      field,
      fieldState
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
            <SelectItem value="yes" disabled={disabled && validOptions && !validOptions['shrinkWrap']?.includes("yes")}>Yes</SelectItem>
            <SelectItem value="no" disabled={disabled && validOptions && !validOptions['shrinkWrap']?.includes("no")}>No</SelectItem>
          </SelectContent>
        </Select>
        {fieldState.error && (
          <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
        )}
      </FormItem>} />
  </div>;
};

export default PackagingSection;
