CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    marque TEXT NOT NULL,
    modele TEXT NOT NULL,
    prix_fcfa INTEGER NOT NULL,
    images TEXT[] DEFAULT '{}'::text[] NOT NULL,
    type TEXT NOT NULL,
    tailles TEXT[] DEFAULT '{}'::text[] NOT NULL,
    couleur TEXT,
    description TEXT,
    disponible BOOLEAN DEFAULT true
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Lecture" ON public.products FOR SELECT USING (true);
CREATE POLICY "Insertion" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Suppression" ON public.products FOR DELETE USING (true);
CREATE POLICY "Mise à jour" ON public.products FOR UPDATE USING (true);
