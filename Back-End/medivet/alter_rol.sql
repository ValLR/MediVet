ALTER TABLE usuarios MODIFY COLUMN rol ENUM('Administrativo', 'Veterinario', 'Dueno') NOT NULL DEFAULT 'Administrativo';
