
import React from 'react';
import { Disc, Music, FileText, User, Mail } from 'lucide-react';
import { FormValues } from '@/components/record-form/FormSchema';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ProjectSpecificationsCardProps {
  formData: FormValues;
}

const ProjectSpecificationsCard: React.FC<ProjectSpecificationsCardProps> = ({ formData }) => {
  return (
    <Card className="mb-8 border-4 border-wwwax-green bg-white">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Your Vinyl Project Specifications</h2>
            {formData.name && (
              <div className="mb-4">
                <Badge variant="outline" className="mr-2 px-3 py-1 text-base">
                  <User className="w-4 h-4 mr-1" /> 
                  {formData.name}
                </Badge>
              </div>
            )}
            {formData.email && (
              <div className="mb-4">
                <Badge variant="outline" className="mr-2 px-3 py-1 text-base">
                  <Mail className="w-4 h-4 mr-1" /> 
                  {formData.email}
                </Badge>
              </div>
            )}
          </div>
          <div className="flex-shrink-0">
            <Badge variant="secondary" className="px-3 py-1 text-base">
              <Disc className="w-4 h-4 mr-1" /> 
              {formData.quantity} units
            </Badge>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Size</span>
            <span className="font-medium">{formData.size}" Vinyl</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Type</span>
            <span className="font-medium">{formData.type}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Weight</span>
            <span className="font-medium">{formData.weight}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Colour</span>
            <span className="font-medium">{formData.colour.charAt(0).toUpperCase() + formData.colour.slice(1).replace(/-/g, ' ')}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Inner Sleeve</span>
            <span className="font-medium">{formData.innerSleeve.replace(/-/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase())}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Jacket</span>
            <span className="font-medium">{formData.jacket.replace(/-/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase())}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Inserts</span>
            <span className="font-medium">{formData.inserts.replace(/-/g, ' ').replace(/(^|\s)\S/g, l => l.toUpperCase())}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Shrink Wrap</span>
            <span className="font-medium">{formData.shrinkWrap === 'yes' ? 'Yes' : 'No'}</span>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/'}>
            <FileText className="w-4 h-4 mr-2" /> Edit Specifications
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectSpecificationsCard;
