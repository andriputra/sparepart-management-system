import { store } from "../store/store";

export const clearDocuments = () => {
  // Bersihkan localStorage
  [
    "spis_id",
    "spps_id",
    "spqs_id",
    "spis_doc_no",
    "spps_doc_no",
    "spqs_doc_no",
    "spis_form_data",
    "spps_form_data",
    "spqs_form_data",
  ].forEach((key) => localStorage.removeItem(key));

  // Bersihkan Redux Store
  store.dispatch({ type: "RESET_ALL_DOCUMENTS" });
};