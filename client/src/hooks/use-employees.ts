import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type CreateEmployeeRequest } from "@shared/routes";

export function useEmployees() {
  return useQuery({
    queryKey: [api.employees.list.path],
    queryFn: async () => {
      const res = await fetch(api.employees.list.path);
      if (!res.ok) throw new Error("Failed to fetch employees");
      return api.employees.list.responses[200].parse(await res.json());
    },
  });
}

export function useEmployee(id: number) {
  return useQuery({
    queryKey: [api.employees.get.path, id],
    queryFn: async () => {
      const url = api.employees.get.path.replace(":id", String(id));
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch employee");
      return api.employees.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEmployeeRequest) => {
      const validated = api.employees.create.input.parse(data);
      const res = await fetch(api.employees.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.employees.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create employee");
      }
      return api.employees.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.employees.list.path] });
    },
  });
}
