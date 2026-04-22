import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

export const useDelete = async (
  id: number,
  refreshData: () => Promise<void>,
  service: (id: number) => Promise<any>,
) => {
  await Swal.fire({
    title: "¿Eliminar producto?",
    text: "Esta acción no se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#000000",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    preConfirm: async () => {
      try {
        await service(id);
      } catch (error: any) {
        Swal.showValidationMessage(
          `Error: ${error.message || "No se pudo eliminar"}`,
        );
      }
    },
  }).then(async (result) => {
    if (result.isConfirmed) {
      await refreshData();
      Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
    }
  });
};
