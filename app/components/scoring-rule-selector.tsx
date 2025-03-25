import * as React from 'react';
import { getScoringRuleConfig } from '~/lib/scoring';
import type { ScoringRuleType } from '~/lib/types';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type ScoringRuleSelectorProps = {
	value: ScoringRuleType;
	onChange: (value: string) => void;
};

function getScoringRulePenaltyDescription(penaltyType: string, penaltyPerTrick?: number): string {
	switch (penaltyType) {
		case 'zero':
			return '0 points (no points awarded)';
		case 'tricksOnly':
			return 'Only points for tricks taken';
		case 'penalty': {
			const pointText = penaltyPerTrick === 1 ? 'point' : 'points';
			return `-${penaltyPerTrick} ${pointText} per trick over/under bid`;
		}
		default:
			return 'No penalty';
	}
}

const ScoringRuleSelector: React.FC<ScoringRuleSelectorProps> = ({ value, onChange }) => {
	const [selectedRule, setSelectedRule] = React.useState<ScoringRuleType>(value);

	function handleChange(newValue: string): void {
		setSelectedRule(newValue as ScoringRuleType);
		onChange(newValue);
	}

	const ruleConfig = getScoringRuleConfig(selectedRule);

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="scoring-rule">Scoring Rule</Label>
				<Select value={selectedRule} onValueChange={handleChange}>
					<SelectTrigger id="scoring-rule">
						<SelectValue placeholder="Select scoring rule" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="standard">Standard</SelectItem>
						<SelectItem value="simple">Simple</SelectItem>
						<SelectItem value="common">Common</SelectItem>
						<SelectItem value="penalty">Penalty</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="bg-muted/50 p-4 rounded-md">
				<h4 className="font-medium text-sm mb-2">{ruleConfig.name}</h4>
				<p className="text-sm text-muted-foreground">{ruleConfig.description}</p>
				<div className="mt-2 text-xs space-y-1">
					<div>Exact bid bonus: {ruleConfig.exactBidBonus} points</div>
					<div>Points per trick: {ruleConfig.pointsPerTrick} points</div>
					<div>
						Missing bid:{' '}
						{getScoringRulePenaltyDescription(
							ruleConfig.pointsForMissingBid,
							ruleConfig.penaltyPerTrick,
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ScoringRuleSelector;
