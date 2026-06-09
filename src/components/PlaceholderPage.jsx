import { useSwipeBack } from '../hooks/useSwipeBack';
import { Card, Btn } from './ui';

export function PlaceholderPage({ title, emoji, description, onBack }) {
  useSwipeBack(onBack);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Btn onClick={onBack}>← Back</Btn>
        <h2 className="text-2xl font-bold text-warm-800 dark:text-warm-100 flex-1">{title}</h2>
      </div>
      <Card className="text-center py-12">
        <div className="text-5xl mb-4">{emoji}</div>
        <div className="font-semibold text-warm-800 dark:text-warm-100 mb-2">{title} is coming soon!</div>
        <p className="text-sm text-warm-400 dark:text-warm-500">{description}</p>
      </Card>
    </div>
  );
}