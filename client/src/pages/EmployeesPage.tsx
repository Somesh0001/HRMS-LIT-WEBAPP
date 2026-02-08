import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useEmployees, useCreateEmployee } from "@/hooks/use-employees";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Mail, Briefcase } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEmployeeSchema } from "@shared/schema";

export default function EmployeesPage() {
  const { data: employees, isLoading } = useEmployees();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createEmployee = useCreateEmployee();

  const form = useForm({
    resolver: zodResolver(insertEmployeeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      position: "",
      department: "",
    },
  });

  const filteredEmployees = employees?.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(search.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(search.toLowerCase()) ||
      emp.position.toLowerCase().includes(search.toLowerCase())
  );

  const onSubmit = (data: z.infer<typeof insertEmployeeSchema>) => {
    createEmployee.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: "Employee added successfully",
        });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Employees</h1>
          <p className="text-slate-500 mt-2">Manage your team members and roles</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] max-w-[500px] rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Add New Employee</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...form.register("firstName")} className="rounded-xl" placeholder="John" />
                  {form.formState.errors.firstName && <p className="text-xs text-red-500">{form.formState.errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...form.register("lastName")} className="rounded-xl" placeholder="Doe" />
                  {form.formState.errors.lastName && <p className="text-xs text-red-500">{form.formState.errors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} className="rounded-xl" placeholder="john.doe@company.com" />
                {form.formState.errors.email && <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" {...form.register("position")} className="rounded-xl" placeholder="Senior Developer" />
                {form.formState.errors.position && <p className="text-xs text-red-500">{form.formState.errors.position.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={(val) => form.setValue("department", val)} defaultValue={form.getValues("department")}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.department && <p className="text-xs text-red-500">{form.formState.errors.department.message}</p>}
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={createEmployee.isPending} className="rounded-xl w-full sm:w-auto">
                  {createEmployee.isPending ? "Adding..." : "Add Employee"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or position..." 
              value={search} 
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading employees...</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[300px]">Employee</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No employees found
                  </TableCell>
                </TableRow>
              ) : (
                filteredEmployees?.map((emp) => (
                  <TableRow key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-md">
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <div className="text-slate-900">{emp.firstName} {emp.lastName}</div>
                          <div className="text-xs text-slate-500 font-normal">ID: EMP-{emp.id.toString().padStart(3, '0')}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Mail className="w-4 h-4 text-slate-400" />
                        {emp.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        {emp.position}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {emp.department}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {new Date(emp.joinDate || "").toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </Layout>
  );
}
