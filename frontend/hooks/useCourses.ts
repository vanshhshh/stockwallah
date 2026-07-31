import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { courses as fallbackCourses, type Course } from "@/lib/content";

type CourseResponse = { courses: Course[] };

export function useCourses() {
  return useQuery({
    queryKey: ["courses", "public"],
    queryFn: async () => (await api.get<CourseResponse>("/api/courses")).data.courses,
    staleTime: 5 * 60_000,
    placeholderData: fallbackCourses,
  });
}
