import { PlusCircle } from 'lucide-react';
import ProposalWizard from '../../components/proposal/ProposalWizard';

export default function CreateProposal() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
          <PlusCircle className="w-5 h-5 text-brand-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-surface-100">Create AI Proposal</h1>
          <p className="text-surface-400 text-sm mt-0.5">Fill in client details and let AI generate curated recommendations</p>
        </div>
      </div>
      <ProposalWizard />
    </div>
  );
}
