export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      agent_chat: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          lead_id: string
          message: string
          sender: string
          timestamp: string
          updated_at: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          lead_id: string
          message: string
          sender: string
          timestamp?: string
          updated_at?: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          lead_id?: string
          message?: string
          sender?: string
          timestamp?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_error_logs: {
        Row: {
          created_at: string | null
          details: Json | null
          device_info: Json | null
          error_level: string | null
          error_type: string | null
          id: number
          message: string
          session_id: string | null
          stripe_context: Json | null
          timestamp: string | null
          url: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          device_info?: Json | null
          error_level?: string | null
          error_type?: string | null
          id?: number
          message: string
          session_id?: string | null
          stripe_context?: Json | null
          timestamp?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          device_info?: Json | null
          error_level?: string | null
          error_type?: string | null
          id?: number
          message?: string
          session_id?: string | null
          stripe_context?: Json | null
          timestamp?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          alternatives: string
          budget: string
          created_at: string
          email: string
          id: string
          idea: string
          name: string
          outcome: string[]
          phone: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          alternatives: string
          budget: string
          created_at?: string
          email: string
          id?: string
          idea: string
          name: string
          outcome: string[]
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          alternatives?: string
          budget?: string
          created_at?: string
          email?: string
          id?: string
          idea?: string
          name?: string
          outcome?: string[]
          phone?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      stripe_transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string | null
          id: string
          lead_id: string
          payment_method: string | null
          status: string
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string | null
          id?: string
          lead_id: string
          payment_method?: string | null
          status: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string | null
          id?: string
          lead_id?: string
          payment_method?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stripe_transactions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
