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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      classifications: {
        Row: {
          confidence: number
          created_at: string
          disposal_method: string | null
          environmental_impact: string | null
          id: string
          image_url: string
          is_biodegradable: boolean | null
          is_recyclable: boolean | null
          primary_category: string
          top_predictions: Json
        }
        Insert: {
          confidence: number
          created_at?: string
          disposal_method?: string | null
          environmental_impact?: string | null
          id?: string
          image_url: string
          is_biodegradable?: boolean | null
          is_recyclable?: boolean | null
          primary_category: string
          top_predictions?: Json
        }
        Update: {
          confidence?: number
          created_at?: string
          disposal_method?: string | null
          environmental_impact?: string | null
          id?: string
          image_url?: string
          is_biodegradable?: boolean | null
          is_recyclable?: boolean | null
          primary_category?: string
          top_predictions?: Json
        }
        Relationships: []
      }
      dataset_uploads: {
        Row: {
          class_distribution: Json | null
          created_at: string
          file_size: number | null
          filename: string
          id: string
          status: string
          total_images: number | null
        }
        Insert: {
          class_distribution?: Json | null
          created_at?: string
          file_size?: number | null
          filename: string
          id?: string
          status?: string
          total_images?: number | null
        }
        Update: {
          class_distribution?: Json | null
          created_at?: string
          file_size?: number | null
          filename?: string
          id?: string
          status?: string
          total_images?: number | null
        }
        Relationships: []
      }
      iot_sensors: {
        Row: {
          bin_type: string
          capacity_liters: number
          created_at: string
          id: string
          latitude: number | null
          location_name: string
          longitude: number | null
          sensor_id: string
        }
        Insert: {
          bin_type?: string
          capacity_liters?: number
          created_at?: string
          id?: string
          latitude?: number | null
          location_name: string
          longitude?: number | null
          sensor_id: string
        }
        Update: {
          bin_type?: string
          capacity_liters?: number
          created_at?: string
          id?: string
          latitude?: number | null
          location_name?: string
          longitude?: number | null
          sensor_id?: string
        }
        Relationships: []
      }
      model_metrics: {
        Row: {
          accuracy: number | null
          created_at: string
          f1_score: number | null
          id: string
          inference_time_ms: number | null
          model_name: string
          precision: number | null
          recall: number | null
          total_predictions: number | null
          updated_at: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          f1_score?: number | null
          id?: string
          inference_time_ms?: number | null
          model_name: string
          precision?: number | null
          recall?: number | null
          total_predictions?: number | null
          updated_at?: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          f1_score?: number | null
          id?: string
          inference_time_ms?: number | null
          model_name?: string
          precision?: number | null
          recall?: number | null
          total_predictions?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      sensor_readings: {
        Row: {
          fill_level: number
          humidity: number | null
          id: string
          sensor_id: string | null
          temperature: number | null
          timestamp: string
        }
        Insert: {
          fill_level: number
          humidity?: number | null
          id?: string
          sensor_id?: string | null
          temperature?: number | null
          timestamp?: string
        }
        Update: {
          fill_level?: number
          humidity?: number | null
          id?: string
          sensor_id?: string | null
          temperature?: number | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "sensor_readings_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "iot_sensors"
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
