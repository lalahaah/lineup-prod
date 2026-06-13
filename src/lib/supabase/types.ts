/**
 * Supabase Database Type Definitions
 * 
 * NOTE: This is a temporary file. Once the actual database is connected,
 * replace this file using the following command:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
 */

export interface Database {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          created_at: string
          name: string
          commission_rate: number
          plan_type: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          commission_rate?: number
          plan_type?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          commission_rate?: number
          plan_type?: string
        }
      }
      campaigns: {
        Row: {
          id: string
          created_at: string
          title: string
          client_id: string
          stage: string
          portal_token: string
          ship_date: string | null
          content_deadline: string | null
          upload_deadline: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          client_id: string
          stage?: string
          portal_token?: string
          ship_date?: string | null
          content_deadline?: string | null
          upload_deadline?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          client_id?: string
          stage?: string
          portal_token?: string
          ship_date?: string | null
          content_deadline?: string | null
          upload_deadline?: string | null
        }
      }
      influencers: {
        Row: {
          id: string
          created_at: string
          name: string
          handle: string
          followers: number
          fee: number
          categories: string[]
          auth_user_id: string | null
          is_public: boolean | null
          is_verified: boolean | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          handle: string
          followers?: number
          fee?: number
          categories?: string[]
          auth_user_id?: string | null
          is_public?: boolean | null
          is_verified?: boolean | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          handle?: string
          followers?: number
          fee?: number
          categories?: string[]
          auth_user_id?: string | null
          is_public?: boolean | null
          is_verified?: boolean | null
        }
      }
      campaign_influencers: {
        Row: {
          id: string
          created_at: string
          campaign_id: string
          influencer_id: string
          status: string
          access_token: string
          agreed_fee: number
          shipping_address: any | null
        }
        Insert: {
          id?: string
          created_at?: string
          campaign_id: string
          influencer_id: string
          status?: string
          access_token?: string
          agreed_fee?: number
          shipping_address?: any | null
        }
        Update: {
          id?: string
          created_at?: string
          campaign_id?: string
          influencer_id?: string
          status?: string
          access_token?: string
          agreed_fee?: number
          shipping_address?: any | null
        }
      }
      drafts: {
        Row: {
          id: string
          created_at: string
          campaign_influencer_id: string
          version: number
          status: string
          caption: string | null
          hashtags: string | null
          scheduled_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          campaign_influencer_id: string
          version?: number
          status?: string
          caption?: string | null
          hashtags?: string | null
          scheduled_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          campaign_influencer_id?: string
          version?: number
          status?: string
          caption?: string | null
          hashtags?: string | null
          scheduled_date?: string | null
        }
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
  }
}
