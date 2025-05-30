import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WeatherService } from "../../application/services/WeatherService.js";
import { PriceByCepService } from "../../application/services/PriceByCepService.js";
import { PriceByZipCodeInputSchema } from "../../domain/models/PriceByCep.js";
import { SchoolQueryService } from "../../application/services/EscolaQueryService.js";

export class WeatherToolsController {
  constructor(
    private server: McpServer,
    private weatherService: WeatherService,
    private priceByCepService: PriceByCepService,
    private schoolQueryService: SchoolQueryService,
  ) {
    this.registerTools();
  }

  private registerTools(): void {
    this.registerGetAlertsToolHandler();
    this.registerGetForecastToolHandler();
    this.registerPriceByCepToolHandler();
    this.registerSchoolDbTools();
  }

  private registerGetAlertsToolHandler(): void {
    this.server.tool(
      "get-alerts",
      "Get weather alerts for a state",
      {
        state: z
          .string()
          .length(2)
          .describe("Two-letter state code (e.g. CA, NY)"),
      },
      async ({ state }) => {
        const alertsText = await this.weatherService.getAlertsForState(state);

        return {
          content: [
            {
              type: "text",
              text: alertsText,
            },
          ],
        };
      }
    );
  }

  private registerGetForecastToolHandler(): void {
    this.server.tool(
      "get-forecast",
      "Get weather forecast for a location",
      {
        latitude: z
          .number()
          .min(-90)
          .max(90)
          .describe("Latitude of the location"),
        longitude: z
          .number()
          .min(-180)
          .max(180)
          .describe("Longitude of the location"),
      },
      async ({ latitude, longitude }) => {
        const forecastText = await this.weatherService.getForecastForLocation(
          latitude,
          longitude
        );

        return {
          content: [
            {
              type: "text",
              text: forecastText,
            },
          ],
        };
      }
    );
  }

  private registerPriceByCepToolHandler(): void {
    this.server.tool(
      "price-by-cep",
      "Get shipping prices between two ZIP codes",
      {
        from: PriceByZipCodeInputSchema.shape.from,
        to: PriceByZipCodeInputSchema.shape.to,
        package: PriceByZipCodeInputSchema.shape.package,
      },
      async ({ from, to, package: pkg }) => {
        const prices = await this.priceByCepService.getPrices({ from, to, package: pkg });
        const text = prices.map(p => `Name: ${p.name}\nPrice: ${p.price}\nCustom price: ${p.custom_price}`).join('\n---\n');
        return {
          content: [
            {
              type: "text",
              text,
            },
          ],
        };
      }
    );
  }

  private registerSchoolDbTools(): void {
    const schoolService = this.schoolQueryService;
    this.server.tool(
      "list-students",
      "List all students",
      {},
      async () => {
        const students = await schoolService.listStudents();
        const text = students.map(s => `ID: ${s.id}\nNome: ${s.nome}\nNascimento: ${s.data_nascimento}\nMatrícula: ${s.matricula}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "list-teachers",
      "List all teachers",
      {},
      async () => {
        const teachers = await schoolService.listTeachers();
        const text = teachers.map(t => `ID: ${t.id}\nNome: ${t.nome}\nDisciplina: ${t.disciplina}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "list-classes",
      "List all classes",
      {},
      async () => {
        const classes = await schoolService.listClasses();
        const text = classes.map(c => `ID: ${c.id}\nNome: ${c.nome}\nAno: ${c.ano}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "list-enrollments",
      "List all enrollments",
      {},
      async () => {
        const enrollments = await schoolService.listEnrollments();
        const text = enrollments.map(e => `ID: ${e.id}\nAluno_id: ${e.aluno_id}\nTurma_id: ${e.turma_id}\nData_matricula: ${e.data_matricula}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "students-by-class",
      "List all students enrolled in a specific class",
      { className: z.string() },
      async ({ className }) => {
        const students = await schoolService.studentsByClass(className);
        const text = students.map(s => `ID: ${s.id}\nNome: ${s.nome}\nNascimento: ${s.data_nascimento}\nMatrícula: ${s.matricula}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "teachers-by-subject",
      "List all teachers who teach a specific subject",
      { subject: z.string() },
      async ({ subject }) => {
        const teachers = await schoolService.teachersBySubject(subject);
        const text = teachers.map(t => `ID: ${t.id}\nNome: ${t.nome}\nDisciplina: ${t.disciplina}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "students-born-after",
      "List all students born after a specific date",
      { date: z.string() },
      async ({ date }) => {
        const students = await schoolService.studentsBornAfter(date);
        const text = students.map(s => `ID: ${s.id}\nNome: ${s.nome}\nNascimento: ${s.data_nascimento}\nMatrícula: ${s.matricula}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "classes-with-student-count",
      "List all classes with the number of enrolled students",
      {},
      async () => {
        const classes = await schoolService.classesWithStudentCount();
        const text = classes.map(c => `ID: ${c.id}\nNome: ${c.nome}\nQtd. Alunos: ${c.student_count}`).join('\n---\n');
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "create-student",
      "Create a new student",
      {
        name: z.string().min(3),
        birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        registration: z.string().min(1)
      },
      async ({ name, birth_date, registration }) => {
        const student = await schoolService.createStudent(name, birth_date, registration);
        const text = `Aluno criado com sucesso!\nID: ${student.id}\nNome: ${student.nome}\nNascimento: ${student.data_nascimento}\nMatrícula: ${student.matricula}`;
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "create-teacher",
      "Create a new teacher",
      {
        name: z.string().min(3),
        subject: z.string().min(2)
      },
      async ({ name, subject }) => {
        const teacher = await schoolService.createTeacher(name, subject);
        const text = `Professor criado com sucesso!\nID: ${teacher.id}\nNome: ${teacher.nome}\nDisciplina: ${teacher.disciplina}`;
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "update-student",
      "Update an existing student",
      {
        id: z.number().int().positive(),
        name: z.string().min(3),
        birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        registration: z.string().min(1)
      },
      async ({ id, name, birth_date, registration }) => {
        const student = await schoolService.updateStudent(id, name, birth_date, registration);
        const text = `Aluno atualizado!\nID: ${student.id}\nNome: ${student.nome}\nNascimento: ${student.data_nascimento}\nMatrícula: ${student.matricula}`;
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "delete-student",
      "Delete a student by id",
      {
        id: z.number().int().positive()
      },
      async ({ id }) => {
        const student = await schoolService.deleteStudent(id);
        const text = `Aluno removido!\nID: ${student.id}\nNome: ${student.nome}`;
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "update-teacher",
      "Update an existing teacher",
      {
        id: z.number().int().positive(),
        name: z.string().min(3),
        subject: z.string().min(2)
      },
      async ({ id, name, subject }) => {
        const teacher = await schoolService.updateTeacher(id, name, subject);
        const text = `Professor atualizado!\nID: ${teacher.id}\nNome: ${teacher.nome}\nDisciplina: ${teacher.disciplina}`;
        return { content: [{ type: "text", text }] };
      }
    );
    this.server.tool(
      "delete-teacher",
      "Delete a teacher by id",
      {
        id: z.number().int().positive()
      },
      async ({ id }) => {
        const teacher = await schoolService.deleteTeacher(id);
        const text = `Professor removido!\nID: ${teacher.id}\nNome: ${teacher.nome}`;
        return { content: [{ type: "text", text }] };
      }
    );
  }
}
