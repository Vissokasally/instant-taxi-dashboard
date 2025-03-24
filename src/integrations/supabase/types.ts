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
      manutencoes: {
        Row: {
          created_at: string | null
          data_agendada: string
          id: string
          realizada: boolean | null
          updated_at: string | null
          veiculo_id: string | null
        }
        Insert: {
          created_at?: string | null
          data_agendada: string
          id?: string
          realizada?: boolean | null
          updated_at?: string | null
          veiculo_id?: string | null
        }
        Update: {
          created_at?: string | null
          data_agendada?: string
          id?: string
          realizada?: boolean | null
          updated_at?: string | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manutencoes_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      motoristas: {
        Row: {
          bi: string
          bi_pdf_url: string | null
          carta_conducao: string
          carta_pdf_url: string | null
          created_at: string | null
          foto_url: string | null
          id: string
          morada: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          bi: string
          bi_pdf_url?: string | null
          carta_conducao: string
          carta_pdf_url?: string | null
          created_at?: string | null
          foto_url?: string | null
          id?: string
          morada: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          bi?: string
          bi_pdf_url?: string | null
          carta_conducao?: string
          carta_pdf_url?: string | null
          created_at?: string | null
          foto_url?: string | null
          id?: string
          morada?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reparacoes: {
        Row: {
          created_at: string | null
          data: string
          descricao: string | null
          id: string
          peca: string
          preco: number
          recibo_pdf_url: string | null
          updated_at: string | null
          veiculo_id: string | null
        }
        Insert: {
          created_at?: string | null
          data: string
          descricao?: string | null
          id?: string
          peca: string
          preco: number
          recibo_pdf_url?: string | null
          updated_at?: string | null
          veiculo_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: string
          descricao?: string | null
          id?: string
          peca?: string
          preco?: number
          recibo_pdf_url?: string | null
          updated_at?: string | null
          veiculo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reparacoes_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      transacoes: {
        Row: {
          categoria: string
          created_at: string | null
          data: string
          descricao: string | null
          id: string
          recibo_pdf_url: string | null
          tipo: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          categoria: string
          created_at?: string | null
          data: string
          descricao?: string | null
          id?: string
          recibo_pdf_url?: string | null
          tipo: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          categoria?: string
          created_at?: string | null
          data?: string
          descricao?: string | null
          id?: string
          recibo_pdf_url?: string | null
          tipo?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: []
      }
      veiculos: {
        Row: {
          ano: number
          created_at: string | null
          id: string
          marca: string
          matricula: string
          modelo: string
          motorista_id: string | null
          quilometragem: number
          updated_at: string | null
        }
        Insert: {
          ano: number
          created_at?: string | null
          id?: string
          marca: string
          matricula: string
          modelo: string
          motorista_id?: string | null
          quilometragem: number
          updated_at?: string | null
        }
        Update: {
          ano?: number
          created_at?: string | null
          id?: string
          marca?: string
          matricula?: string
          modelo?: string
          motorista_id?: string | null
          quilometragem?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_motorista_id_fkey"
            columns: ["motorista_id"]
            isOneToOne: false
            referencedRelation: "motoristas"
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
