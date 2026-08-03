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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          actor_name: string | null
          actor_type: string
          campaign_id: string
          created_at: string
          description: string
          id: string
          metadata: Json | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Insert: {
          actor_name?: string | null
          actor_type: string
          campaign_id: string
          created_at?: string
          description: string
          id?: string
          metadata?: Json | null
          type: Database["public"]["Enums"]["activity_type"]
        }
        Update: {
          actor_name?: string | null
          actor_type?: string
          campaign_id?: string
          created_at?: string
          description?: string
          id?: string
          metadata?: Json | null
          type?: Database["public"]["Enums"]["activity_type"]
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "priority_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      agencies: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          plan: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          plan?: string
          slug?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          plan?: string
          slug?: string
        }
        Relationships: []
      }
      campaign_influencers: {
        Row: {
          access_token: string
          agency_comment: string | null
          campaign_id: string
          created_at: string
          delivered_at: string | null
          final_fee: number | null
          id: string
          influencer_id: string
          performance: Json | null
          proposed_fee: number | null
          rejection_reason: string | null
          shipped_at: string | null
          shipping_address: Json | null
          shipping_status: Database["public"]["Enums"]["shipping_status"]
          status: Database["public"]["Enums"]["ci_status"]
          tracking_number: string | null
          updated_at: string
          upload_url: string | null
          uploaded_at: string | null
        }
        Insert: {
          access_token?: string
          agency_comment?: string | null
          campaign_id: string
          created_at?: string
          delivered_at?: string | null
          final_fee?: number | null
          id?: string
          influencer_id: string
          performance?: Json | null
          proposed_fee?: number | null
          rejection_reason?: string | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_status?: Database["public"]["Enums"]["shipping_status"]
          status?: Database["public"]["Enums"]["ci_status"]
          tracking_number?: string | null
          updated_at?: string
          upload_url?: string | null
          uploaded_at?: string | null
        }
        Update: {
          access_token?: string
          agency_comment?: string | null
          campaign_id?: string
          created_at?: string
          delivered_at?: string | null
          final_fee?: number | null
          id?: string
          influencer_id?: string
          performance?: Json | null
          proposed_fee?: number | null
          rejection_reason?: string | null
          shipped_at?: string | null
          shipping_address?: Json | null
          shipping_status?: Database["public"]["Enums"]["shipping_status"]
          status?: Database["public"]["Enums"]["ci_status"]
          tracking_number?: string | null
          updated_at?: string
          upload_url?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_influencers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_influencers_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "priority_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_influencers_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_influencers_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          agency_id: string | null
          assignee_id: string | null
          attachment_urls: string[]
          brief: string | null
          budget: number | null
          categories: string[]
          channels: Database["public"]["Enums"]["channel_type"][]
          client_id: string
          content_deadline: string | null
          created_at: string
          goal: Database["public"]["Enums"]["campaign_goal"]
          id: string
          influencer_count_target: number
          name: string
          portal_token: string
          product_description: string | null
          product_name: string
          restrictions: string | null
          ship_date: string | null
          stage: Database["public"]["Enums"]["campaign_stage"]
          updated_at: string
          upload_deadline: string | null
        }
        Insert: {
          agency_id?: string | null
          assignee_id?: string | null
          attachment_urls?: string[]
          brief?: string | null
          budget?: number | null
          categories?: string[]
          channels?: Database["public"]["Enums"]["channel_type"][]
          client_id: string
          content_deadline?: string | null
          created_at?: string
          goal?: Database["public"]["Enums"]["campaign_goal"]
          id?: string
          influencer_count_target?: number
          name: string
          portal_token?: string
          product_description?: string | null
          product_name: string
          restrictions?: string | null
          ship_date?: string | null
          stage?: Database["public"]["Enums"]["campaign_stage"]
          updated_at?: string
          upload_deadline?: string | null
        }
        Update: {
          agency_id?: string | null
          assignee_id?: string | null
          attachment_urls?: string[]
          brief?: string | null
          budget?: number | null
          categories?: string[]
          channels?: Database["public"]["Enums"]["channel_type"][]
          client_id?: string
          content_deadline?: string | null
          created_at?: string
          goal?: Database["public"]["Enums"]["campaign_goal"]
          id?: string
          influencer_count_target?: number
          name?: string
          portal_token?: string
          product_description?: string | null
          product_name?: string
          restrictions?: string | null
          ship_date?: string | null
          stage?: Database["public"]["Enums"]["campaign_stage"]
          updated_at?: string
          upload_deadline?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaigns_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          auth_user_id: string | null
          commission_rate: number
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          id: string
          industry: string | null
          is_active: boolean
          name: string
          notes: string | null
          plan_type: string
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          commission_rate?: number
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          is_active?: boolean
          name: string
          notes?: string | null
          plan_type?: string
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          commission_rate?: number
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          is_active?: boolean
          name?: string
          notes?: string | null
          plan_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_logs: {
        Row: {
          body: string | null
          campaign_id: string | null
          direction: Database["public"]["Enums"]["contact_direction"]
          id: string
          influencer_id: string
          sent_at: string
          sent_by: string | null
          subject: string | null
          template_id: string | null
          type: Database["public"]["Enums"]["contact_type"]
        }
        Insert: {
          body?: string | null
          campaign_id?: string | null
          direction?: Database["public"]["Enums"]["contact_direction"]
          id?: string
          influencer_id: string
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
          template_id?: string | null
          type?: Database["public"]["Enums"]["contact_type"]
        }
        Update: {
          body?: string | null
          campaign_id?: string | null
          direction?: Database["public"]["Enums"]["contact_direction"]
          id?: string
          influencer_id?: string
          sent_at?: string
          sent_by?: string | null
          subject?: string | null
          template_id?: string | null
          type?: Database["public"]["Enums"]["contact_type"]
        }
        Relationships: [
          {
            foreignKeyName: "contact_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "priority_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencer_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_influencer_id_fkey"
            columns: ["influencer_id"]
            isOneToOne: false
            referencedRelation: "influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_logs_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      draft_feedbacks: {
        Row: {
          author_name: string | null
          author_type: string
          content: string
          created_at: string
          draft_id: string
          id: string
        }
        Insert: {
          author_name?: string | null
          author_type: string
          content: string
          created_at?: string
          draft_id: string
          id?: string
        }
        Update: {
          author_name?: string | null
          author_type?: string
          content?: string
          created_at?: string
          draft_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "draft_feedbacks_draft_id_fkey"
            columns: ["draft_id"]
            isOneToOne: false
            referencedRelation: "drafts"
            referencedColumns: ["id"]
          },
        ]
      }
      drafts: {
        Row: {
          campaign_influencer_id: string
          caption: string | null
          created_at: string
          file_urls: string[]
          hashtags: string | null
          id: string
          note: string | null
          planned_upload_at: string | null
          status: Database["public"]["Enums"]["draft_status"]
          submitted_at: string
          version: number
        }
        Insert: {
          campaign_influencer_id: string
          caption?: string | null
          created_at?: string
          file_urls?: string[]
          hashtags?: string | null
          id?: string
          note?: string | null
          planned_upload_at?: string | null
          status?: Database["public"]["Enums"]["draft_status"]
          submitted_at?: string
          version?: number
        }
        Update: {
          campaign_influencer_id?: string
          caption?: string | null
          created_at?: string
          file_urls?: string[]
          hashtags?: string | null
          id?: string
          note?: string | null
          planned_upload_at?: string | null
          status?: Database["public"]["Enums"]["draft_status"]
          submitted_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "drafts_campaign_influencer_id_fkey"
            columns: ["campaign_influencer_id"]
            isOneToOne: false
            referencedRelation: "campaign_influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          is_active?: boolean
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      influencers: {
        Row: {
          auth_user_id: string | null
          avg_engagement: Json
          bio: string | null
          blacklist_reason: string | null
          categories: string[]
          channel_handles?: Json
          channel_urls: Json
          collab_count: number
          created_at: string
          email: string | null
          fee_max: number | null
          fee_min: number | null
          followers: Json
          gender: Database["public"]["Enums"]["influencer_gender"] | null
          handle: string | null
          id: string
          is_blacklisted: boolean
          is_public: boolean
          is_verified: boolean
          joined_at: string | null
          media_kit_url: string | null
          name: string
          notes: string | null
          past_brands: string[]
          phone: string | null
          primary_channel: Database["public"]["Enums"]["channel_type"] | null
          region: string | null
          response_rate: number | null
          updated_at: string
        }
        Insert: {
          auth_user_id?: string | null
          avg_engagement?: Json
          bio?: string | null
          blacklist_reason?: string | null
          categories?: string[]
          channel_handles?: Json
          channel_urls?: Json
          collab_count?: number
          created_at?: string
          email?: string | null
          fee_max?: number | null
          fee_min?: number | null
          followers?: Json
          gender?: Database["public"]["Enums"]["influencer_gender"] | null
          handle?: string | null
          id?: string
          is_blacklisted?: boolean
          is_public?: boolean
          is_verified?: boolean
          joined_at?: string | null
          media_kit_url?: string | null
          name: string
          notes?: string | null
          past_brands?: string[]
          phone?: string | null
          primary_channel?: Database["public"]["Enums"]["channel_type"] | null
          region?: string | null
          response_rate?: number | null
          updated_at?: string
        }
        Update: {
          auth_user_id?: string | null
          avg_engagement?: Json
          bio?: string | null
          blacklist_reason?: string | null
          categories?: string[]
          channel_urls?: Json
          collab_count?: number
          created_at?: string
          email?: string | null
          fee_max?: number | null
          fee_min?: number | null
          followers?: Json
          gender?: Database["public"]["Enums"]["influencer_gender"] | null
          handle?: string | null
          id?: string
          is_blacklisted?: boolean
          is_public?: boolean
          is_verified?: boolean
          joined_at?: string | null
          media_kit_url?: string | null
          name?: string
          notes?: string | null
          past_brands?: string[]
          phone?: string | null
          primary_channel?: Database["public"]["Enums"]["channel_type"] | null
          region?: string | null
          response_rate?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          campaign_id: string
          client_id: string
          commission: number
          commission_rate: number
          created_at: string
          created_by: string | null
          due_date: string | null
          id: string
          issued_at: string | null
          line_items: Json
          notes: string | null
          paid_at: string | null
          pdf_url: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          total: number
          updated_at: string
          vat: number
        }
        Insert: {
          campaign_id: string
          client_id: string
          commission: number
          commission_rate: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          issued_at?: string | null
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal: number
          total: number
          updated_at?: string
          vat: number
        }
        Update: {
          campaign_id?: string
          client_id?: string
          commission?: number
          commission_rate?: number
          created_at?: string
          created_by?: string | null
          due_date?: string | null
          id?: string
          issued_at?: string | null
          line_items?: Json
          notes?: string | null
          paid_at?: string | null
          pdf_url?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal?: number
          total?: number
          updated_at?: string
          vat?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "priority_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          campaign_influencer_id: string
          created_at: string
          id: string
          invoice_id: string | null
          notes: string | null
          paid_at: string | null
          status: Database["public"]["Enums"]["payment_status"]
          tax_invoice_received: boolean
          updated_at: string
        }
        Insert: {
          amount: number
          campaign_influencer_id: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tax_invoice_received?: boolean
          updated_at?: string
        }
        Update: {
          amount?: number
          campaign_influencer_id?: string
          created_at?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"]
          tax_invoice_received?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_campaign_influencer_id_fkey"
            columns: ["campaign_influencer_id"]
            isOneToOne: false
            referencedRelation: "campaign_influencers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          agency_id: string | null
          amount: number
          billing_cycle: string
          cancelled_at: string | null
          client_id: string | null
          id: string
          next_billing_at: string | null
          plan: string
          started_at: string
          status: string
          toss_billing_key: string | null
        }
        Insert: {
          agency_id?: string | null
          amount: number
          billing_cycle?: string
          cancelled_at?: string | null
          client_id?: string | null
          id?: string
          next_billing_at?: string | null
          plan: string
          started_at?: string
          status?: string
          toss_billing_key?: string | null
        }
        Update: {
          agency_id?: string | null
          amount?: number
          billing_cycle?: string
          cancelled_at?: string | null
          client_id?: string | null
          id?: string
          next_billing_at?: string | null
          plan?: string
          started_at?: string
          status?: string
          toss_billing_key?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      transaction_fees: {
        Row: {
          base_amount: number
          campaign_influencer_id: string | null
          created_at: string
          fee_amount: number
          fee_rate: number | null
          id: string
          status: string
        }
        Insert: {
          base_amount: number
          campaign_influencer_id?: string | null
          created_at?: string
          fee_amount: number
          fee_rate?: number | null
          id?: string
          status?: string
        }
        Update: {
          base_amount?: number
          campaign_influencer_id?: string | null
          created_at?: string
          fee_amount?: number
          fee_rate?: number | null
          id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "transaction_fees_campaign_influencer_id_fkey"
            columns: ["campaign_influencer_id"]
            isOneToOne: false
            referencedRelation: "campaign_influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          agency_id: string | null
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          agency_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          agency_id?: string | null
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_agency_id_fkey"
            columns: ["agency_id"]
            isOneToOne: false
            referencedRelation: "agencies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      influencer_stats: {
        Row: {
          avg_final_fee: number | null
          collab_count: number | null
          confirmed_campaigns: number | null
          handle: string | null
          id: string | null
          is_blacklisted: boolean | null
          name: string | null
          primary_channel: Database["public"]["Enums"]["channel_type"] | null
          response_rate: number | null
          total_campaigns: number | null
        }
        Relationships: []
      }
      monthly_revenue: {
        Row: {
          client_name: string | null
          invoice_count: number | null
          month: string | null
          total_commission: number | null
          total_revenue: number | null
        }
        Relationships: []
      }
      priority_campaigns: {
        Row: {
          assignee_id: string | null
          assignee_name: string | null
          campaign_name: string | null
          client_name: string | null
          content_deadline: string | null
          days_until_deadline: number | null
          id: string | null
          stage: Database["public"]["Enums"]["campaign_stage"] | null
          upload_deadline: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      activity_type:
        | "campaign_created"
        | "stage_changed"
        | "influencer_added"
        | "influencer_status_changed"
        | "outreach_sent"
        | "draft_submitted"
        | "draft_approved"
        | "draft_revision_requested"
        | "client_selected"
        | "shipping_updated"
        | "invoice_created"
        | "payment_sent"
      campaign_goal: "awareness" | "review" | "conversion"
      campaign_stage:
        | "briefing"
        | "search"
        | "proposal"
        | "selection"
        | "outreach"
        | "shipping"
        | "review"
        | "uploaded"
        | "billing"
        | "completed"
      channel_type:
        | "instagram"
        | "youtube"
        | "tiktok"
        | "blog"
        | "naver_tv"
        | "threads"
      ci_status:
        | "candidate"
        | "proposed"
        | "selected"
        | "passed"
        | "outreached"
        | "confirmed"
        | "rejected"
        | "blackout"
      contact_direction: "outbound" | "inbound"
      contact_type: "email" | "dm" | "phone" | "platform"
      draft_status:
        | "submitted"
        | "agency_reviewing"
        | "agency_approved"
        | "client_reviewing"
        | "client_approved"
        | "revision_requested"
        | "rejected"
      influencer_gender: "female" | "male" | "other"
      invoice_status: "draft" | "sent" | "paid"
      payment_status: "pending" | "paid"
      shipping_status:
        | "pending"
        | "preparing"
        | "shipped"
        | "in_transit"
        | "delivered"
      user_role: "admin" | "manager"
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
      activity_type: [
        "campaign_created",
        "stage_changed",
        "influencer_added",
        "influencer_status_changed",
        "outreach_sent",
        "draft_submitted",
        "draft_approved",
        "draft_revision_requested",
        "client_selected",
        "shipping_updated",
        "invoice_created",
        "payment_sent",
      ],
      campaign_goal: ["awareness", "review", "conversion"],
      campaign_stage: [
        "briefing",
        "search",
        "proposal",
        "selection",
        "outreach",
        "shipping",
        "review",
        "uploaded",
        "billing",
        "completed",
      ],
      channel_type: [
        "instagram",
        "youtube",
        "tiktok",
        "blog",
        "naver_tv",
        "threads",
      ],
      ci_status: [
        "candidate",
        "proposed",
        "selected",
        "passed",
        "outreached",
        "confirmed",
        "rejected",
        "blackout",
      ],
      contact_direction: ["outbound", "inbound"],
      contact_type: ["email", "dm", "phone", "platform"],
      draft_status: [
        "submitted",
        "agency_reviewing",
        "agency_approved",
        "client_reviewing",
        "client_approved",
        "revision_requested",
        "rejected",
      ],
      influencer_gender: ["female", "male", "other"],
      invoice_status: ["draft", "sent", "paid"],
      payment_status: ["pending", "paid"],
      shipping_status: [
        "pending",
        "preparing",
        "shipped",
        "in_transit",
        "delivered",
      ],
      user_role: ["admin", "manager"],
    },
  },
} as const
