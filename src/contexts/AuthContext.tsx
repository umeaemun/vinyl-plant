import React, { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  userProfile: any;
  setUserProfile: React.Dispatch<React.SetStateAction<any>>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (formData: any) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);

      // If user signs in, try to update their profile
      if (event === "SIGNED_IN" && session?.user) {
        updateUserProfile(session.user);
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Helper function to update user profile
  const updateUserProfile = async (user: User) => {
    if (!user) return;

    try {

      const userProfile = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();


      if (userProfile.error) {
        console.error("Error fetching user profile:", userProfile.error);
        return;
      }
      

      setUserProfile(userProfile.data);
      // console.log("userProfile:", userProfile.data);

      if (userProfile.data.email === null || userProfile.data.email === "") {

        console.log("User profile email is null or empty, updating...");

        const { error } = await supabase
          .from('profiles')
          .update({
            email: user.email,
            role: user.user_metadata.role,
            username: user.user_metadata.username,
          })
          .eq('id', user.id);

        if (error) {
          console.error("Profile update error:", error);
        } else {
          console.log("Profile updated successfully");
        }

        if (user.user_metadata.role === "manufacturer") {
          // insert plant data
          console.log("User is a manufacturer, inserting plant data...");
          const { error: plantError } = await supabase
            .from("plants")
            .insert({
              name: user.user_metadata.plant_name,
              location: user.user_metadata.location,
              country: user.user_metadata.country,
              owner: user.id,
            });
          if (plantError) {
            console.error("Error inserting plant data:", plantError);
          }
          console.log("Plant data inserted successfully");
        }


      }

    } catch (error: any) {
      console.error("Error in profile update:", error);
      // Don't throw here, just log the error
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (formData: any) => {
    const { email, password, role, username, plantData } = formData;
    try {
      // console.log("Starting signup process with:", { email, plantData });
      const redirectUrl = `${import.meta.env.VITE_PUBLIC_SITE_URL}/auth`;
      // console.log("Redirect URL for signup:", redirectUrl);
      // Register the user
      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            plant_name: plantData.plantName,
            location: plantData.location,
            country: plantData.country,
            role,
            username,
          },
        },
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      console.log("User registered successfully:", data);
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem("vinylFormData");
      localStorage.removeItem("selectedPlantId");
      localStorage.removeItem("calculatedPlantPricing");
      localStorage.removeItem("selectedPlantForQuote");

    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    }
  };

  const value = {
    session,
    user,
    userProfile,
    setUserProfile,
    signIn,
    signUp,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
