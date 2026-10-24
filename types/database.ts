/**
 * Database types for Maison Noir.
 *
 * Hand written to match `supabase/migration.sql`.
 *
 * Usage:
 *   import type { Database } from "@/types/database";
 *   const supabase = createServerClient<Database>(...);
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProductGender = "men" | "women" | "unisex";
export type ProductConcentration = "EDP" | "EDT" | "Parfum" | "Extrait";
export type CouponType = "percent" | "fixed";
export type PaymentMethod = "cod" | "paymob";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus =
  | "new"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type CreateOrderItem = {
  variant_id: string;
  quantity: number;
};

export type CreateOrderArgs = {
  p_items: Json;
  p_customer_name: string;
  p_email: string;
  p_phone: string;
  p_governorate: string;
  p_city?: string | null;
  p_address?: string | null;
  p_notes?: string | null;
  p_coupon_code?: string | null;
  p_payment_method?: string | null;
};

export type CreateOrderResult = {
  order_id: string;
  order_number: string;
  subtotal: number;
  shipping_fee: number;
  discount: number;
  total: number;
  payment_method: string;
  status: string;
};

export type Database = {
  public: {
    Tables: {
      site_settings: {
        Row: {
          id: boolean;
          store_name: string;
          tagline: string | null;
          logo_url: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          instagram: string | null;
          facebook: string | null;
          tiktok: string | null;
          footer_text: string | null;
          free_shipping_threshold: number | null;
          seo_title: string | null;
          seo_description: string | null;
        };
        Insert: {
          id?: boolean;
          store_name?: string;
          tagline?: string | null;
          logo_url?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          tiktok?: string | null;
          footer_text?: string | null;
          free_shipping_threshold?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Update: {
          id?: boolean;
          store_name?: string;
          tagline?: string | null;
          logo_url?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          address?: string | null;
          instagram?: string | null;
          facebook?: string | null;
          tiktok?: string | null;
          footer_text?: string | null;
          free_shipping_threshold?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
        };
        Relationships: [];
      };

      hero: {
        Row: {
          id: boolean;
          headline: string;
          subheadline: string | null;
          image_url: string | null;
          cta_label: string | null;
          cta_link: string | null;
        };
        Insert: {
          id?: boolean;
          headline: string;
          subheadline?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_link?: string | null;
        };
        Update: {
          id?: boolean;
          headline?: string;
          subheadline?: string | null;
          image_url?: string | null;
          cta_label?: string | null;
          cta_link?: string | null;
        };
        Relationships: [];
      };

      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          sort_order: number;
          is_visible: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_visible?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          sort_order?: number;
          is_visible?: boolean;
        };
        Relationships: [];
      };

      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          brand: string | null;
          description: string | null;
          gender: ProductGender;
          concentration: ProductConcentration;
          top_notes: string[];
          heart_notes: string[];
          base_notes: string[];
          scent_family: string | null;
          cover_image_url: string | null;
          is_featured: boolean;
          is_new: boolean;
          is_visible: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          brand?: string | null;
          description?: string | null;
          gender?: ProductGender;
          concentration?: ProductConcentration;
          top_notes?: string[];
          heart_notes?: string[];
          base_notes?: string[];
          scent_family?: string | null;
          cover_image_url?: string | null;
          is_featured?: boolean;
          is_new?: boolean;
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          brand?: string | null;
          description?: string | null;
          gender?: ProductGender;
          concentration?: ProductConcentration;
          top_notes?: string[];
          heart_notes?: string[];
          base_notes?: string[];
          scent_family?: string | null;
          cover_image_url?: string | null;
          is_featured?: boolean;
          is_new?: boolean;
          is_visible?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };

      product_variants: {
        Row: {
          id: string;
          product_id: string;
          size_ml: number;
          price: number;
          compare_at_price: number | null;
          stock: number;
          sku: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          size_ml: number;
          price: number;
          compare_at_price?: number | null;
          stock?: number;
          sku: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          size_ml?: number;
          price?: number;
          compare_at_price?: number | null;
          stock?: number;
          sku?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };

      product_images: {
        Row: {
          id: string;
          product_id: string;
          image_url: string;
          sort_order: number;
        };
        Insert: {
          id?: string;
          product_id: string;
          image_url: string;
          sort_order?: number;
        };
        Update: {
          id?: string;
          product_id?: string;
          image_url?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };

      product_collections: {
        Row: {
          product_id: string;
          collection_id: string;
        };
        Insert: {
          product_id: string;
          collection_id: string;
        };
        Update: {
          product_id?: string;
          collection_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "product_collections_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };

      shipping_zones: {
        Row: {
          id: string;
          governorate: string;
          fee: number;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          governorate: string;
          fee?: number;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          governorate?: string;
          fee?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };

      coupons: {
        Row: {
          id: string;
          code: string;
          type: CouponType;
          value: number;
          min_order: number | null;
          max_uses: number | null;
          used_count: number;
          expires_at: string | null;
          is_active: boolean;
        };
        Insert: {
          id?: string;
          code: string;
          type: CouponType;
          value: number;
          min_order?: number | null;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          code?: string;
          type?: CouponType;
          value?: number;
          min_order?: number | null;
          max_uses?: number | null;
          used_count?: number;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };

      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_name: string;
          email: string;
          phone: string;
          governorate: string;
          city: string | null;
          address: string;
          notes: string | null;
          payment_method: PaymentMethod;
          payment_status: PaymentStatus;
          status: OrderStatus;
          subtotal: number;
          shipping_fee: number;
          discount: number;
          total: number;
          coupon_code: string | null;
          paymob_order_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_name: string;
          email: string;
          phone: string;
          governorate: string;
          city?: string | null;
          address: string;
          notes?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          status?: OrderStatus;
          subtotal?: number;
          shipping_fee?: number;
          discount?: number;
          total?: number;
          coupon_code?: string | null;
          paymob_order_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          governorate?: string;
          city?: string | null;
          address?: string;
          notes?: string | null;
          payment_method?: PaymentMethod;
          payment_status?: PaymentStatus;
          status?: OrderStatus;
          subtotal?: number;
          shipping_fee?: number;
          discount?: number;
          total?: number;
          coupon_code?: string | null;
          paymob_order_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };

      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string | null;
          variant_id: string | null;
          product_name: string;
          size_ml: number;
          unit_price: number;
          quantity: number;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name: string;
          size_ml: number;
          unit_price: number;
          quantity: number;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string | null;
          variant_id?: string | null;
          product_name?: string;
          size_ml?: number;
          unit_price?: number;
          quantity?: number;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };

      inquiries: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message: string;
          created_at: string;
          is_read: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message: string;
          created_at?: string;
          is_read?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message?: string;
          created_at?: string;
          is_read?: boolean;
        };
        Relationships: [];
      };

      admins: {
        Row: {
          user_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };

      login_attempts: {
        Row: {
          id: number;
          ip: string;
          created_at: string;
        };
        Insert: {
          id?: never;
          ip: string;
          created_at?: string;
        };
        Update: {
          id?: never;
          ip?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      create_order: {
        Args: CreateOrderArgs;
        Returns: Json;
      };
    };

    Enums: {
      product_gender: ProductGender;
      product_concentration: ProductConcentration;
      coupon_type: CouponType;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
      order_status: OrderStatus;
    };

    CompositeTypes: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
