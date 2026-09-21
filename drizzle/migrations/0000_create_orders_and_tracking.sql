CREATE TABLE public.store_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  gateway_name text NOT NULL DEFAULT 'Escama Black',
  payment_link_url text,
  max_installments integer NOT NULL DEFAULT 12,
  whatsapp text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_code text NOT NULL UNIQUE,
  customer_name text NOT NULL,
  cpf_digits text NOT NULL,
  phone_digits text NOT NULL,
  zip text NOT NULL,
  state text NOT NULL,
  city text NOT NULL,
  district text NOT NULL,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  amount_cents integer NOT NULL DEFAULT 1299,
  installments integer NOT NULL DEFAULT 1,
  payment_status text NOT NULL DEFAULT 'pendente',
  payment_link_url text,
  tracking_code text,
  shipping_status text NOT NULL DEFAULT 'Aguardando pagamento',
  carrier text,
  estimated_delivery date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX orders_phone_idx ON public.orders (phone_digits);
CREATE INDEX orders_tracking_idx ON public.orders (tracking_code);

CREATE TABLE public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  happened_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_events_order_idx ON public.order_events (order_id, happened_at);

GRANT ALL ON public.store_settings TO service_role;
GRANT ALL ON public.orders TO service_role;
GRANT ALL ON public.order_events TO service_role;

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

INSERT INTO public.store_settings (id) VALUES (true);
