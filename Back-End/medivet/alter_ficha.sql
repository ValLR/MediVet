ALTER TABLE fichas_clinicas ADD COLUMN id_cita INT DEFAULT NULL;
ALTER TABLE fichas_clinicas ADD CONSTRAINT fk_ficha_cita FOREIGN KEY (id_cita) REFERENCES citas(id) ON DELETE SET NULL;
