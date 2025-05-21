import requests
from bs4 import BeautifulSoup
from datetime import datetime

def get_today_matches():
    url = 'https://www.sofascore.com/es/futbol'
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    matches = []
    # Este selector puede cambiar según el HTML del sitio
    for match_div in soup.select('div.sc-hLBbgP'):
        try:
            teams = match_div.select('.sc-iyvyFv')
            home_team = teams[0].text.strip()
            away_team = teams[1].text.strip()
            time_elem = match_div.select_one('.sc-hhZaXi')
            match_time = time_elem.text.strip() if time_elem else "Desconocido"
            matches.append({
                'home_team': home_team,
                'away_team': away_team,
                'date': datetime.now().isoformat(), 
                'status': 'scheduled'
            })
        except Exception as e:
            continue  # Si falla el parsing de un partido, lo ignora
    return matches