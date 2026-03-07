-- Seed Data for Community Posts (Linked to Test User)
-- Make sure to run 'seed_user.sql' FIRST!

-- Post 1: Perfect Burger (Yahoo Search Link 1)
insert into public.posts (user_id, content, images) 
values (
  '00000000-0000-0000-0000-000000000001',
  'I tried the 5 most popular burger recipes and the winner delivered! Look at this beauty. 🍔🔥 #BurgerQuest #CookingAtHome',
  ARRAY['https://in.images.search.yahoo.com/images/view;_ylt=AwrKF3gOgKVpq_oiOsC9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkA2Y3ZjNiYjJkYjZhYWUwMTExYjg4MjVlZWU2ZWQ0MTlmBGdwb3MDNgRpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dburger%26type%3DE210IN714G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D6&w=1500&h=1125&imgurl=www.allrecipes.com%2Fthmb%2F5JVfA7MxfTUPfRerQMdF-nGKsLY%3D%2F1500x0%2Ffilters%3Ano_upscale%28%29%3Amax_bytes%28150000%29%3Astrip_icc%28%29%2F25473-the-perfect-basic-burger-DDMFS-4x3-56eaba3833fd4a26a82755bcd0be0c54.jpg']
);

-- Post 2: Floating Burger (Yahoo Search Link 2)
insert into public.posts (user_id, content, images) 
values (
  '00000000-0000-0000-0000-000000000001',
  'Just discovered this amazing hidden gem downtown! The flavors are absolute perfection. �✨ #Foodie #BurgerLife',
  ARRAY['https://in.images.search.yahoo.com/images/view;_ylt=Awr1QLOqf6Vp8ToeNjO9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzI1YTBiMGQ5YzFlMjIxNDc4MzZmZDA2NzA4ZDY4OTgzBGdwb3MDNARpdANiaW5n?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dburger%26type%3DE210IN714G0%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D4&w=1280&h=1280&imgurl=cdn.pixabay.com%2Fphoto%2F2022%2F08%2F29%2F17%2F44%2Fburger-7419420_1280.jpg']
);

-- Post 3: Aesthetic Cafe
insert into public.posts (user_id, content, images) 
values (
  '00000000-0000-0000-0000-000000000001',
  'Morning coffee rituals. This place has the best aesthetic and even better lattes. ☕🌿 #MorningVibes #CafeCulture',
  ARRAY['https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1000']
);

-- Post 4: Sunset View
insert into public.posts (user_id, content, images) 
values (
  '00000000-0000-0000-0000-000000000001',
  'Best sunset view in the city! The perfect spot to unwind after a long day. 🌅✨ #SunsetView #Unwind',
  ARRAY['https://images.unsplash.com/photo-1502318217862-aa4e294ba657?auto=format&fit=crop&q=80&w=1000']
);

-- Post 5: Italian Pasta
insert into public.posts (user_id, content, images) 
values (
  '00000000-0000-0000-0000-000000000001',
  'Found a hidden gem with the best pasta! The homemade ravioli is actually life-changing. 🍝🇮🇹 #ItalianFood #HiddenGem',
  ARRAY['https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&q=80&w=1000']
);
