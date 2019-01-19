#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Thu May 17 22:43:33 2018

@author: curtiskoo
"""

from bs4 import BeautifulSoup
import requests
import psycopg2 as psy
from psycopg2 import extras
from psycopg2.extras import Json, DictCursor
import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from twilio.rest import Client
from datetime import datetime

DB = os.environ['DB']
AUTH = os.environ['AUTH']
print(DB, AUTH)
ACCOUNT = "AC037d2aa350745a2dc083b0fb7c4dfe87"

def execute(cmd, param=None, fetch=None):
    conn = psy.connect(DB, sslmode='require')
    psy.extras.register_hstore(conn, globally=True)
    
    cur = conn.cursor(cursor_factory=DictCursor)
    
    if param == None:
        cur.execute(cmd)
        conn.commit()
    else:
        cur.execute(cmd, param) 
        conn.commit()
    
    if fetch == True: 
        item = cur.fetchall()
        
        cur.close()
        conn.close()
        #print(item)
        return item
    
    cur.close()
    conn.close() 
    
def send_msg(title,body, fr_ad, to_ad):
    msg = MIMEMultipart()
    msg['From'] = fr_ad
    msg['To'] = to_ad
    msg['Subject'] = title
 
    #body = "Test message"
    msg.attach(MIMEText(body, 'plain'))
    
 
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(fr_ad, pwd1)
    text = msg.as_string()
    server.sendmail(fr_ad, to_ad, text)
    server.quit()


def send_text(message, fr_ad, to_ad):
    client = Client(ACCOUNT, AUTH)
    client.messages.create(to=to_ad, from_=fr_ad, body=message)
    

fromaddr = "+16046708672"
my_phone = "+17788988820"
to_phone = "+17788988820"

toaddr = to_phone
pwd1 = 'thisisatest'

"""checking 121"""
url = 'https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=3&dept=CPSC&course=121'
r = requests.get(url)
soup = BeautifulSoup(r.content, 'html.parser')
table = soup.find('table', {'class': "table table-striped section-summary"})
header = table.find('thead')

titles = header.findAll('th')
titles = list(map(lambda x: x.get_text(), titles))

tbody = table.findAll('tr')
tbody = list(map(lambda x: x.findAll('td'), tbody))
tbody = (filter(lambda x: x != [], tbody))
#print(type(tbody))
tbody = (map(lambda x: list(map(lambda xx: xx.get_text().strip(), x)), tbody))
#print(type(tbody))


rows = list(map(lambda x: dict(zip(titles, x)), tbody))
excludes = ['CPSC 121 L2A',
             'CPSC 121 L2C',
             'CPSC 121 L2J',
             'CPSC 121 L2K',
             'CPSC 121 L2L',
             'CPSC 121 L2N',
             'CPSC 121 L2P',
             'CPSC 121 L2R',
             'CPSC 121 L2T']


def records_by_day(course, t2_rows):
    days = ["Mon", "Tue", "Wed", "Thu", 'Fri']
    s = "{}:\n\n".format(course)
    for d in days:
        temp = list(filter(lambda x: x['Days'] == d, t2_rows)).copy()
        if len(temp) == 0:
            continue
        temp = sorted(temp, key=lambda x: datetime.strptime(x['Start Time'], "%H:%M"))
        s += "{}\n\n".format(d)
        for t in temp:
            stime = datetime.strptime(t['Start Time'], "%H:%M")
            stime = stime.strftime("%I:%M %p")
            t['Start Time'] = stime
            start = "[Start Time]: {}".format(t['Start Time'])
            link = "[Link]: https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&dept={}&course={}&section={}".format(t['Section'].split()[0], t['Section'].split()[1], t['Section'].split()[2])
            s += "{}\n{}\n\n".format(start,link)
    return s

#base = "https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&dept=CPSC&course=121&section=T2J"
t2_rows = list(filter(lambda x: x['Term'] == '2' and x['Activity'] == 'Laboratory' and x['Status'] not in ['Restricted', 'Full'] and x['Section'] not in excludes, rows))
#t2_rows = list(filter(lambda x: x['Term'] == '2' and x['Activity'] == 'Laboratory' and x['Status'] not in ['Restricted', 'Full'] , rows))
#t2_rows = list(map(lambda x: "https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&dept={}&course={}&section={}".format(x['Section'].split()[0], x['Section'].split()[1], x['Section'].split()[2]), t2_rows))

previous = execute("SELECT * FROM cpsc121",None, True)[0][0]
if previous != t2_rows:
    part = records_by_day("CPSC 121", t2_rows)
    send_text(part, fromaddr, toaddr)
    execute("UPDATE cpsc121 SET details = %s", (Json(t2_rows),))

"""
previous = execute("SELECT * FROM coursereq",None, True)[0] #specify which entry with index
coursed = previous[1]
dept = coursed['dept']
course = coursed['course']
section = coursed['section']
year = coursed['year']
sess = coursed['sess']

course_url = ("https://courses.students.ubc.ca/cs/main?pname=subjarea&tname=subjareas&req=5&dept="
              "{}&course={}&section={}".format(dept,course,section))
sess_url = "https://courses.students.ubc.ca/cs/main?sessyr={}&sesscd={}".format(year,sess)

seatd = previous[2]
curreg = seatd['Currently Registered:']
totseat = seatd['Total Seats Remaining:']
genseat = seatd['General Seats Remaining:']
resseat = seatd['Restricted Seats Remaining*:']

s = requests.Session()
s.get(sess_url)
r = s.get(course_url)
data = r.text
soup = BeautifulSoup(data, 'html.parser')
tr = soup.find_all('td')
dic = {'Total Seats Remaining:':None,
      'Currently Registered:': None,
      'General Seats Remaining:': None,
      'Restricted Seats Remaining*:': None}
acc = None
for x in tr:
    text = x.text
    #print(text, 1)
    if text in dic:
        #print('yes')
        acc = text
        continue
    if acc in dic:
        dic[acc] = int(text)
        acc = None

#dic is current seat dictionary
curr_genseat = dic['General Seats Remaining:']
curr_resseat = dic['Restricted Seats Remaining*:']
part1 = "[{} {} {}] SEAT AVAILABLE - From the bae\n".format(dept,course,section)
part2 = "Hey there young one ^__^, seat available now: {} !".format(course_url)
part = part1 + part2
if curr_genseat > genseat: #change here
    print("UPDATE AVAILABLE!!!")
    send_text(part, fromaddr, toaddr)
    send_text("Message sent to {}.".format(toaddr), fromaddr, my_phone)
    #send_msg("[{} {} {}] SEAT AVAILABLE - From the bae".format(dept,course,section), "Here there young one, seat available now: {}!".format(course_url), fromaddr, toaddr)
    #send_msg("Message sent to {}".format(toaddr), "Message sent to {}".format(toaddr), fromaddr, fromaddr)
    execute("UPDATE coursereq SET details = %s", (Json(dic),))
"""

    
