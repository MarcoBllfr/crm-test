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
      Clienti: {
        Row: {
          cod_fisc: string
          cognome: string | null
          created_at: string
          d_scad_tess: string | null
          data_tess: string | null
          email: string | null
          id_cliente: number
          nome: string | null
          telefono: string | null
          tesserato: boolean | null
          user_id: string | null
        }
        Insert: {
          cod_fisc: string
          cognome?: string | null
          created_at?: string
          d_scad_tess?: string | null
          data_tess?: string | null
          email?: string | null
          id_cliente?: number
          nome?: string | null
          telefono?: string | null
          tesserato?: boolean | null
          user_id?: string | null
        }
        Update: {
          cod_fisc?: string
          cognome?: string | null
          created_at?: string
          d_scad_tess?: string | null
          data_tess?: string | null
          email?: string | null
          id_cliente?: number
          nome?: string | null
          telefono?: string | null
          tesserato?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      Lista_Pratiche: {
        Row: {
          created_at: string
          data: string | null
          esito: string | null
          id: number
          id_cliente: number | null
          id_pratica: number | null
          note: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          esito?: string | null
          id?: number
          id_cliente?: number | null
          id_pratica?: number | null
          note?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          data?: string | null
          esito?: string | null
          id?: number
          id_cliente?: number | null
          id_pratica?: number | null
          note?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Lista_Pratiche_id_cliente_fkey"
            columns: ["id_cliente"]
            isOneToOne: false
            referencedRelation: "Clienti"
            referencedColumns: ["id_cliente"]
          },
          {
            foreignKeyName: "Lista_Pratiche_id_pratica_fkey"
            columns: ["id_pratica"]
            isOneToOne: false
            referencedRelation: "Pratiche"
            referencedColumns: ["id_pratica"]
          },
        ]
      }
      Pratiche: {
        Row: {
          cod_pratica: string
          id_pratica: number
          nome_pratica: string | null
          punteggio: number | null
          tipo_pratica: string | null
          user_id: string | null
        }
        Insert: {
          cod_pratica: string
          id_pratica?: number
          nome_pratica?: string | null
          punteggio?: number | null
          tipo_pratica?: string | null
          user_id?: string | null
        }
        Update: {
          cod_pratica?: string
          id_pratica?: number
          nome_pratica?: string | null
          punteggio?: number | null
          tipo_pratica?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_names: {
        Row: {
          created_at: string
          id: number
          name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          user_id?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
