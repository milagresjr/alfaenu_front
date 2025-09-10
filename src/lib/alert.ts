import Swal from "sweetalert2";

export const alert = {
  success: (title: string, text?: string) =>
    Swal.fire({
      icon: "success",
      title,
      text,
      confirmButtonColor: "#3085d6",
    }),

  error: (title: string, text?: string) =>
    Swal.fire({
      icon: "error",
      title,
      text,
      confirmButtonColor: "#d33",
    }),

  warning: (title: string, text?: string) =>
    Swal.fire({
      icon: "warning",
      title,
      text,
      confirmButtonColor: "#f39c12",
    }),

  confirm: async (
    title: string,
    html?: string,
    confirmButtonText: string = "Sim, confirmar",
    cancelButtonText: string = "Cancelar"
  ) => {
    const result = await Swal.fire({
      title,
      html,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#27ae60",
      cancelButtonColor: "#d33",
      confirmButtonText,
      cancelButtonText,
    });
    return result.isConfirmed;
  },

}