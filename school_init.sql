-- Drop tables if they exist (ordem importa por causa das FKs)
DROP TABLE IF EXISTS matriculas;
DROP TABLE IF EXISTS professores;
DROP TABLE IF EXISTS turmas;
DROP TABLE IF EXISTS alunos;

CREATE TABLE alunos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    data_nascimento DATE NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL
);

CREATE TABLE turmas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    ano INT NOT NULL
);

CREATE TABLE professores (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    disciplina VARCHAR(50) NOT NULL
);

CREATE TABLE matriculas (
    id SERIAL PRIMARY KEY,
    aluno_id INT REFERENCES alunos(id),
    turma_id INT REFERENCES turmas(id),
    data_matricula DATE NOT NULL
);

-- Alunos
INSERT INTO alunos (nome, data_nascimento, matricula) VALUES
('João Silva', '2010-05-10', 'A001'),
('Maria Souza', '2011-08-22', 'A002'),
('Pedro Santos', '2012-01-15', 'A003'),
('Ana Lima', '2010-12-30', 'A004'),
('Lucas Rocha', '2011-03-18', 'A005'),
('Juliana Alves', '2012-07-09', 'A006'),
('Rafael Costa', '2010-11-25', 'A007'),
('Beatriz Ramos', '2011-09-14', 'A008'),
('Gabriel Martins', '2012-04-02', 'A009'),
('Larissa Dias', '2010-06-21', 'A010');

-- Turmas
INSERT INTO turmas (nome, ano) VALUES
('5º Ano A', 2024),
('5º Ano B', 2024),
('6º Ano A', 2024),
('6º Ano B', 2024);

-- Professores
INSERT INTO professores (nome, disciplina) VALUES
('Carlos Lima', 'Matemática'),
('Ana Paula', 'Português'),
('Fernanda Souza', 'História'),
('Ricardo Alves', 'Geografia'),
('Patrícia Mendes', 'Ciências');

-- Matrículas
INSERT INTO matriculas (aluno_id, turma_id, data_matricula) VALUES
(1, 1, '2024-02-01'),
(2, 1, '2024-02-01'),
(3, 2, '2024-02-01'),
(4, 2, '2024-02-01'),
(5, 3, '2024-02-01'),
(6, 3, '2024-02-01'),
(7, 4, '2024-02-01'),
(8, 4, '2024-02-01'),
(9, 1, '2024-02-01'),
(10, 2, '2024-02-01');
