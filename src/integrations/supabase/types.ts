import { UUID } from "crypto";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          company: string | null;
          address_street: string | null;
          address_city: string | null;
          address_state: string | null;
          address_postal_code: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_postal_code?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          phone?: string | null;
          company?: string | null;
          address_street?: string | null;
          address_city?: string | null;
          address_state?: string | null;
          address_postal_code?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plants: {
        Row: {
          id: string;
          name: string;
          location: string;
          country: string;
          owner: UUID;
          description: string;
          minimum_order: number;
          turnaround_time: string;
          rating: number;
          review_count: number;
          features: string[];
          image_url: string;
          website: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          location: string;
          country: string;
          owner: UUID;
          description: string;
          minimum_order: number;
          turnaround_time: string;
          rating: number;
          review_count: number;
          features: string[];
          image_url: string;
          website: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          country?: string;
          owner?: UUID;
          description?: string;
          minimum_order?: number;
          turnaround_time?: string;
          rating?: number;
          review_count?: number;
          features?: string[];
          image_url?: string;
          website?: string;
          created_at?: string;
        };
      };
      vinyl_pricing: {
        Row: {
          created_at: string;
          id: string;
          plant_id: string;
          price: number;
          quantity: number;
          size: string;
          type: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          plant_id: string;
          price: number;
          quantity: number;
          size: string;
          type: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          plant_id?: string;
          price?: number;
          quantity?: number;
          size?: string;
          type?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      packaging_pricing: {
        Row: {
          id: string;
          plant_id: string;
          type: string;
          option: string;
          prices: {
            price: string;
            quantity: number;
          }[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          plant_id: string;
          type: string;
          option: string;
          prices: {
            price: string;
            quantity: number;
          }[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          type?: string;
          option?: string;
          prices?: {
            price: string;
            quantity: number;
          }[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vinyl_color_options: {
        Row: {
          id: string;
          plant_id: string;
          color: string;
          additional_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          plant_id: string;
          color: string;
          additional_cost: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          color?: string;
          additional_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      vinyl_weight_options: {
        Row: {
          id: string;
          plant_id: string;
          weight: string;
          additional_cost: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          plant_id: string;
          weight: string;
          additional_cost: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          weight?: string;
          additional_cost?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      plant_equipments: {
        Row: {
          id: string;
          plant_id: string;
          name: string;
          model: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id: string;
          plant_id: string;
          name: string;
          model: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          name?: string;
          model?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [];
      }
      plant_clients: {
        Row: {
          id: string;
          plant_id: string;
          name: string;
          type: string;
          notable_work: string;
          created_at: string;
        };
        Insert: {
          id: string;
          plant_id: string;
          name: string;
          type: string;
          notable_work: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;
          name?: string;
          type?: string;
          notable_work?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      plant_reviews:{
        Row: {
          id: string;
          plant_id: string;
          username: string;
          user_id: string;
          rating: string;
          comment: string;
          created_at: string;
        };
        Insert: {
          id: string;
          plant_id: string;
          username: string;
          user_id: string;
          rating: string;
          comment: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          plant_id?: string;    
          username?: string;
          user_id?: string;
          rating?: string;
          comment?: string;
          created_at?: string;
        };
        Relationships: [];
      }
      orders: {
        Row: {
          buyer_id: string;
          created_at: string;
          id: string;
          plant_id: string;
          project_name: string;
          quantity: number;
          status: string;
          updated_at: string;
          vinyl_type: string;
        };
        Insert: {
          buyer_id: string;
          created_at?: string;
          id?: string;
          plant_id: string;
          project_name: string;
          quantity: number;
          status?: string;
          updated_at?: string;
          vinyl_type: string;
        };
        Update: {
          buyer_id?: string;
          created_at?: string;
          id?: string;
          plant_id?: string;
          project_name?: string;
          quantity?: number;
          status?: string;
          updated_at?: string;
          vinyl_type?: string;
        };
        Relationships: [];
      };

    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
