import requests
from BeautifulSoup import BeautifulSoup


html = open('songs.html', 'r')

soup = BeautifulSoup(html)
table = soup.find('tbody', attrs={'class': 'songs'})

songs = []

for row in table.findAll('tr'):
    col = row.findAll('td')
    songInfo = []
    songInfo.append(col[1].text)
    songInfo.append(col[2].text)
    songs.append(songInfo)


textFile = open('songList.txt', 'w')

for s in songs:
    artist = s[0]
    title = s[1]

    textFile.write("Artist: %s" % artist)
    textFile.write(" Title: %s\n" % title)

textFile.close()
#print result to textfile:
