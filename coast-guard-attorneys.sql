-- Coast Guard Defense Service Offices (DSOs)
INSERT INTO attorneys (first_name, last_name, title, specialties, location, state, city, experience, rating, review_count, email, phone, bio, pricing_tier, hourly_rate, available_for_emergency, response_time) VALUES
('Defense Service Office', 'North (DSO North)', 'DSO North - Coast Guard Defense Counsel', 
 ARRAY['Court-martial defense', 'Administrative proceedings', 'NJP advice', 'UCMJ matters'], 
 'Washington, DC', 'DC', 'Washington', 'Government DSO', 5, 0, 
 'dsonorthdefense1@us.navy.mil', '(202) 685-5595', 
 'Provides military defense counsel for Coast Guard members in courts-martial (all levels) and administrative proceedings including administrative separation boards and Boards of Inquiry. Offers walk-in advice on UCMJ matters (NJPs, investigations, Article 31 rights) and serves as detailed counsel when eligible.',
 'free', 'No cost - Government provided', true, '< 4 hours'),

('Defense Service Office', 'Southeast (DSO Southeast)', 'DSO Southeast - Coast Guard Defense Counsel',
 ARRAY['Court-martial defense', 'Administrative actions', 'NJP advice', 'Separation boards'],
 'Norfolk, VA', 'VA', 'Norfolk', 'Government DSO', 5, 0,
 'dsose_persreps@navy.mil', '(757) 341-4469',
 'Offers Coast Guard personnel defense services for courts-martial and adverse administrative actions in the southeastern/Atlantic region. DSO SE attorneys regularly handle NJP (Captain''s Mast) advice, administrative separation boards, and court-martial defense. Servicing offices in Norfolk, Jacksonville, Mayport, Pensacola.',
 'free', 'No cost - Government provided', true, '< 4 hours'),

('Defense Service Office', 'West (DSO West)', 'DSO West - Coast Guard Defense Counsel',
 ARRAY['Court-martial defense', 'Administrative boards', 'Article 32 investigations', 'UCMJ matters'],
 'San Diego, CA', 'CA', 'San Diego', 'Government DSO', 5, 0,
 'navylegaldefensesw@navy.mil', '(619) 556-7539',
 'Provides defense counsel to Coast Guard and Navy members on the U.S. West Coast for courts-martial and administrative boards. Mission includes representation at court-martial trials, advice on Article 32 investigations, administrative separation hearings, and related UCMJ matters. Headquartered in San Diego with branch offices in Bremerton and Lemoore.',
 'free', 'No cost - Government provided', true, '< 4 hours'),

('Defense Service Office', 'Pacific (DSO Pacific)', 'DSO Pacific - Coast Guard Defense Counsel',
 ARRAY['Court-martial defense', 'NJP advice', 'Administrative separation', 'Appeals'],
 'Pearl Harbor, HI', 'HI', 'Pearl Harbor', 'Government DSO', 5, 0,
 'dsopacific_hawaii_walkins@us.navy.mil', '(808) 473-1400',
 'Delivers defense services for Coast Guard members across the Pacific Area (Hawaii, Guam, and forward-deployed commands). DSO Pacific handles court-martial defense, NJP advice, administrative separation boards, and appeals for servicemembers in its AOR. Headquartered in Yokosuka, Japan, with offices in Pearl Harbor, Guam, and Sasebo.',
 'free', 'No cost - Government provided', true, '< 4 hours'),

-- Coast Guard Civilian Defense Law Firms
('Gary Myers, Daniel Conway', '& Associates', 'Gary Myers, Daniel Conway & Associates',
 ARRAY['UCMJ defense', 'Court-martial defense', 'Discharge review boards', 'Administrative separation'],
 'Hampton, VA (serving nationwide)', 'VA', 'Hampton', '50+ years combined', 5, 0,
 'Contact via website form', '(757) 401-6365',
 'A long-established military defense firm (est. 1973) with 100+ years combined experience. The firm has defended virtually every UCMJ offense in Coast Guard and other services, providing aggressive court-martial defense as well as representation in discharge review boards, administrative separation boards, federal courts, and other military hearings. Team of ex-JAG attorneys handles cases worldwide.',
 'premium', 'Contact for rates', true, '< 2 hours'),

