import re
import json
import requests
import unicodedata
import codecs
from unidecode import unidecode
from bs4 import BeautifulSoup
import psycopg2

class songInfo:

    def __init__(self, artist,title, lyrics):
        self.artist = artist
        self.title = title    # instance variable unique to each instance
        self.lyrics = lyrics

songList = []


with open('songList.txt', 'r') as f:
    for line in f:
        artist = re.search(r'Artist:\s(.*?)\sTitle:',line).group(1)
        title = re.search(r'Title:\s(.*)', line).group(1)
        c = songInfo(artist,title, '')
        songList.append(c)



base_url = "http://api.genius.com"
headers = {'Authorization': 'Bearer TOKEN'}


#STRING TYPES, don't know why it work when pass into getLyrics function
#im so dumb there's a space after my artst

def lyrics_from_song_api_path(song_api_path):
  song_url = base_url + song_api_path
  response = requests.get(song_url, headers=headers)
  json = response.json()
  path = json["response"]["song"]["path"]
  #gotta go regular html scraping... come on Genius
  page_url = "http://genius.com" + path
  page = requests.get(page_url)
  html = BeautifulSoup(page.text.encode('utf-8').decode('ascii', 'ignore'), "html.parser")
  #remove script tags that they put in the middle of the lyrics
  [h.extract() for h in html('script')]
  #at least Genius is nice and has a tag called 'lyrics'!
  lyrics = html.find("lyrics").get_text()
  return lyrics
#PROBLEM THESE ARE UNICODE STRING
def getLyrics(song_title, artist_name):
      search_url = base_url + "/search"
      data = {'q': song_title}
      response = requests.get(search_url, data=data, headers=headers)
      myJson = response.json()
      song_info = None
      for hit in myJson["response"]["hits"]:
        if hit["result"]["primary_artist"]["name"] == artist_name:
          song_info = hit
          break
      if song_info:
        song_api_path = song_info["result"]["api_path"]
        return lyrics_from_song_api_path(song_api_path)

# lets try to insert this into database
missingLyrics = []

def insertDB(title, artist, lyrics):
    conn = psycopg2.connect(database="lyrics", host="localhost", port="5432")
    cur = conn.cursor()
    insert_part = "INSERT INTO song_info (title, artist, lyrics) VALUES(%s, %s, %s);"
    cur.execute(insert_part, (title, artist, lyrics))
    conn.commit()
    conn.close()

for s in songList:
    print str(s.title) + " " + str(s.artist)
    s.lyrics = getLyrics(s.title, s.artist)
    if(s.lyrics is None):
        missingLyrics.append(s)
    else:
        insertDB(s.title, s.artist, s.lyrics)



print "finished"
