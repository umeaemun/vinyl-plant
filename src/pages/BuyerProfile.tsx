import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { Phone, Building, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

type ProfileData = {
  username: string;
  phone: string;
  company: string;
  addressStreet: string;
  addressCity: string;
  addressState: string;
  addressPostalCode: string;
  avatarUrl: string;
}

const BuyerProfile = () => {
  const { user, userProfile, setUserProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // console.log('userProfile', userProfile);

  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);


  const { data: orders, isLoading: ordersLoading, error: ordersError } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async () => {
      if (!user) {
        throw new Error('No authenticated user');
      }

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: 'Orders Fetch Error',
          description: error.message || 'Failed to fetch orders',
          variant: 'destructive',
        });
        throw error;
      }

      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (userProfile) {

      if (userProfile.role == 'manufacturer') {
        navigate('/plant-profile/0'); // Redirect if not a buyer
        return;
      }

      setProfileData({
        username: userProfile.username || '',
        phone: userProfile.phone || '',
        company: userProfile.company || '',
        addressStreet: userProfile.address_street || '',
        addressCity: userProfile.address_city || '',
        addressState: userProfile.address_state || '',
        addressPostalCode: userProfile.address_postal_code || '',
        avatarUrl: userProfile.avatar_url || ''
      });

    }
  }, [userProfile]);

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error('No authenticated user');
      }

      console.log('profileData', profileData);

      const updateData: {
        username?: string,
        phone?: string,
        company?: string,
        address_street?: string,
        address_city?: string,
        address_state?: string,
        address_postal_code?: string,
        avatar_url?: string
      } = {
        username: profileData.username,
        phone: profileData.phone,
        company: profileData.company,
        address_street: profileData.addressStreet,
        address_city: profileData.addressCity,
        address_state: profileData.addressState,
        address_postal_code: profileData.addressPostalCode
      };



      if (avatarFile) {

        const filePath = `${user?.id}/profile.jpg`;

        const { data: uploadedData, error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload failed',
            description: 'Could not upload image.',
            variant: 'destructive',
          });
          return;
        }

        const { data } = await supabase.storage.from('avatars').getPublicUrl(filePath);
        const publicUrl = `${data.publicUrl}?t=${Date.now()}`;

        updateData.avatar_url = publicUrl;

      }

      const { data: updatedProfile, error: profileError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id)
        .select()
        .single();

      if (profileError) {
        toast({
          title: 'Profile Update Failed',
          description: profileError.message,
          variant: 'destructive',
        });
        return;
      }

      setUserProfile(updatedProfile)

      setEditMode(false);
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  const handleInputChange = (field: keyof typeof profileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const initials = userProfile?.username
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (ordersLoading || !profileData) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-8 text-center content-center min-h-screen">
            <h1 className="font-display text-3xl font-bold mb-4">Loading...</h1>
          </div>
        </main>
        <Footer />
      </div>
    );

  } else if (ordersError) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-8 text-center content-center min-h-screen">
            <h1 className="font-display text-3xl font-bold mb-4">Error loading</h1>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow pt-20">
        <div className="container mx-auto px-4 py-8">
          <h1 className="font-display text-3xl font-bold mb-8">Buyer Profile</h1>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  Personal Information
                  {!editMode && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-6">
                  <div className="relative" >
                    <Avatar className="w-24 h-24">
                      <AvatarImage
                        src={avatarFile ? URL.createObjectURL(avatarFile) : profileData.avatarUrl}
                        alt="Profile avatar"
                      />
                      <AvatarFallback>
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    {editMode && (
                      <label className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                          <circle cx="12" cy="13" r="3"></circle>
                        </svg>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </label>
                    )}
                  </div>

                  <div className="flex-grow">
                    {editMode ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            placeholder="Username"
                            value={profileData.username}
                            onChange={(e) => handleInputChange('username', e.target.value)}
                          />
                          {/* <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                            <Input
                              placeholder="Phone"
                              value={profileData.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="pl-10"
                            />
                          </div> */}
                          <div className="relative">
                            <PhoneInput
                              country={'us'}
                              value={profileData.phone}
                              onChange={(value) => handleInputChange('phone', value)}
                              inputStyle={{
                                width: '100%',
                                height: '38px',
                                borderRadius: '6px',
                                borderColor: '#d1d5db',
                              }}
                              inputClass="text-sm"
                              buttonStyle={{ border: 'none', background: 'transparent' }}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                            <Input
                              placeholder="Company"
                              value={profileData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                            <Input
                              placeholder="Address Street"
                              value={profileData.addressStreet}
                              onChange={(e) => handleInputChange('addressStreet', e.target.value)}
                              className="pl-10"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <Input
                            placeholder="City"
                            value={profileData.addressCity}
                            onChange={(e) => handleInputChange('addressCity', e.target.value)}
                          />
                          <Input
                            placeholder="State"
                            value={profileData.addressState}
                            onChange={(e) => handleInputChange('addressState', e.target.value)}
                          />
                          <Input
                            placeholder="Postal Code"
                            value={profileData.addressPostalCode}
                            onChange={(e) => handleInputChange('addressPostalCode', e.target.value)}
                          />
                        </div>
                        {avatarFile && (
                          <div className="text-sm text-muted-foreground flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                              <polyline points="17 8 12 3 7 8"></polyline>
                              <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            {avatarFile.name}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => updateProfileMutation.mutate()}
                            disabled={updateProfileMutation.isPending}
                          >
                            Save Changes
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditMode(false);
                              setProfileData({
                                username: userProfile?.username || '',
                                phone: userProfile?.phone || '',
                                company: userProfile?.company || '',
                                addressStreet: userProfile?.address_street || '',
                                addressCity: userProfile?.address_city || '',
                                addressState: userProfile?.address_state || '',
                                addressPostalCode: userProfile?.address_postal_code || '',
                                avatarUrl: userProfile?.avatar_url || ''
                              });
                              setAvatarFile(null);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p>
                          <span className="font-medium">Name:</span>{' '}
                          {profileData?.username || ''}
                        </p>
                        {profileData.phone && (
                          <p>
                            <span className="font-medium">Phone:</span>{' '}
                            {profileData.phone}
                          </p>
                        )}
                        {profileData.company && (
                          <p>
                            <span className="font-medium">Company:</span>{' '}
                            {profileData.company}
                          </p>
                        )}
                        {(profileData.addressStreet || profileData.addressCity || profileData.addressState || profileData.addressPostalCode) && (
                          <p>
                            <span className="font-medium">Address:</span>{' '}
                            {[
                              profileData.addressStreet,
                              profileData.addressCity,
                              profileData.addressState,
                              profileData.addressPostalCode
                            ].filter(Boolean).join(', ')}
                          </p>
                        )}
                        <p><span className="font-medium">Email:</span> {user?.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <p className="text-muted-foreground">Loading orders...</p>
                ) : orders?.length === 0 ? (
                  <p className="text-muted-foreground">No orders found</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plant Name</TableHead>
                        <TableHead>Vinyl Type</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Weight</TableHead>
                        <TableHead>Colour</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Per Unit Cost</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Order Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders?.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.plant_name}</TableCell>
                          <TableCell>{order.type}</TableCell>
                          <TableCell>{order.size}"</TableCell>
                          <TableCell>{order.weight}</TableCell>
                          <TableCell>{order.colour}</TableCell>
                          <TableCell className="capitalize">{order.status}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>${order.per_unit % 1 === 0 ? order.per_unit : order.per_unit.toFixed(2)}</TableCell>
                          <TableCell>${order.total % 1 === 0 ? order.total : (order.total).toFixed(2)}</TableCell>
                          <TableCell>
                            {new Date(order.created_at).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BuyerProfile;
