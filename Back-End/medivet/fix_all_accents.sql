SET NAMES utf8mb4;

-- Fix Duenos
UPDATE duenos SET nombre = 'Javiera Alarcón' WHERE id = 1;
UPDATE duenos SET nombre = 'Andrés Vicuña' WHERE id = 2;
UPDATE duenos SET nombre = 'Pía Montes' WHERE id = 3;

-- Fix Pacientes
UPDATE pacientes SET raza = 'Quiltro/Mestizo' WHERE id = 1;
UPDATE pacientes SET raza = 'Persa' WHERE id = 2;

-- Fix Fichas Clinicas
UPDATE fichas_clinicas SET diagnostico = 'Paciente sano. Esquema de vacunación al día (Sextuple y Antirrábica).', tratamiento = 'No requiere tratamiento. Próximo control en 12 meses.' WHERE id = 1;
UPDATE fichas_clinicas SET diagnostico = 'Dermatitis alérgica por pulgas (DAPP). Se observa eritema y prurito intenso en zona lumbosacra.', tratamiento = 'Tratamiento con Apoquel y pipeta antiparasitaria. Baño medicado cada 7 días.' WHERE id = 2;
UPDATE fichas_clinicas SET diagnostico = 'Deshidratación leve y cuadro febril. Sospecha de infección urinaria.', tratamiento = 'Hospitalización por 24 horas para hidratación y toma de exámenes de sangre/orina.' WHERE id = 3;

-- Fix Recetas (Redundant but safe)
UPDATE recetas SET medicamentos = '[{"medicamento": "Enrofloxacino 50mg", "indicacion": "1 comprimido cada 12 horas por 7 días. Observar reacciones alérgicas."}]' WHERE id = 2;
UPDATE recetas SET medicamentos = '[{"medicamento": "Meloxicam 0.5mg", "indicacion": "Dar 3 gotas cada 24 horas por 5 días vía oral después de comer."}]' WHERE id = 1;
