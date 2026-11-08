export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          icon_name: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          icon_name?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          icon_name?: string | null;
          created_at?: string;
        };
      };
      words: {
        Row: {
          id: string;
          slug: string;
          word: string;
          normalized_word: string;
          definition: string;
          speech_level: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          category_id: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          word: string;
          normalized_word: string;
          definition: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          category_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          word?: string;
          normalized_word?: string;
          definition?: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          category_id?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      word_translations: {
        Row: {
          id: string;
          word_id: string;
          translation: string;
          target_language: string;
          speech_level: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          word_id: string;
          translation: string;
          target_language?: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          word_id?: string;
          translation?: string;
          target_language?: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          notes?: string | null;
          created_at?: string;
        };
      };
      word_examples: {
        Row: {
          id: string;
          word_id: string;
          madurese_sentence: string;
          indonesian_translation: string;
          speech_level: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten' | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          word_id: string;
          madurese_sentence: string;
          indonesian_translation: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten' | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          word_id?: string;
          madurese_sentence?: string;
          indonesian_translation?: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten' | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: 'super_admin' | 'admin' | 'editor' | 'contributor' | 'user';
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'super_admin' | 'admin' | 'editor' | 'contributor' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          role?: 'super_admin' | 'admin' | 'editor' | 'contributor' | 'user';
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          word_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          word_id?: string;
          created_at?: string;
        };
      };
      contributions: {
        Row: {
          id: string;
          user_id: string | null;
          proposed_word: string;
          proposed_translation: string;
          speech_level: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          category_id: string | null;
          example: string | null;
          notes: string | null;
          status: 'pending' | 'under_review' | 'approved' | 'rejected';
          reviewed_by: string | null;
          review_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          proposed_word: string;
          proposed_translation: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          category_id?: string | null;
          example?: string | null;
          notes?: string | null;
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          reviewed_by?: string | null;
          review_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          proposed_word?: string;
          proposed_translation?: string;
          speech_level?: 'netral' | 'enja_iya' | 'engghi_enten' | 'engghi_bhunten';
          category_id?: string | null;
          example?: string | null;
          notes?: string | null;
          status?: 'pending' | 'under_review' | 'approved' | 'rejected';
          reviewed_by?: string | null;
          review_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      learning_articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string;
          category: string;
          thumbnail: string | null;
          status: string;
          author_id: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt?: string | null;
          content: string;
          category?: string;
          thumbnail?: string | null;
          status?: string;
          author_id?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string | null;
          content?: string;
          category?: string;
          thumbnail?: string | null;
          status?: string;
          author_id?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

