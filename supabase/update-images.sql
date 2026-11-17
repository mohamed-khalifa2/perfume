-- One-off cleanup: replace the original random picsum placeholders with
-- curated, fragrance-specific Pexels images. Safe to re-run: it only
-- touches rows that still point at picsum.photos, so admin-uploaded
-- images (Supabase Storage URLs) are never overwritten.

begin;

-- Hero and collection cards
update public.hero
set image_url = 'https://images.pexels.com/photos/11517300/pexels-photo-11517300.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop'
where image_url like '%picsum.photos%';

update public.collections set image_url = 'https://images.pexels.com/photos/32645074/pexels-photo-32645074.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop' where slug = 'men' and image_url like '%picsum.photos%';
update public.collections set image_url = 'https://images.pexels.com/photos/32630385/pexels-photo-32630385.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop' where slug = 'women' and image_url like '%picsum.photos%';
update public.collections set image_url = 'https://images.pexels.com/photos/13875783/pexels-photo-13875783.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop' where slug = 'unisex' and image_url like '%picsum.photos%';
update public.collections set image_url = 'https://images.pexels.com/photos/35930230/pexels-photo-35930230.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop' where slug = 'best-sellers' and image_url like '%picsum.photos%';

-- oud-noir
update public.products set cover_image_url = 'https://images.pexels.com/photos/11482468/pexels-photo-11482468.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'oud-noir' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/11482468/pexels-photo-11482468.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'oud-noir') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/30618765/pexels-photo-30618765.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'oud-noir') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/15096784/pexels-photo-15096784.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'oud-noir') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/38721543/pexels-photo-38721543.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'oud-noir') and sort_order = 3 and image_url like '%picsum.photos%';

-- velours-rouge
update public.products set cover_image_url = 'https://images.pexels.com/photos/5994299/pexels-photo-5994299.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'velours-rouge' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/5994299/pexels-photo-5994299.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'velours-rouge') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12556542/pexels-photo-12556542.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'velours-rouge') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/35806941/pexels-photo-35806941.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'velours-rouge') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/4735908/pexels-photo-4735908.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'velours-rouge') and sort_order = 3 and image_url like '%picsum.photos%';

-- blanc-de-nuit
update public.products set cover_image_url = 'https://images.pexels.com/photos/12402366/pexels-photo-12402366.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'blanc-de-nuit' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12402366/pexels-photo-12402366.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'blanc-de-nuit') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/13875783/pexels-photo-13875783.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'blanc-de-nuit') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/10688062/pexels-photo-10688062.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'blanc-de-nuit') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/16239693/pexels-photo-16239693.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'blanc-de-nuit') and sort_order = 3 and image_url like '%picsum.photos%';

-- amber-empress
update public.products set cover_image_url = 'https://images.pexels.com/photos/12456259/pexels-photo-12456259.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'amber-empress' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12456259/pexels-photo-12456259.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'amber-empress') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450399/pexels-photo-8450399.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'amber-empress') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450228/pexels-photo-8450228.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'amber-empress') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12456274/pexels-photo-12456274.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'amber-empress') and sort_order = 3 and image_url like '%picsum.photos%';

-- desert-santal
update public.products set cover_image_url = 'https://images.pexels.com/photos/32817141/pexels-photo-32817141.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'desert-santal' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/32817141/pexels-photo-32817141.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'desert-santal') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/15096784/pexels-photo-15096784.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'desert-santal') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/34051737/pexels-photo-34051737.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'desert-santal') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/4735929/pexels-photo-4735929.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'desert-santal') and sort_order = 3 and image_url like '%picsum.photos%';

-- cairo-nights
update public.products set cover_image_url = 'https://images.pexels.com/photos/11216321/pexels-photo-11216321.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'cairo-nights' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/11216321/pexels-photo-11216321.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'cairo-nights') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/7850600/pexels-photo-7850600.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'cairo-nights') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/21926655/pexels-photo-21926655.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'cairo-nights') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/21926651/pexels-photo-21926651.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'cairo-nights') and sort_order = 3 and image_url like '%picsum.photos%';

-- tobacco-noir
update public.products set cover_image_url = 'https://images.pexels.com/photos/30981935/pexels-photo-30981935.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'tobacco-noir' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/30981935/pexels-photo-30981935.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'tobacco-noir') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/39179564/pexels-photo-39179564.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'tobacco-noir') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12456283/pexels-photo-12456283.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'tobacco-noir') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450345/pexels-photo-8450345.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'tobacco-noir') and sort_order = 3 and image_url like '%picsum.photos%';

