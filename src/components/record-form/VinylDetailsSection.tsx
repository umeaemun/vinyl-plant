
// import React, { useEffect, useState } from 'react';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
// import { Control, useWatch, useFormContext } from 'react-hook-form';
// import { Badge } from "@/components/ui/badge";
// import FormTooltip from './FormTooltip';
// import { supabase } from '@/integrations/supabase/client';
// import { Input } from "@/components/ui/input";

// type VinylDetailsSectionProps = {
//   control: Control<any>;
//   disabled?: boolean;
//   selectedPlantId?: string;
// };

// const VinylDetailsSection = ({
//   control,
//   disabled,
//   selectedPlantId
// }: VinylDetailsSectionProps) => {

//   const { setError, clearErrors } = useFormContext();

//   const quantity = useWatch({ control, name: "quantity" });
//   const size = useWatch({ control, name: "size" });
//   const type = useWatch({ control, name: "type" });

//   const checkQuantityDisable = async (quantity) => {

//     console.log('Checking if one is disabled with:', { quantity, size, type, selectedPlantId });
//     // Fetch vinyl pricing
//     const { data: vinylPricingData, error: vinylError } = await supabase
//       .from('vinyl_pricing')
//       .select('plant_id, price, quantity, size, type')
//       .eq('size', size)
//       .eq('type', type)
//       .eq('plant_id', selectedPlantId);

//     if (vinylError) {
//       console.error('Error fetching vinyl pricing:', vinylError);
//       throw new Error('Failed to fetch vinyl pricing data');
//     }

//     if (vinylPricingData.length === 0) {
//       console.warn('No vinyl pricing data found for the selected options');
//       return true;
//     }


//     vinylPricingData.sort((a, b) => b.quantity - a.quantity);
//     console.log('Vinyl pricing data:', vinylPricingData);

//     const vinylPricing = vinylPricingData.find(item => quantity >= item.quantity);

//     console.log('Vinyl pricing found:', quantity, !vinylPricing);
//     return !vinylPricing;

//   }


//   return <div className="space-y-4">
//     <h3 className="font-display font-medium text-lg">Vinyl Specifications</h3>

//     <FormField control={control} name="quantity" render={({
//       field,
//       fieldState
//     }) => <FormItem >
//         <FormLabel className="flex items-center ">
//           Quantity
//           <FormTooltip content="The total number of vinyl records you want to order. Higher quantities typically result in a lower per-unit cost." />
//         </FormLabel>
//         <FormControl>
//           <Input
//             type="number"
//             {...field}
//             className={fieldState.error ? "border-red-600" : ""}
//             // className={`focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent ${fieldState.error ? "border-red-600" : ""
//             //   }`}
//             placeholder="Enter quantity"
//             onChange={async (e) => {

//               const enteredQuantity = parseInt(e.target.value);
//               field.onChange(e); // always call this to update the form state

//               if (!enteredQuantity || !size || !type || !selectedPlantId) return;

//               const invalid = await checkQuantityDisable(enteredQuantity);
//               if (invalid) {
//                 setError("quantity", {
//                   type: "manual",
//                   message: "No pricing available for this quantity with the selected size/type.",
//                 });
//               } else {
//                 clearErrors("quantity");
//               }
//             }}
//           />
//         </FormControl>
//         {fieldState.error && (
//           <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
//         )}
//       </FormItem>} />

//     <FormField control={control} name="size" render={({
//       field
//     }) => <FormItem>
//         <FormLabel className="flex items-center">
//           Size
//           <FormTooltip content="The physical diameter of the vinyl record. Standard 12-inch records are most common for full albums." />
//         </FormLabel>
//         <Select onValueChange={field.onChange} defaultValue={field.value}>
//           <FormControl>
//             <SelectTrigger className="disabled-opacity-100">
//               <SelectValue placeholder="Select size" />
//             </SelectTrigger>
//           </FormControl>
//           <SelectContent>
//             {/* <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
//               <span>7"</span>
//               <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
//             </div>
//             <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
//               <span>10"</span>
//               <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
//             </div> */}
//             <SelectItem value="7">7" <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge></SelectItem>
//             <SelectItem value="10">10" <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge></SelectItem>
//             <SelectItem value="12">12"</SelectItem>
//           </SelectContent>
//         </Select>
//       </FormItem>} />

