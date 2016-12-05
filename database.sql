/*
DATABASE CONTENTS:
song title, artist, anger, fear, disgust, joy, sadness
*/

CREATE TABLE song_info(
  title varchar(20),
  artist varchar(20),
  anger decimal(7,6),
  fear decimal(7,6),
  disgust decimal(7,6),
  joy decimal(7,6),
  sadness decimal(7,6)
);

INSERT INTO song_info (title, artist, anger, fear, disgust, joy, sadness)
 VALUES ('Kanye', 'I love kanye', 0.048534,  0.048534, 0.061673, 0.007832, 0.906378);

 
