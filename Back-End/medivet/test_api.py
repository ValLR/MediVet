import urllib.request
import json

login_data = json.dumps({"email": "c.soto@medivet.cl", "password": "vet123"}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/token/', data=login_data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as res:
        token = json.loads(res.read().decode())['access']
        
    headers = {'Authorization': f'Bearer {token}'}
    
    req2 = urllib.request.Request('http://localhost:8000/api/citas/1/', headers=headers)
    try:
        with urllib.request.urlopen(req2) as res2:
            print("GET /citas/1/:", res2.status, res2.read().decode())
    except urllib.error.HTTPError as e:
        print("GET /citas/1/ ERROR:", e.code, e.read().decode())

    req3 = urllib.request.Request('http://localhost:8000/api/fichas_clinicas/?cita=1', headers=headers)
    try:
        with urllib.request.urlopen(req3) as res3:
            print("GET /fichas_clinicas/:", res3.status, res3.read().decode())
    except urllib.error.HTTPError as e:
        print("GET /fichas_clinicas/ ERROR:", e.code, e.read().decode())

except Exception as e:
    print("Error general:", e)
