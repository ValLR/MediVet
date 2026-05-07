UPDATE citas SET estado = 'Completada' WHERE id IN (1, 2, 4);
UPDATE fichas_clinicas SET id_cita = 1 WHERE id = 1;
UPDATE fichas_clinicas SET id_cita = 2 WHERE id = 2;
UPDATE fichas_clinicas SET id_cita = 4 WHERE id = 3;
