import { db } from "./db";
import {
  employees,
  attendance,
  type Employee,
  type InsertEmployee,
  type AttendanceRecord,
  type InsertAttendance
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getEmployees(): Promise<Employee[]>;
  getEmployee(id: number): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  deleteEmployee(id: number): Promise<boolean>;
  
  getAttendanceRecords(): Promise<AttendanceRecord[]>;
  createAttendance(record: InsertAttendance): Promise<AttendanceRecord>;
}

export class DatabaseStorage implements IStorage {
  async getEmployees(): Promise<Employee[]> {
    return await db.select().from(employees);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    // Try using returning() (Postgres). If not supported (e.g. SQLite), fall back.
    try {
      const [employee] = await (db.insert(employees).values(insertEmployee) as any).returning();
      return employee;
    } catch (e) {
      const runResult = await (db.insert(employees).values(insertEmployee) as any).run();
      const id = runResult.lastInsertRowid ?? runResult.lastID ?? runResult.insertId;
      const [employee] = await db.select().from(employees).where(eq(employees.id, id));
      return employee;
    }
  }

  async deleteEmployee(id: number): Promise<boolean> {
    // Support both Postgres (returning) and SQLite (changes count)
    try {
      const [deleted] = await (db.delete(employees).where(eq(employees.id, id)) as any).returning();
      return !!deleted;
    } catch (e) {
      const result = await (db.delete(employees).where(eq(employees.id, id)) as any).run();
      const changes = result.changes ?? result.changesCount ?? result.affectedRows;
      return !!changes;
    }
  }

  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    return await db.select().from(attendance);
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<AttendanceRecord> {
    // Ensure date is a Date object for database insertion
    const dataToInsert = {
      ...insertAttendance,
      date: insertAttendance.date instanceof Date ? insertAttendance.date : new Date(insertAttendance.date),
    };
    
    try {
      const [record] = await (db.insert(attendance).values(dataToInsert) as any).returning();
      return record;
    } catch (e) {
      const runResult = await (db.insert(attendance).values(dataToInsert) as any).run();
      const id = runResult.lastInsertRowid ?? runResult.lastID ?? runResult.insertId;
      const [record] = await db.select().from(attendance).where(eq(attendance.id, id));
      return record;
    }
  }
}

// Simple in-memory storage fallback for local development when `db` is not configured
class MemoryStorage implements IStorage {
  private _employees: Employee[] = [];
  private _attendance: AttendanceRecord[] = [];
  private empId = 1;
  private attId = 1;

  async getEmployees(): Promise<Employee[]> {
    return [...this._employees];
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this._employees.find((e) => e.id === id);
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const employee: any = {
      id: this.empId++,
      firstName: insertEmployee.firstName,
      lastName: insertEmployee.lastName,
      email: insertEmployee.email,
      position: insertEmployee.position,
      department: insertEmployee.department,
      joinDate: new Date().toISOString(),
    };
    this._employees.push(employee);
    return employee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const before = this._employees.length;
    this._employees = this._employees.filter((e) => e.id !== id);
    return this._employees.length < before;
  }

  async getAttendanceRecords(): Promise<AttendanceRecord[]> {
    return [...this._attendance];
  }

  async createAttendance(insertAttendance: InsertAttendance): Promise<AttendanceRecord> {
    const dateObj = insertAttendance.date instanceof Date ? insertAttendance.date : new Date(insertAttendance.date);
    const record: any = {
      id: this.attId++,
      employeeId: insertAttendance.employeeId,
      date: dateObj.toISOString(),
      status: insertAttendance.status,
      checkIn: insertAttendance.checkIn || null,
      checkOut: insertAttendance.checkOut || null,
    };
    this._attendance.push(record);
    return record;
  }
}

export const storage: IStorage = db ? new DatabaseStorage() : new MemoryStorage();
