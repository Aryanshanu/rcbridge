export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assistance_requests: {
        Row: {
          budget: string
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          property_type: string
          requirement: string
          status: string
        }
        Insert: {
          budget: string
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          property_type: string
          requirement: string
          status?: string
        }
        Update: {
          budget?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          property_type?: string
          requirement?: string
          status?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          admin_name: string | null
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string
          sender_type: string
        }
        Insert: {
          admin_name?: string | null
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string
          sender_type: string
        }
        Update: {
          admin_name?: string | null
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_user_info: {
        Row: {
          conversation_id: string
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          requirements: string | null
          updated_at: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          requirements?: string | null
          updated_at?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          requirements?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_user_info_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string
          id: string
          likes: number | null
          tags: string[] | null
          title: string
          updated_at: string
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          likes?: number | null
          tags?: string[] | null
          title: string
          updated_at?: string
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          likes?: number | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          views?: number | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          subject?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          bot_response: string | null
          created_at: string | null
          id: string
          sentiment: string | null
          user_input: string | null
        }
        Insert: {
          bot_response?: string | null
          created_at?: string | null
          id?: string
          sentiment?: string | null
          user_input?: string | null
        }
        Update: {
          bot_response?: string | null
          created_at?: string | null
          id?: string
          sentiment?: string | null
          user_input?: string | null
        }
        Relationships: []
      }
      customer_inquiries: {
        Row: {
          budget: string
          created_at: string
          id: string
          location: string
          name: string
          property_type: string
        }
        Insert: {
          budget: string
          created_at?: string
          id?: string
          location: string
          name: string
          property_type: string
        }
        Update: {
          budget?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          property_type?: string
        }
        Relationships: []
      }
      demo_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      investment_calculations: {
        Row: {
          appreciation_rate: number
          calculation_result: Json
          created_at: string
          id: string
          location: string
          property_price: number
          property_type: string
          rental_income: number
          timeframe: string
          user_id: string | null
        }
        Insert: {
          appreciation_rate: number
          calculation_result: Json
          created_at?: string
          id?: string
          location: string
          property_price: number
          property_type: string
          rental_income: number
          timeframe: string
          user_id?: string | null
        }
        Update: {
          appreciation_rate?: number
          calculation_result?: Json
          created_at?: string
          id?: string
          location?: string
          property_price?: number
          property_type?: string
          rental_income?: number
          timeframe?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          preferences: Json | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          preferences?: Json | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: Json | null
          area: number | null
          bathrooms: number | null
          bedrooms: number | null
          created_at: string
          description: string | null
          features: string[] | null
          id: string
          land_size: number | null
          listing_type: Database["public"]["Enums"]["listing_type"] | null
          location: string
          owner_id: string | null
          price: number
          property_type: Database["public"]["Enums"]["property_type"] | null
          rental_duration: unknown | null
          rental_terms: string | null
          roi_potential: number | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          land_size?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"] | null
          location: string
          owner_id?: string | null
          price: number
          property_type?: Database["public"]["Enums"]["property_type"] | null
          rental_duration?: unknown | null
          rental_terms?: string | null
          roi_potential?: number | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          amenities?: Json | null
          area?: number | null
          bathrooms?: number | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          features?: string[] | null
          id?: string
          land_size?: number | null
          listing_type?: Database["public"]["Enums"]["listing_type"] | null
          location?: string
          owner_id?: string | null
          price?: number
          property_type?: Database["public"]["Enums"]["property_type"] | null
          rental_duration?: unknown | null
          rental_terms?: string | null
          roi_potential?: number | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      property_alerts: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          listing_type: Database["public"]["Enums"]["listing_type"] | null
          location: string
          max_price: number | null
          max_size: number | null
          min_price: number | null
          min_size: number | null
          property_type: Database["public"]["Enums"]["property_type"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          listing_type?: Database["public"]["Enums"]["listing_type"] | null
          location: string
          max_price?: number | null
          max_size?: number | null
          min_price?: number | null
          min_size?: number | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          listing_type?: Database["public"]["Enums"]["listing_type"] | null
          location?: string
          max_price?: number | null
          max_size?: number | null
          min_price?: number | null
          min_size?: number | null
          property_type?: Database["public"]["Enums"]["property_type"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      property_images: {
        Row: {
          created_at: string
          id: string
          is_primary: boolean | null
          property_id: string | null
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          property_id?: string | null
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          is_primary?: boolean | null
          property_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_images_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      search_queries: {
        Row: {
          created_at: string
          id: string
          location: string | null
          price_range: Json | null
          property_type: string | null
          query: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          price_range?: Json | null
          property_type?: string | null
          query: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          price_range?: Json | null
          property_type?: string | null
          query?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_rewards: {
        Row: {
          created_at: string
          id: string
          points: number | null
          referral_count: number | null
          total_earned: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          points?: number | null
          referral_count?: number | null
          total_earned?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          points?: number | null
          referral_count?: number | null
          total_earned?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_role: {
        Args: {
          user_id: string
          new_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
    }
    Enums: {
      listing_type: "sale" | "rent" | "development_partnership"
      property_type:
        | "residential"
        | "commercial"
        | "agricultural"
        | "undeveloped"
      user_role: "admin" | "developer" | "maintainer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
