import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useAttendance, useCreateAttendance } from "@/hooks/use-attendance";
import { useEmployees } from "@/hooks/use-employees";
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
import { CalendarCheck, Clock, CalendarDays } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAttendanceSchema } from "@shared/schema";
import { format } from "date-fns";

const statusColors: Record<string, string> = {
  Present: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Absent: "bg-red-100 text-red-800 border-red-200",
  Leave: "bg-amber-100 text-amber-800 border-amber-200",
};

export default function AttendancePage() {
  const { data: attendance, isLoading } = useAttendance();
  const { data: employees } = useEmployees();
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const createAttendance = useCreateAttendance();

  const form = useForm({
    resolver: zodResolver(insertAttendanceSchema),
    defaultValues: {
      employeeId: 0,
      date: new Date(),
      status: "Present",
      checkIn: "09:00",
      checkOut: "17:00",
    },
  });

  const onSubmit = (data: any) => {
    createAttendance.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
        toast({
          title: "Success",
          description: "Attendance marked successfully",
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

  const getEmployeeName = (id: number) => {
    const emp = employees?.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : `Unknown (${id})`;
  };

  return (
    <Layout>
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-500 mt-2">Track daily attendance and check-ins</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] w-full sm:w-auto">
              <CalendarCheck className="w-4 h-4 mr-2" />
              Mark Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95%] max-w-[500px] rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-display">Mark Attendance</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee</Label>
                <Select onValueChange={(val) => form.setValue("employeeId", parseInt(val))} defaultValue={form.getValues("employeeId")?.toString()}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id.toString()}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.employeeId && <p className="text-xs text-red-500">{form.formState.errors.employeeId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  {...form.register("date", { 
                    setValueAs: (value) => new Date(value)
                  })} 
                  className="rounded-xl"
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                />
                {form.formState.errors.date && <p className="text-xs text-red-500">{form.formState.errors.date.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select onValueChange={(val) => form.setValue("status", val)} defaultValue="Present">
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Present">Present</SelectItem>
                    <SelectItem value="Absent">Absent</SelectItem>
                    <SelectItem value="Leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.status && <p className="text-xs text-red-500">{form.formState.errors.status.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkIn">Check In</Label>
                  <Input id="checkIn" type="time" {...form.register("checkIn")} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOut">Check Out</Label>
                  <Input id="checkOut" type="time" {...form.register("checkOut")} className="rounded-xl" />
                </div>
              </div>

              <div className="pt-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl w-full sm:w-auto">Cancel</Button>
                <Button type="submit" disabled={createAttendance.isPending} className="rounded-xl w-full sm:w-auto">
                  {createAttendance.isPending ? "Saving..." : "Save Record"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground">Loading attendance records...</div>
        ) : (
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[300px]">Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Check In / Out</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                attendance?.map((record) => (
                  <TableRow key={record.id} className="group hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-medium text-slate-900">
                      {getEmployeeName(record.employeeId)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-slate-600">
                        <CalendarDays className="w-4 h-4 text-slate-400" />
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[record.status] || 'bg-gray-100 text-gray-800'}`}>
                        {record.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {record.status === 'Present' && (
                        <div className="flex items-center gap-4 text-sm text-slate-600">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {record.checkIn || '--:--'}
                          </span>
                          <span className="text-slate-300">→</span>
                          <span>{record.checkOut || '--:--'}</span>
                        </div>
                      )}
                      {record.status !== 'Present' && <span className="text-slate-400 text-sm">-</span>}
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
