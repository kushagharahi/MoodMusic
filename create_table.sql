/* DRAFT */

CREATE TABLE song_info(
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  artist VARCHAR(50),
  lyrics TEXT,
  link VARCHAR(200),
  anger DECIMAL(7,6),
  fear DECIMAL(7,6),
  disgust DECIMAL(7,6),
  joy DECIMAL(7,6),
  sadness DECIMAL(7,6),
  most_likely VARCHAR(10)
);

INSERT INTO song_info (title, artist, lyrics, anger, fear, disgust, joy, sadness, most_likely) 
  VALUES (
    'Everybody''s Fool', 
    'Evanescence', 
    'lyrics', 
    0.098669, 0.576864, 0.064781, 0.516816, 0.587038,
    'sadness'
);

INSERT INTO song_info (title, artist, lyrics, anger, disgust, fear, joy, sadness, most_likely) 
  VALUES (
    'Boom Boom Pow', 
    'Black Eyed Peas', 
    'lyrics', 
    0.513658, 0.164741, 0.368086, 0.055707, 0.05656,
    'anger',
);

INSERT INTO song_info (title, artist, lyrics, anger, disgust, fear, joy, sadness, most_likely) 
  VALUES (
    'A Higher Place', 
    'Adam Levine', 
    'lyrics', 
    0.40918, 0.012274, 0.023928, 0.512898, 0.059044,
    'joy'
);

INSERT INTO song_info (title, artist, lyrics, anger, disgust, fear, joy, sadness, most_likely) 
  VALUES (
    'Russian Roulette', 
    'Rihanna', 
    'lyrics', 
    0.187702, 0.00141, 0.645664, 0.006761, 0.257211,
    'fear'
);

INSERT INTO song_info (title, artist, lyrics, anger, disgust, fear, joy, sadness, most_likely) 
  VALUES (
    'Bye Bye', 
    'Mariah Carey', 
    'lyrics', 
    0.115707, 0.004863, 0.0074, 0.465388, 0.419781,
    'joy'
);

/* Query for positive mood */
SELECT title, artist FROM song_info WHERE most_likely = 'joy' 
  OR most_likely = 'anger' ORDER BY random() LIMIT 2;
