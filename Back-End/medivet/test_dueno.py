import urllib.request
import json

login_data = json.dumps({"email": "javi.alarcon@gmail.com", "password": "user123"}).encode('utf-8')
req = urllib.request.Request('http://localhost:8000/api/token/', data=login_data, headers={'Content-Type': 'application/json'})

try:
    with urllib.request.urlopen(req) as res:
        token = json.loads(res.read().decode())['access']
        
    headers = {'Authorization': f'Bearer {token}'}
    
    # Try fetching fichas
    req2 = urllib.request.Request('http://localhost:8000/api/fichas/', headers=headers)
    try:
        with urllib.request.urlopen(req2) as res2:
            print("GET /fichas/:", res2.status, res2.read().decode())
    except urllib.error.HTTPError as e:
        print("GET /fichas/ ERROR:", e.code, e.read().decode())

except Exception as e:
    print("Error:", e)
