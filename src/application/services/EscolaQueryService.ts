import { queryDb } from "../../infrastructure/services/DbService.js";

export class SchoolQueryService {
  async listStudents() {
    return await queryDb("SELECT * FROM alunos");
  }
  async listTeachers() {
    return await queryDb("SELECT * FROM professores");
  }
  async listClasses() {
    return await queryDb("SELECT * FROM turmas");
  }
  async listEnrollments() {
    return await queryDb("SELECT * FROM matriculas");
  }
  async studentsByClass(className: string) {
    return await queryDb(
      `SELECT a.nome, t.nome AS turma FROM alunos a JOIN matriculas m ON a.id = m.aluno_id JOIN turmas t ON m.turma_id = t.id WHERE t.nome = $1`,
      [className]
    );
  }
  async teachersBySubject(subject: string) {
    return await queryDb(
      `SELECT p.nome FROM professores p WHERE p.disciplina = $1`,
      [subject]
    );
  }
  async studentsBornAfter(date: string) {
    return await queryDb(
      `SELECT a.nome FROM alunos a WHERE a.data_nascimento > $1`,
      [date]
    );
  }
  async classesWithStudentCount() {
    return await queryDb(
      `SELECT t.nome, COUNT(m.aluno_id) AS numero_alunos FROM turmas t JOIN matriculas m ON t.id = m.turma_id GROUP BY t.nome`
    );
  }
  async createStudent(name: string, birth_date: string, registration: string) {
    const result = await queryDb(
      `INSERT INTO alunos (nome, data_nascimento, matricula) VALUES ($1, $2, $3) RETURNING *`,
      [name, birth_date, registration]
    );
    return result[0];
  }
  async createTeacher(name: string, subject: string) {
    const result = await queryDb(
      `INSERT INTO professores (nome, disciplina) VALUES ($1, $2) RETURNING *`,
      [name, subject]
    );
    return result[0];
  }
  async updateStudent(id: number, name: string, birth_date: string, registration: string) {
    const result = await queryDb(
      `UPDATE alunos SET nome = $2, data_nascimento = $3, matricula = $4 WHERE id = $1 RETURNING *`,
      [id, name, birth_date, registration]
    );
    return result[0];
  }
  async deleteStudent(id: number) {
    const result = await queryDb(
      `DELETE FROM alunos WHERE id = $1 RETURNING *`,
      [id]
    );
    return result[0];
  }
  async updateTeacher(id: number, name: string, subject: string) {
    const result = await queryDb(
      `UPDATE professores SET nome = $2, disciplina = $3 WHERE id = $1 RETURNING *`,
      [id, name, subject]
    );
    return result[0];
  }
  async deleteTeacher(id: number) {
    const result = await queryDb(
      `DELETE FROM professores WHERE id = $1 RETURNING *`,
      [id]
    );
    return result[0];
  }
}