//     <FormField control={control} name="type" render={({
//       field
//     }) => <FormItem>
//         <FormLabel className="flex items-center">
//           Type
//           <FormTooltip content="The number of vinyl records in your vinyl package e.g. 1LP means one vinyl disc (around 23 min per side max)" />
//         </FormLabel>
//         <Select onValueChange={field.onChange} defaultValue={field.value} >
//           <FormControl>
//             <SelectTrigger className="disabled-opacity-100">
//               <SelectValue placeholder="Select type" />
//             </SelectTrigger>
//           </FormControl>
//           <SelectContent>
//             <SelectItem value="1LP">1LP</SelectItem>
//             <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
//               <span>2LP</span>
//               <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
//             </div>
//             <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
//               <span>3LP</span>
//               <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
//             </div>
//           </SelectContent>
//         </Select>
//       </FormItem>} />

//     <FormField control={control} name="weight" render={({
//       field
//     }) => <FormItem>
//         <FormLabel className="flex items-center">
//           Weight
//           <FormTooltip content="The weight of the vinyl record. Standard weight is 140gm, while 180gm is considered audiophile quality with better durability." />
//         </FormLabel>
//         <Select onValueChange={field.onChange} defaultValue={field.value} >
//           <FormControl>
//             <SelectTrigger className="disabled-opacity-100">
//               <SelectValue placeholder="Select weight" />
//             </SelectTrigger>
//           </FormControl>
//           <SelectContent>
//             <SelectItem value="140gm">140gm (Standard)</SelectItem>
//             <SelectItem value="180gm">180gm</SelectItem>
//           </SelectContent>
//         </Select>
//       </FormItem>} />

//     <FormField control={control} name="colour" render={({
//       field
//     }) => <FormItem>
//         <FormLabel className="flex items-center">
//           Colour
//           <FormTooltip content="The visual appearance / colour of your vinyl record" />
//         </FormLabel>
//         <Select onValueChange={field.onChange} defaultValue={field.value} >
//           <FormControl>
//             <SelectTrigger className="disabled-opacity-100">
//               <SelectValue placeholder="Select colour" />
//             </SelectTrigger>
//           </FormControl>
//           <SelectContent>
//             <SelectItem value="black">Standard Black</SelectItem>
//             <SelectItem value="solid-colour">Solid Colour</SelectItem>
//             <SelectItem value="translucent-colour">Translucent Colour</SelectItem>
//             <SelectItem value="marbled">Marbled</SelectItem>
//             <SelectItem value="splatter">Splatter</SelectItem>
//             <SelectItem value="picture-disc">Picture Disc</SelectItem>
//           </SelectContent>
//         </Select>
//       </FormItem>} />
//   </div>;
// };

// export default VinylDetailsSection;


