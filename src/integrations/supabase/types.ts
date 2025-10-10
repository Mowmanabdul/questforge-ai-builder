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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_id: string
          category: Database["public"]["Enums"]["achievement_category"]
          description: string
          icon: string
          id: string
          name: string
          progress: number
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          target: number
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          category: Database["public"]["Enums"]["achievement_category"]
          description: string
          icon: string
          id?: string
          name: string
          progress?: number
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          target: number
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          category?: Database["public"]["Enums"]["achievement_category"]
          description?: string
          icon?: string
          id?: string
          name?: string
          progress?: number
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
          target?: number
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_rewards: {
        Row: {
          category: string | null
          cost: number
          created_at: string
          description: string
          emoji: string
          icon: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cost: number
          created_at?: string
          description: string
          emoji: string
          icon: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          cost?: number
          created_at?: string
          description?: string
          emoji?: string
          icon?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "custom_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          category: string | null
          completed_at: string | null
          created_at: string
          current: number
          description: string
          id: string
          name: string
          target: number
          type: Database["public"]["Enums"]["goal_type"]
          user_id: string
        }
        Insert: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          current?: number
          description: string
          id?: string
          name: string
          target: number
          type: Database["public"]["Enums"]["goal_type"]
          user_id: string
        }
        Update: {
          category?: string | null
          completed_at?: string | null
          created_at?: string
          current?: number
          description?: string
          id?: string
          name?: string
          target?: number
          type?: Database["public"]["Enums"]["goal_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      gold_transactions: {
        Row: {
          amount: number
          id: string
          source: string
          timestamp: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          id?: string
          source: string
          timestamp?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          id?: string
          source?: string
          timestamp?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "gold_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      homestead_buildings: {
        Row: {
          base_cost: number
          bonus_type: Database["public"]["Enums"]["bonus_type"]
          bonus_value: number
          building_id: string
          description: string
          icon: string
          id: string
          level: number
          name: string
          user_id: string
        }
        Insert: {
          base_cost: number
          bonus_type: Database["public"]["Enums"]["bonus_type"]
          bonus_value: number
          building_id: string
          description: string
          icon: string
          id?: string
          level?: number
          name: string
          user_id: string
        }
        Update: {
          base_cost?: number
          bonus_type?: Database["public"]["Enums"]["bonus_type"]
          bonus_value?: number
          building_id?: string
          description?: string
          icon?: string
          id?: string
          level?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "homestead_buildings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leisure_history: {
        Row: {
          activity_name: string
          cost: number
          id: string
          timestamp: string
          user_id: string
        }
        Insert: {
          activity_name: string
          cost: number
          id?: string
          timestamp?: string
          user_id: string
        }
        Update: {
          activity_name?: string
          cost?: number
          id?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leisure_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      loot_items: {
        Row: {
          category: string | null
          created_at: string
          equipped: boolean
          icon: string
          id: string
          name: string
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          type: Database["public"]["Enums"]["loot_type"]
          user_id: string
          value: number
        }
        Insert: {
          category?: string | null
          created_at?: string
          equipped?: boolean
          icon: string
          id?: string
          name: string
          rarity: Database["public"]["Enums"]["achievement_rarity"]
          type: Database["public"]["Enums"]["loot_type"]
          user_id: string
          value: number
        }
        Update: {
          category?: string | null
          created_at?: string
          equipped?: boolean
          icon?: string
          id?: string
          name?: string
          rarity?: Database["public"]["Enums"]["achievement_rarity"]
          type?: Database["public"]["Enums"]["loot_type"]
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "loot_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          daily_rush_used: boolean
          gold: number
          highest_level: number
          id: string
          journey_progress: number
          level: number
          longest_streak: number
          most_quests_in_day: number
          name: string
          notifications_enabled: boolean
          prestige_level: number
          prestige_points: number
          quests_completed: number
          rested_xp: number
          streak: number
          total_gold_earned: number
          total_xp: number
          tutorial_completed: boolean
          updated_at: string
          xp: number
          xp_to_next: number
        }
        Insert: {
          created_at?: string
          daily_rush_used?: boolean
          gold?: number
          highest_level?: number
          id: string
          journey_progress?: number
          level?: number
          longest_streak?: number
          most_quests_in_day?: number
          name?: string
          notifications_enabled?: boolean
          prestige_level?: number
          prestige_points?: number
          quests_completed?: number
          rested_xp?: number
          streak?: number
          total_gold_earned?: number
          total_xp?: number
          tutorial_completed?: boolean
          updated_at?: string
          xp?: number
          xp_to_next?: number
        }
        Update: {
          created_at?: string
          daily_rush_used?: boolean
          gold?: number
          highest_level?: number
          id?: string
          journey_progress?: number
          level?: number
          longest_streak?: number
          most_quests_in_day?: number
          name?: string
          notifications_enabled?: boolean
          prestige_level?: number
          prestige_points?: number
          quests_completed?: number
          rested_xp?: number
          streak?: number
          total_gold_earned?: number
          total_xp?: number
          tutorial_completed?: boolean
          updated_at?: string
          xp?: number
          xp_to_next?: number
        }
        Relationships: []
      }
      quest_history: {
        Row: {
          category: string
          completed_at: string
          gold: number
          id: string
          name: string
          user_id: string
          xp: number
        }
        Insert: {
          category: string
          completed_at?: string
          gold: number
          id?: string
          name: string
          user_id: string
          xp: number
        }
        Update: {
          category?: string
          completed_at?: string
          gold?: number
          id?: string
          name?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "quest_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quests: {
        Row: {
          category: string
          chain_id: string | null
          chain_order: number | null
          completed: boolean
          completed_at: string | null
          created_at: string
          id: string
          is_template: boolean
          name: string
          priority: Database["public"]["Enums"]["quest_priority"] | null
          user_id: string
          xp: number
        }
        Insert: {
          category: string
          chain_id?: string | null
          chain_order?: number | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          is_template?: boolean
          name: string
          priority?: Database["public"]["Enums"]["quest_priority"] | null
          user_id: string
          xp: number
        }
        Update: {
          category?: string
          chain_id?: string | null
          chain_order?: number | null
          completed?: boolean
          completed_at?: string | null
          created_at?: string
          id?: string
          is_template?: boolean
          name?: string
          priority?: Database["public"]["Enums"]["quest_priority"] | null
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "quests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string
          id: string
          level: number
          user_id: string
        }
        Insert: {
          category: string
          id?: string
          level?: number
          user_id: string
        }
        Update: {
          category?: string
          id?: string
          level?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      achievement_category: "quests" | "streak" | "xp" | "gold" | "special"
      achievement_rarity: "common" | "rare" | "epic" | "legendary"
      app_role: "admin" | "user"
      bonus_type:
        | "critical_chance"
        | "daily_rush"
        | "rested_xp"
        | "better_bounties"
      goal_type: "quests" | "category_quests" | "xp" | "gold" | "streak"
      loot_type: "xp_boost" | "gold_boost" | "streak_protection"
      quest_priority: "low" | "medium" | "high"
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
    Enums: {
      achievement_category: ["quests", "streak", "xp", "gold", "special"],
      achievement_rarity: ["common", "rare", "epic", "legendary"],
      app_role: ["admin", "user"],
      bonus_type: [
        "critical_chance",
        "daily_rush",
        "rested_xp",
        "better_bounties",
      ],
      goal_type: ["quests", "category_quests", "xp", "gold", "streak"],
      loot_type: ["xp_boost", "gold_boost", "streak_protection"],
      quest_priority: ["low", "medium", "high"],
    },
  },
} as const
