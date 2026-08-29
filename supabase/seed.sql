-- ==============================================================================
-- AGRICX 237 - DONNÉES D'AMORÇAGE (SEED DATA)
-- ==============================================================================

-- 1. FOURNISSEURS INITIALS
INSERT INTO public.suppliers (id, business_name, owner_name, category, phone, whatsapp, region, city, address, rating, review_count)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'AquaBio Centre Cameroun', 'Dr. Paul Mbarga', 'Alevins & Géniteurs', '+237 677 12 34 56', '237677123456', 'Centre', 'Obala', 'Route Nationale 4, Sortie Obala', 4.9, 38),
  ('11111111-1111-1111-1111-111111111102', 'Provenderie des Hauts Plateaux', 'M. Emmanuel Tchakounte', 'Aliments & Provendes', '+237 699 88 77 66', '237699887766', 'Ouest', 'Bafoussam', 'Zone Industrielle de Bafoussam', 4.8, 54),
  ('11111111-1111-1111-1111-111111111103', 'Ferme Hélicicole Équatoriale', 'Mme. Solange Abena', 'Géniteurs Escargots', '+237 655 44 33 22', '237655443322', 'Centre', 'Yaoundé', 'Nkoabang, après le carrefour', 4.9, 29),
  ('11111111-1111-1111-1111-111111111104', 'AgriTech Littoral & Équipements', 'Ing. Fabrice Ndongo', 'Matériel & Bacs', '+237 670 11 22 33', '237670112233', 'Littoral', 'Douala', 'Yassa, Boulevard de l''Aviation', 4.7, 19),
  ('11111111-1111-1111-1111-111111111105', 'Couvoir Moderne du Noun', 'El Hadj Oumarou', 'Poussins & Accouvage', '+237 694 22 33 44', '237694223344', 'Ouest', 'Foumbot', 'Marché Central de Foumbot', 4.8, 42)
ON CONFLICT (id) DO NOTHING;

-- 2. FICHES TECHNIQUES INITIALES
INSERT INTO public.technical_articles (id, category, title, summary, content, tags, region, date_published)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'Pisciculture', 'Guide Complet : Élevage de Silures Clarias en Bacs Hors-Sol', 'Maîtriser la densité, le renouvellement de l''eau et la rentabilité d''un élevage de silures en milieu périurbain camerounais.', 'Le silure africain (Clarias gariepinus) est le poisson d''élevage le plus résistant et le plus rentable au Cameroun. Grâce à son organe respiratoire accessoire, il tolère des densités élevées (jusqu''à 100 à 150 kg/m³ en système intensif optimisé).\n\n1. Qualité de l''eau et Oxygénation : Température idéale entre 26°C et 30°C. pH stable entre 6.5 et 7.5. Renouveler 30% du volume tous les 2 jours.\n2. Nutrition et Rations : Aliment granulé flottant extrudé titrant au moins 42% de protéines au démarrage (0-4 semaines), puis 38% en grossissement.\n3. Prophylaxie et Salage : En cas de stress post-calibrage, bain de gros sel non iodé à 2 kg/m³.', ARRAY['Silure', 'Clarias', 'Bacs', 'Centre', 'Littoral'], 'Centre & Littoral', 'Janvier 2026'),
  ('22222222-2222-2222-2222-222222222202', 'Aviculture', 'Calendrier de Prophylaxie du Poulet de Chair au Cameroun', 'Protocole sanitaire complet jour par jour pour limiter le taux de mortalité en dessous de 3% sur 45 jours.', 'Semaine 1 (J1 à J7) : Chauffage à 32°C constant. Eau tiède sucrée (10g/L) à l''arrivée, puis anti-stress vitaminé. J5 : Vaccin Newcastle + Bronchite Infectieuse (HB1/Ma5 en goutte oculaire ou eau de boisson avec lait écrémé).\n\nSemaine 2 (J8 à J14) : J10 : Premier vaccin Gumboro (IBD intermédiaire). J12-J14 : Traitement anticoccidien préventif (Amprolium 20%).\n\nSemaine 3 (J15 à J21) : J16 : Rappel Newcastle (La Sota ou Cloné). J18 : Rappel Gumboro.\n\nSemaine 4 à 6 : Transition progressive vers la provende de finition (19% PB). Déparasitage interne à J30 avec Lévamisole.', ARRAY['Poulet', 'Vaccins', 'Prophylaxie', 'Gumboro'], 'Ouest & Centre', 'Février 2026'),
  ('22222222-2222-2222-2222-222222222203', 'Héliciculture', 'Démarrer un Élevage d''Escargots Géants d''Afrique (Achatines)', 'Protocole d''aménagement de fosses d''élevage, alimentation végétale riche en calcium et extraction de bave.', 'Archachatina marginata et Achatina achatina sont les deux espèces reines en zone forestière camerounaise.\n\n1. Logement : Escargotières en parpaings ou fosses ombragées avec substrat de terreau désinfecté (15 cm d''épaisseur) mélangé à du charbon de bois concassé.\n2. Humidité : Maintenir 80% à 90% d''hygrométrie par arrosage en pluie fine le soir.\n3. Alimentation : Feuilles de papayer, manioc doux, courge, et poudre de coquilles d''huîtres ou de calcaire agricole (15% de la ration pour la coquille).', ARRAY['Escargot', 'Achatine', 'Héliciculture', 'Cosmétique'], 'Sud & Centre', 'Février 2026')
