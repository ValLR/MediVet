import urllib.request
import json

login_data = json.dumps({"email": "javi.alarcon@gmail.com", "password": "user123"}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/token/', data=login_data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as res:
        token = json.loads(res.read().decode())['access']
        
    headers = {'Authorization': f'Bearer {token}'}
    
    # Try fetching citas
    req2 = urllib.request.Request('http://localhost:8000/api/citas/', headers=headers)
    try:
        with urllib.request.urlopen(req2) as res2:
            citas = json.loads(res2.read().decode())
            print("Citas:", citas)
            
            for cita in citas.get('results', citas):
                if cita.get('estado') == 'Completada':
                    print(f"Cita Completada ID: {cita['id']}")
                    # Fetch ficha for this cita
                    req3 = urllib.request.Request(f"http://localhost:8000/api/fichas/?cita={cita['id']}", headers=headers)
                    with urllib.request.urlopen(req3) as res3:
                        print("Fichas for Cita:", res3.read().decode())
                        
    except urllib.error.HTTPError as e:
        print("ERROR:", e.code, e.read().decode())

except Exception as e:
    print("Error:", e)
