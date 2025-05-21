
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signIn, signUp, loading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !loading) {
      // User is authenticated, redirect to their plant profile page
      console.log("Authenticated user detected, redirecting to profile:", user);

      if (user.user_metadata?.role === "manufacturer") {
        navigate(`/plant-profile/${user.id}`);
      } else {
        navigate(`/buyer-profile`);
      }
    }
  }, [user, loading, navigate]);

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log("Attempting login for:", email);
      await signIn(email, password);
      toast({
        title: "Login successful",
        description: "You have been logged in successfully. Redirecting to your plant profile.",
      });
      // Note: No need to navigate here as the useEffect will handle it when user state updates
    } catch (error) {
      console.error("Login error in Auth component:", error);
      // Error is already handled in the signIn function
    }
  };

  const handleRegister = async (formData: any) => {
    try {
      console.log("Processing registration in Auth component:", {
        email: formData.email,
        plantName: formData.plantName
      });

      await signUp({
        email: formData.email,
        password: formData.password,
        role: formData.role,
        username: formData.username,
        plantData: {
          plantName: formData.plantName,
          location: formData.location,
          country: formData.country
        }
      });

      toast({
        title: "Registration successful",
        description: "Your account has been created. Please confirm your email.",
      });

      setActiveTab("login");
      // Note: No need to navigate here as the useEffect will handle it when user state updates
    } catch (error: any) {
      console.error("Registration error in Auth component:", error);
      // Error is already handled in the signUp function, but we can add another toast here if needed
      toast({
        title: "Registration failed",
        description: error.message || "Please check the console for more details.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-20 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-medium mb-4">Loading...</h2>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow pt-20">
          <div className="container mx-auto px-4 py-8 max-w-md">
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-2xl font-display text-center">
                  Pressing Plant Portal
                </CardTitle>
                <CardDescription className="text-center">
                  Login or register your vinyl pressing plant
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs
                  defaultValue="login"
                  value={activeTab}
                  onValueChange={(value) => setActiveTab(value as "login" | "register")}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Create Profile</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <LoginForm onSubmit={handleLogin} />
                  </TabsContent>

                  <TabsContent value="register">
                    <RegisterForm onSubmit={handleRegister} />
                  </TabsContent>
                </Tabs>
              </CardContent>

              <CardFooter className="flex justify-center text-sm text-muted-foreground">
                <p>
                  {activeTab === "login"
                    ? "Don't have a plant profile? "
                    : "Already have a profile? "}
                  <button
                    className="text-primary hover:underline"
                    onClick={() => setActiveTab(activeTab === "login" ? "register" : "login")}
                  >
                    {activeTab === "login" ? "Register here" : "Login here"}
                  </button>
                </p>
              </CardFooter>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    );
  }
};

export default Auth;
