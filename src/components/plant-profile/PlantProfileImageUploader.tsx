
import React, { useState } from 'react';
import { Plant } from '@/data/plants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlantProfileImageUploaderProps {
  plant: Plant;
  setPlant: React.Dispatch<React.SetStateAction<Plant | null>>;
  disabled: boolean;
}

const PlantProfileImageUploader: React.FC<PlantProfileImageUploaderProps> = ({ 
  plant, 
  setPlant, 
  disabled 
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleImageClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real application, you would upload the file to a server
    // For the demo, we'll simulate an upload
    setIsUploading(true);
    
    // Simulate file upload delay
    setTimeout(() => {
      // Create a URL for the selected image
      const imageUrl = URL.createObjectURL(file);
      setPlant({...plant, image_url: imageUrl});
      setIsUploading(false);
      
      toast({
        title: "Image uploaded",
        description: "Your profile image has been updated.",
      });
    }, 1500);
  };
  
  const initials = plant.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`relative cursor-pointer ${disabled ? '' : 'hover:opacity-90'}`}
        onClick={handleImageClick}
      >
        <Avatar className="h-24 w-24">
          <AvatarImage src={plant.image_url} />
          <AvatarFallback className="text-xl">{initials}</AvatarFallback>
        </Avatar>
        
        {!disabled && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
            {isUploading ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled || isUploading}
      />
      
      <p className="text-sm text-muted-foreground mt-2">
        {disabled ? 'Profile Image' : 'Click to change image'}
      </p>
    </div>
  );
};

export default PlantProfileImageUploader;