('Patrick J.', 'McLain', 'Law Office of Patrick J. McLain, PLLC',
 ARRAY['Court-martial defense', 'UCMJ violations', 'Administrative proceedings', 'Appeals'],
 'Washington, DC (multiple offices)', 'DC', 'Washington', '20+ years', 5, 0,
 'Contact via website form', '(888) 606-3385',
 'Led by a retired USMC military judge, Patrick McLain''s firm provides experienced defense for Coast Guard members facing serious charges. They handle courts-martial defense for all types of UCMJ violations (AWOL/desertion, drug offenses, fraud/larceny, sex offenses), as well as representation in administrative proceedings (NJP appeals, separation boards) and court-martial appeals. Nationwide practice with team of former JAG officers.',
 'premium', 'Contact for rates', true, '< 2 hours'),

('Richard V.', 'Stevens (Coast Guard)', 'Military Defense Law Offices of Richard V. Stevens, P.C.',
 ARRAY['Court-martial defense', 'Administrative discharge boards', 'NJP defense', 'Investigation advising'],
 'Navarre, FL (serves worldwide)', 'FL', 'Navarre', '25+ years', 5, 0,
 'Contact via website form', '(800) 988-0602',
 'Firm led by Richard Stevens (former Air Force JAG) exclusively defends Coast Guard and other military members in courts-martial and all military adverse actions. Practice areas include criminal trials (general/special court-martial), court-martial appeals and clemency petitions, administrative discharge boards, Boards of Inquiry, non-judicial punishment (NJP) defense, and investigation advising (CGIS, IG, command investigations). Stevens and his team travel worldwide to represent clients.',
 'premium', 'Contact for rates', true, '< 2 hours'),

('Nana', 'Knight', 'Knight Law (Nana Knight, Esq.)',
 ARRAY['Military criminal defense', 'Court-martial representation', 'Appeals', 'Rights protection'],
 'San Jose, CA', 'CA', 'San Jose', '15+ years', 5, 0,
 'info@knightjustice.com', '(408) 877-6177',
 'California-based firm focusing exclusively on military criminal defense, including Coast Guard cases. Knight Law defends service members at every stage of the court-martial process – from initial investigations through trial and appeals. Key practice areas include court-martial representation (for charges ranging from minor UCMJ violations to serious felonies), court-martial appeals, and protection of service members'' rights (challenging unlawful command influence, improper searches, etc.). Founder is board-certified criminal law specialist.',
 'standard', 'Contact for rates', true, '< 4 hours'),

('Tim', 'Bilecki', 'Bilecki Law Group, PLLC',
 ARRAY['Court-martial trial defense', 'Military jury trials', 'Pre-trial investigations', 'Article 32 hearings'],
 'Tampa, FL (handles Pacific cases)', 'FL', 'Tampa', '20+ years', 5, 0,
 'tbilecki@bileckilawgroup.com', '(813) 669-3500',
 'A boutique military defense firm specializing in court-martial trial defense. Led by Tim Bilecki, a prominent court-martial attorney, the firm is known for aggressive at-trial representation. Bilecki Law Group has 20+ years of experience and has handled hundreds of cases (with over 250 verdicts) worldwide. They focus on winning military jury trials, while also providing counsel for pre-trial investigations, Article 32 hearings, and administrative disciplinary actions. Originated in Hawaii and frequently defends Coast Guard members across the Pacific.',
 'premium', 'Contact for rates', true, '< 2 hours'),

('Court & Carpenter', 'Law Offices', 'Law Offices of Court & Carpenter, P.C.',
 ARRAY['UCMJ cases', 'Administrative Separation Boards', 'Boards of Inquiry', 'Security clearance defense'],
 'Seattle, WA', 'WA', 'Seattle', '15+ years', 5, 0,
 'Contact via website', '(206) 357-8434',
 'A military-only defense firm that has defended Coast Guard members and other servicemembers since 2008. Court & Carpenter specializes in UCMJ cases, including courts-martial, as well as Administrative Separation Boards, Boards of Inquiry, and security clearance defense. The firm''s attorneys (Stephen Carpenter, David Court, both former JAGs) have achieved favorable outcomes for Coast Guard clients – full acquittals and retention outcomes in courts-martial and board hearings. With offices in Seattle and Washington D.C., they provide nationwide representation.',
 'standard', 'Contact for rates', true, '< 4 hours');