ON CONFLICT (id) DO NOTHING;

-- 3. DOCUMENTS RAG INITIALS (POUR LE MODÈLE IA & RECHERCHE VECTORIELLE)
INSERT INTO public.rag_knowledge_documents (id, title, category, source, author)
VALUES
  ('33333333-3333-3333-3333-333333333301', 'Guide Vétérinaire & Zootechnique de la Pisciculture Continentale au Cameroun', 'Pisciculture', 'MINEPIA / CIRAD', 'Dr. J. Mve'),
  ('33333333-3333-3333-3333-333333333302', 'Manuel Pratique d''Aviculture Tropicale en Afrique Centrale', 'Aviculture', 'MINADER / FAO', 'Ing. P. Tcheuko')
ON CONFLICT (id) DO NOTHING;

-- 4. SEGMENTS DE CONNAISSANCES RAG (CHUNKS)
INSERT INTO public.rag_knowledge_chunks (document_id, category, content, chunk_index, metadata)
VALUES
  (
    '33333333-3333-3333-3333-333333333301',
    'Pisciculture',
    'Pathologie : Branchies pâles et apathie chez le silure Clarias gariepinus en bac. Causes fréquentes : Manque d''oxygène dissous (< 3 mg/L), intoxication aux nitrites (NO2 > 0.5 mg/L), ou anémie parasitaire. Protocole d''urgence : 1. Changement d''eau immédiat de 50%. 2. Arrêt du nourrissage 24h. 3. Sel non iodé à 1.5 kg/m3 d''eau. 4. Aération mécanique forcée.',
    1,
    '{"topic": "pathologie_silure", "symptomes": ["branchies_pales", "apathie"], "urgence": "haute"}'::JSONB
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    'Aviculture',
    'Pathologie : Coccidiose chez le poulet de chair (Eimeria tenella / acervulina). Symptômes : Fientes hémorragiques ou orangées, plumes ébouriffées, prostration autour des mangeoires. Protocole curatif : Amprolium hydrosoluble (1g par litre d''eau pendant 5 jours) ou Toltrazuril (Baycox 2.5%, 1ml par litre pendant 2 jours). Retirer la litière humide immédiatement et ajouter copeaux secs.',
    1,
    '{"topic": "coccidiose_poulet", "symptomes": ["fientes_rouges", "prostration"], "medicament": "Amprolium"}'::JSONB
  ),
  (
    '33333333-3333-3333-3333-333333333302',
    'Aviculture',
    'Formulation provende poulet démarrage 21% PB pour 100 kg : Maïs jaune moulu (55 kg), Tourteau de soja 46% (26 kg), Farine de poisson locale 60% (8 kg), Son de blé fin (6 kg), CMV 5% démarrage (4 kg), Huile de palme raffinée (1 kg). Distribuer ad libitum avec abreuvoirs à niveau constant.',
    2,
    '{"topic": "formulation_provende", "type": "demarrage", "proteines": 21}'::JSONB
  );