import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form";
import { Control, useWatch, useFormContext } from 'react-hook-form';
import { Badge } from "@/components/ui/badge";
import FormTooltip from './FormTooltip';
import { supabase } from '@/integrations/supabase/client';
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
  const { setError, clearErrors } = useFormContext();

  const quantity = useWatch({ control, name: "quantity" });
  const size = useWatch({ control, name: "size" });
  const type = useWatch({ control, name: "type" });

 const validateVinylCombination = async ({
  quantity,
  size,
  type,
  selectedPlantId,
}: {
  quantity?: number;
  size?: string;
  type?: string;
  selectedPlantId?: string;
}) => {
  if (!quantity || !size || !type || !selectedPlantId) {
    return {
      valid: false,
      quantity: !quantity,
      size: !size,
      type: !type
    };
  }

  const { data, error } = await supabase
    .from('vinyl_pricing')
    .select('quantity, size, type, plant_id')
    .eq('plant_id', selectedPlantId);

  if (error || !data) {
    console.error('Failed to fetch pricing data', error);
    return { valid: false, quantity: true, size: true, type: true };
  }

  const sizeValid = data.some((row) => row.size === size);
  const typeValid = data.some((row) => row.type === type);
  const quantityValid = data
    .filter((row) => row.size === size && row.type === type)
    .some((row) => quantity >= row.quantity);

  return {
    valid: sizeValid && typeValid && quantityValid,
    quantity: !quantityValid,
    size: !sizeValid,
    type: !typeValid
  };
};


 const handleValidation = async ({
  quantityOverride,
  sizeOverride,
  typeOverride,
}: {
  quantityOverride?: number;
  sizeOverride?: string;
  typeOverride?: string;
}) => {
  const q = quantityOverride ?? quantity;
  const s = sizeOverride ?? size;
  const t = typeOverride ?? type;

  const result = await validateVinylCombination({
    quantity: q,
    size: s,
    type: t,
    selectedPlantId,
  });

  if (!result.valid) {
    if (result.quantity) {
      setError("quantity", {
        type: "manual",
        message: "This quantity is not available for the selected size and type.",
      });
    } else {
      clearErrors("quantity");
    }

    if (result.size) {
      setError("size", {
        type: "manual",
        message: "This size is not supported for the selected plant or type.",
      });
    } else {
      clearErrors("size");
    }

    if (result.type) {
      setError("type", {
        type: "manual",
        message: "This type is not valid for the selected size or quantity.",
      });
    } else {
      clearErrors("type");
    }
  } else {
    clearErrors("quantity");
    clearErrors("size");
    clearErrors("type");
  }
};

  return (
    <div className="space-y-4">
      <h3 className="font-display font-medium text-lg">Vinyl Specifications</h3>

      <FormField
        control={control}
        name="quantity"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Quantity
              <FormTooltip content="The total number of vinyl records you want to order. Higher quantities typically result in a lower per-unit cost." />
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                className={fieldState.error ? "border-red-600" : ""}
                placeholder="Enter quantity"
                onChange={async (e) => {
                  const val = parseInt(e.target.value);
                  field.onChange(e);
                  await handleValidation({ quantityOverride: val });
                }}
              />
            </FormControl>
            {fieldState.error && (
              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="size"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Size
              <FormTooltip content="The physical diameter of the vinyl record. Standard 12-inch records are most common for full albums." />
            </FormLabel>
            <Select
              onValueChange={async (val) => {
                field.onChange(val);
                await handleValidation({ sizeOverride: val });
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="disabled-opacity-100">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="7">
                  7" <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
                </SelectItem>
                <SelectItem value="10">
                  10" <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
                </SelectItem>
                <SelectItem value="12">12"</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="type"
        render={({ field, fieldState }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Type
              <FormTooltip content="The number of vinyl records in your vinyl package e.g. 1LP means one vinyl disc (around 23 min per side max)" />
            </FormLabel>
            <Select
              onValueChange={async (val) => {
                field.onChange(val);
                await handleValidation({ typeOverride: val });
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="disabled-opacity-100">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1LP">1LP</SelectItem>
                <SelectItem value="2LP">
                  2LP <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
                </SelectItem>
                <SelectItem value="3LP">
                  3LP <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
                </SelectItem>
                {/* <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
                  <span>2LP</span>
                  <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
                </div>
                <div className="flex items-center justify-between px-2 py-1.5 cursor-not-allowed opacity-50">
                  <span>3LP</span>
                  <Badge variant="outline" className="ml-2 bg-gray-100">Coming soon</Badge>
                </div> */}
              </SelectContent>
            </Select>
            {fieldState.error && (
              <p className="text-sm text-red-600 mt-1">{fieldState.error.message}</p>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Weight
              <FormTooltip content="The weight of the vinyl record. Standard weight is 140gm, while 180gm is considered audiophile quality with better durability." />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="colour"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              Colour
              <FormTooltip content="The visual appearance / colour of your vinyl record" />
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          </FormItem>
        )}
      />
    </div>
  );
};

export default VinylDetailsSection;

