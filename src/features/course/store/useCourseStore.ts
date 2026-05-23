import { create } from "zustand";
import { CourseType } from "../types";

type CourseState = {
  selectedCourse: CourseType | null;
  setSelectedCourse: (course: CourseType | null) => void;
};

export const useCourseStore = create<CourseState>((set) => ({
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
