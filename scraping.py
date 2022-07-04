import datetime
from types import NoneType
from bs4 import BeautifulSoup
import requests
import pymongo

path = 'https://tunein.com/radio/music/'
print(f'\n-- GET : {path} --\n')
html_doc = requests.get(path)
soup = BeautifulSoup(html_doc.content, 'lxml')

# obtener secciones completas (titulo, contenido)
category_containers = soup.find_all(
    'div', 'container-items-module__containerItem___OhnxW')

# clases de contenido de subelementos de todas las secciones
subcontain_classes = ['guide-item-module__guideItemTitleMultiLine___ddgqh guide-item-module__guideItemTitle___nYoaH',
                      'numbered-link-module__numberedLinkContainer___EPfHi',
                      'link-module__container___vhfuW', 'numbered-link-module__headerText___PPhv6', 'titles-module__titleText___KQtb_']

categories = []
for container in category_containers:
    section = {}
    section['created_at'] = datetime.date.isoformat(datetime.datetime.now())
    section['updated_at'] = None
    # titulo de la seccion
    if(container.find('div', 'container-title-module__titleHeader___WUX8D')):
        section['title'] = container.find(
            'div', 'container-title-module__titleHeader___WUX8D').text
        section['content'] = []
    else:
        break

    for subclass in subcontain_classes:
        # si existe al menos un elemento en la seccion
        if(container.find('div', subclass)):
            # contenido de la seccion
            elements = container.find_all('div', subclass)
            for elem in elements:
                # añadir el texto de cada elemento a la lista de contenido de la seccion
                section['content'].append(elem.text)
    # añade seccion a lista de categorias
    categories.append(section)

# categoria sin texto solo imagenes
categories.pop(2)

# local conection string
# pymongo.MongoClient('mongodb://127.0.0.1')
# cloud conection string
mongo = pymongo.MongoClient('mongodb://memosk8:Password123@ac-yygcs2d-shard-00-00.nuhhssx.mongodb.net:27017,ac-yygcs2d-shard-00-01.nuhhssx.mongodb.net:27017,ac-yygcs2d-shard-00-02.nuhhssx.mongodb.net:27017/?ssl=true&replicaSet=atlas-ce6o63-shard-0&authSource=admin&retryWrites=true&w=majority')
if(mongo):
    print("\n-- DB ok --\n")
    scrap = mongo.tunein.categories
try:
    scrap.insert_many(categories)
    print(
        f'se insertaron {len(categories)} categorias de {path}')
except pymongo.errors.ConnectionFailure as error:
    print(error)
