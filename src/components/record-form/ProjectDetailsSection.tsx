
import React from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Control } from 'react-hook-form';

type ProjectDetailsSectionProps = {
  control: Control<any>;
  disabled?: boolean;
};

const ProjectDetailsSection = ({
  control,
  disabled,
}: ProjectDetailsSectionProps) => {
  
  return (
       <div className="space-y-4">
      <h3 className="font-display font-medium text-lg">Project Details</h3>
      <Separator className="mb-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField control={control} name="name" render={({
        field
      }) => <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} disabled={disabled} className="disabled-opacity-100" />
              </FormControl>
            </FormItem>} />
        
        <FormField control={control} name="email" render={({
        field
      }) => <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Your email address" {...field} disabled={disabled} className="disabled-opacity-100" />
              </FormControl>
            </FormItem>} />
      </div>
    </div>
  )
 ;
};

export default ProjectDetailsSection;
