import { Leaf, Sparkles } from 'lucide-react';

export function TorshiLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`torshi-logo ${compact ? 'torshi-logo-compact' : ''}`} aria-label="TORSHI">
      <span className="torshi-brand-art" aria-hidden="true">
        <span className="torshi-jar-lid" />
        <span className="torshi-jar-body"><i /><i /><i /></span>
        <Leaf className="torshi-leaf torshi-leaf-one" size={15} />
        <Leaf className="torshi-leaf torshi-leaf-two" size={13} />
      </span>
      <span className="torshi-brand-name">TORSHI</span>
      <Sparkles className="torshi-brand-spark spark-left" size={11} />
      <Sparkles className="torshi-brand-spark spark-right" size={9} />
    </span>
  );
}
