export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          role?: string
          created_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: boolean
          hero_line1: string | null
          hero_line2: string | null
          hero_subtitle: string | null
          hero_image: string | null
          socials: Record<string, string> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: boolean
          hero_line1?: string | null
          hero_line2?: string | null
          hero_subtitle?: string | null
          hero_image?: string | null
          socials?: Record<string, string> | null
        }
        Update: {
          hero_line1?: string | null
          hero_line2?: string | null
          hero_subtitle?: string | null
          hero_image?: string | null
          socials?: Record<string, string> | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          id: string
          storage_path: string
          width: number | null
          height: number | null
          alt_text: string
          tags: string[]
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          storage_path: string
          width?: number | null
          height?: number | null
          alt_text?: string
          tags?: string[]
          uploaded_by?: string | null
        }
        Update: {
          storage_path?: string
          width?: number | null
          height?: number | null
          alt_text?: string
          tags?: string[]
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          slug: string
          title: string
          excerpt: string
          body: string
          cover_image: string | null
          tags: string[]
          author_id: string | null
          published: boolean
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          excerpt?: string
          body?: string
          cover_image?: string | null
          tags?: string[]
          author_id?: string | null
          published?: boolean
          published_at?: string | null
        }
        Update: {
          slug?: string
          title?: string
          excerpt?: string
          body?: string
          cover_image?: string | null
          tags?: string[]
          published?: boolean
          published_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'posts_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      subscribers: {
        Row: {
          id: string
          email: string
          source: string
          status: string
          confirm_token: string
          consent_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string
          status?: string
          confirm_token?: string
        }
        Update: {
          email?: string
          source?: string
          status?: string
          consent_at?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
