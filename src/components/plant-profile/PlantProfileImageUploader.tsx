
import React, { useState } from 'react';
import { Plant } from '@/data/plants';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

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

  const { toast } = useToast();
  const { user } = useAuth();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload the file to a server
    // For the demo, we'll simulate an upload
    setIsUploading(true);

    const filePath = `${plant?.owner || user?.id}/${plant.id}/profile.jpg`;

    const { data: uploadedData, error: uploadError } = await supabase.storage
      .from('plant-profile-pics')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      setIsUploading(false);
      toast({
        title: 'Upload failed',
        description: 'Could not upload image.',
        variant: 'destructive',
      });
      return;
    }


    const { data } = await supabase.storage.from('plant-profile-pics').getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

    setPlant({
      ...plant,
      image_url: publicUrl,
    })

    const { data: updatedPlant, error} = await supabase
      .from('plants')
      .update({ image_url: publicUrl })
      .eq('id', plant.id)
      .single();
      
    if (error) {
      console.error('Error updating plant:', error);   
    }
    setIsUploading(false);

    toast({
      title: 'Image uploaded',
      description: 'Your profile image has been updated.',
    });

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