-- fig-and-cedar
update public.products set cover_image_url = 'https://images.pexels.com/photos/33295344/pexels-photo-33295344.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'fig-and-cedar' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/33295344/pexels-photo-33295344.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'fig-and-cedar') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450212/pexels-photo-8450212.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'fig-and-cedar') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450391/pexels-photo-8450391.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'fig-and-cedar') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450354/pexels-photo-8450354.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'fig-and-cedar') and sort_order = 3 and image_url like '%picsum.photos%';

-- rose-ivoire
update public.products set cover_image_url = 'https://images.pexels.com/photos/10786706/pexels-photo-10786706.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'rose-ivoire' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/10786706/pexels-photo-10786706.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'rose-ivoire') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/30405427/pexels-photo-30405427.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'rose-ivoire') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450391/pexels-photo-8450391.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'rose-ivoire') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/16266295/pexels-photo-16266295.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'rose-ivoire') and sort_order = 3 and image_url like '%picsum.photos%';

-- myrrh-royale
update public.products set cover_image_url = 'https://images.pexels.com/photos/12456274/pexels-photo-12456274.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'myrrh-royale' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12456274/pexels-photo-12456274.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'myrrh-royale') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450399/pexels-photo-8450399.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'myrrh-royale') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450345/pexels-photo-8450345.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'myrrh-royale') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12456283/pexels-photo-12456283.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'myrrh-royale') and sort_order = 3 and image_url like '%picsum.photos%';

-- bergamot-silk
update public.products set cover_image_url = 'https://images.pexels.com/photos/35658144/pexels-photo-35658144.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'bergamot-silk' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/35658144/pexels-photo-35658144.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'bergamot-silk') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/35806942/pexels-photo-35806942.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'bergamot-silk') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/35806939/pexels-photo-35806939.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'bergamot-silk') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/230778/pexels-photo-230778.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'bergamot-silk') and sort_order = 3 and image_url like '%picsum.photos%';

-- leather-and-oud
update public.products set cover_image_url = 'https://images.pexels.com/photos/14490634/pexels-photo-14490634.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'leather-and-oud' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/14490634/pexels-photo-14490634.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'leather-and-oud') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/21926650/pexels-photo-21926650.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'leather-and-oud') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/21926653/pexels-photo-21926653.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'leather-and-oud') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/16239693/pexels-photo-16239693.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'leather-and-oud') and sort_order = 3 and image_url like '%picsum.photos%';

-- jasmine-noir
update public.products set cover_image_url = 'https://images.pexels.com/photos/19954486/pexels-photo-19954486.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'jasmine-noir' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/19954486/pexels-photo-19954486.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'jasmine-noir') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/7850600/pexels-photo-7850600.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'jasmine-noir') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450391/pexels-photo-8450391.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'jasmine-noir') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/21008941/pexels-photo-21008941.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'jasmine-noir') and sort_order = 3 and image_url like '%picsum.photos%';

-- vetiver-smoke
update public.products set cover_image_url = 'https://images.pexels.com/photos/15190739/pexels-photo-15190739.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'vetiver-smoke' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/15190739/pexels-photo-15190739.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'vetiver-smoke') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/33295344/pexels-photo-33295344.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'vetiver-smoke') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450207/pexels-photo-8450207.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'vetiver-smoke') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/8450219/pexels-photo-8450219.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'vetiver-smoke') and sort_order = 3 and image_url like '%picsum.photos%';

-- peche-sauvage
update public.products set cover_image_url = 'https://images.pexels.com/photos/38949831/pexels-photo-38949831.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'peche-sauvage' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/38949831/pexels-photo-38949831.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'peche-sauvage') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/38949832/pexels-photo-38949832.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'peche-sauvage') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/35806941/pexels-photo-35806941.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'peche-sauvage') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/1961786/pexels-photo-1961786.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'peche-sauvage') and sort_order = 3 and image_url like '%picsum.photos%';

-- musk-imperial
update public.products set cover_image_url = 'https://images.pexels.com/photos/34051691/pexels-photo-34051691.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where slug = 'musk-imperial' and cover_image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/34051691/pexels-photo-34051691.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'musk-imperial') and sort_order = 0 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/15097440/pexels-photo-15097440.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'musk-imperial') and sort_order = 1 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/10924522/pexels-photo-10924522.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'musk-imperial') and sort_order = 2 and image_url like '%picsum.photos%';
update public.product_images set image_url = 'https://images.pexels.com/photos/12402366/pexels-photo-12402366.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop' where product_id = (select id from public.products where slug = 'musk-imperial') and sort_order = 3 and image_url like '%picsum.photos%';

commit;
