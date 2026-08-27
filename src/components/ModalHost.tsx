"use client";

import { useFilters } from "@/context/FiltersContext";
import InstitutionModal from "./InstitutionModal";

export default function ModalHost() {
  const { selected, setSelected } = useFilters();
  if (!selected) return null;
  return <InstitutionModal institution={selected} onClose={() => setSelected(null)} />;
}
