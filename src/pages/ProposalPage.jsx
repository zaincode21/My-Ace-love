import { useNavigate } from "react-router-dom";
import ProposalCard from "../components/ProposalCard";

/** Love letter + proposal question page */
export default function ProposalPage() {
  const navigate = useNavigate();

  return (
    <ProposalCard
      celebrating={false}
      onYes={() => navigate("/celebration")}
    />
  );
}
