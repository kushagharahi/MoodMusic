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
  sadness decimal(7,6),
  mostLikely varchar(20)
);
