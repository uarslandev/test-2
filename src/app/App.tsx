import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Brain,
  Eye,
  GraduationCap,
  Info,
  Layers,
  Lock,
  Mic,
  Move,
  Settings,
  ShieldCheck,
  Smile,
  Stethoscope,
  Theater
} from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip as ReChartsTooltip,
  ResponsiveContainer,
  XAxis,
  YAxis
} from 'recharts';
import facialAscExample from '../data/images/facial-asc.svg';
import facialWithoutAscExample from '../data/images/facial-without-asc.svg';
import gazeAscExample from '../data/images/gaze-asc.svg';
import gazeWithoutAscExample from '../data/images/gaze-without-asc.svg';
import vocalAscExample from '../data/images/vocal-asc.svg';
import vocalWithoutAscExample from '../data/images/vocal-without-asc.svg';
import mimicryAscExample from '../data/images/mimicry-asc.svg';
import mimicryWithoutAscExample from '../data/images/mimicry-without-asc.svg';
import headAscExample from '../data/images/head-asc.svg';
import headWithoutAscExample from '../data/images/head-without-asc.svg';
import appLogo from '../data/images/logo.png';
import { modalityData } from '../data/modalityData';
import { LanguageSwitcher } from './components/LanguageSwitcher';

// --- Pipeline JSON Data Imports for 67869 (copy for all patients) ---
import screeningResult_67869 from '../../website_data/case_67869/screening_result.json';
import multilabelConditionOutputs_67869 from '../../website_data/case_67869/multilabel_condition_outputs.json';
import modalityOutputs_67869 from '../../website_data/case_67869/modality_outputs.json';
import patientDeviations_67869 from '../../website_data/case_67869/patient_deviation_tables.json';


interface PatientData {
  caseId: string;
  screeningResult: typeof screeningResult_67869;
  multilabelConditionOutputs: typeof multilabelConditionOutputs_67869;
  modalityOutputs: typeof modalityOutputs_67869;
  patientDeviations: typeof patientDeviations_67869;
}

const caseId1 = import.meta.env.VITE_PATIENT_CASE_1 || 'case_67869';

const PATIENTS: Record<string, PatientData> = {
  [caseId1]: {
    caseId: caseId1,
    screeningResult: screeningResult_67869,
    multilabelConditionOutputs: multilabelConditionOutputs_67869,
    modalityOutputs: modalityOutputs_67869,
    patientDeviations: patientDeviations_67869,
  },
};

const PATIENT_TOKENS: Record<string, string> = {
  [import.meta.env.VITE_PATIENT_TOKEN_1 || 'your_patient_token_1']: caseId1,
};

import referenceGroupStats from '../../website_data/reference/reference_group_stats.json';
import pairwiseGroupComparisons from '../../website_data/reference/pairwise_group_comparisons.json';
import prototypicalCases from '../../website_data/learning/prototypical_cases.json';
import learningStatistics from '../../website_data/learning/learning_statistics.json';
import featureDictionary from '../../website_data/metadata/feature_dictionary.json';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './components/ui/tooltip';

// --- Types ---
type ViewMode = 'screening' | 'assessment' | 'learning';
type RouteView = 'welcome' | 'model' | 'data' | 'learning';
type Modality = 'overview' | 'gaze' | 'facial' | 'vocal' | 'head' | 'mimicry';
type ReferenceGroup = 'control' | 'asc' | 'adhd' | 'sad' | 'depression';
type GenderBaseline = 'all' | 'male' | 'female';

const MODALITY_JSON_MAP: Record<string, string> = {
  gaze: 'gaze',
  facial: 'facial',
  vocal: 'voice',
  head: 'head',
  mimicry: 'mimicry',
};

const GROUP_JSON_MAP: Record<string, string> = {
  control: 'control',
  asc: 'asc',
  adhd: 'adhd',
  sad: 'sad',
  depression: 'mdd',
};

type ModeOption = {
  id: ViewMode;
  label: string;
  icon: any;
  desc: string;
};

type LearningStatRow = {
  id: string;
  name: string;
  detail: string;
  control: string;
  asc: string;
  correlation: string;
  pValue: string;
};

const ClinicalScopeNotice = () => (
  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
    <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
    <p className="text-xs text-amber-900 leading-relaxed">
      This system provides decision support and does not replace clinical diagnosis. Outputs should be interpreted
      with clinical context, uncertainty, and model limitations.
    </p>
  </div>
);

// --- Mock Data ---
const CONFUSION_MATRIX = [
  { labelKey: 'confusionMatrix.aiRecommendsASC', withASC: '36%', withoutASC: '12%', color: 'bg-teal-50/50' },
  { labelKey: 'confusionMatrix.aiRecommendsNoASC', withASC: '14%', withoutASC: '38%', color: 'bg-white' },
];

const BEHAVIORAL_TRAITS = [
  { trait: 'Gaze Patterns', patient: 45, average: 80, educational: 'Measures eye contact duration and consistency during interaction with the pre-recorded actor.' },
  { trait: 'Facial Expressivity', patient: 35, average: 70, educational: 'Quantifies the range and frequency of micro-expressions and emotional response.' },
  { trait: 'Vocal Prosody', patient: 65, average: 75, educational: 'Analyzes pitch variance and rhythm. Flat or atypical prosody is common in ASC.' },
  { trait: 'Head Movement', patient: 80, average: 30, educational: 'Tracks coordination and excessive or restricted movement during response phases.' },
  { trait: 'Social Reciprocity', patient: 40, average: 75, educational: 'The timing and quality of back-and-forth social interaction within the SIT paradigm.' },
];

const MODALITY_STRENGTHS = [
  { trait: 'Gaze', patient: 52, average: 70 },
  { trait: 'Facial Expressivity', patient: 38, average: 68 },
  { trait: 'Vocal Prosody', patient: 61, average: 73 },
  { trait: 'Head Movement', patient: 44, average: 58 },
  { trait: 'Mimicry', patient: 33, average: 60 },
];

const DIFFERENTIAL_DIAGNOSIS_DATA = [
  { name: 'ASC', probability: 72, color: '#0d9488' },
  { name: 'ADHD', probability: 45, color: '#0891b2' },
  { name: 'Social Anxiety', probability: 25, color: '#4f46e5' },
  { name: 'Depression', probability: 10, color: '#7c3aed' },
];

const CONDITION_MODEL_OUTPUTS = DIFFERENTIAL_DIAGNOSIS_DATA.map((item) => ({
  condition: item.name,
  score: item.probability,
}));

const CONDITION_THRESHOLD = 60;

const TIME_SERIES_DATA = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  gaze: Math.random() * 100,
  movement: Math.random() * 100,
}));

const MODALITY_IDS: Modality[] = ['overview', 'gaze', 'facial', 'vocal', 'head', 'mimicry'];

const LEARNING_STATS: Record<'gaze' | 'facial' | 'vocal' | 'head' | 'mimicry', LearningStatRow[]> = {
  head: [],
  mimicry: [],
  gaze: [
    {
      id: 'horizontal-gaze-angle',
      name: 'Horizontal gaze angle',
      detail: 'Variance',
      control: '3.2 deg',
      asc: '5.1 deg',
      correlation: '0.32',
      pValue: '0.02',
    },
    {
      id: 'gaze-fixation-screen',
      name: 'Gaze fixation on the screen',
      detail: 'Time-wise %',
      control: '71%',
      asc: '58%',
      correlation: '-0.28',
      pValue: '0.04',
    },
    {
      id: 'gaze-fixation-partner',
      name: 'Gaze fixation on the interaction partner',
      detail: 'Time-wise %',
      control: '18%',
      asc: '28%',
      correlation: '0.35',
      pValue: '0.01',
    },
  ],
  facial: [
    {
      id: 'smile-mean',
      name: 'Smile intensity of mouth and eye region',
      detail: 'Mean over time',
      control: '0.58',
      asc: '0.49',
      correlation: '-0.41',
      pValue: '0.01',
    },
    {
      id: 'smile-variance',
      name: 'Smile intensity of mouth and eye region',
      detail: 'Variance over time',
      control: '0.14',
      asc: '0.22',
      correlation: '0.29',
      pValue: '0.03',
    },
    {
      id: 'brow-mean',
      name: 'Eye brown lowerer',
      detail: 'Mean over time',
      control: '0.37',
      asc: '0.52',
      correlation: '0.33',
      pValue: '0.02',
    },
    {
      id: 'brow-variance',
      name: 'Eye brown lowerer',
      detail: 'Variance over time',
      control: '0.10',
      asc: '0.16',
      correlation: '0.27',
      pValue: '0.04',
    },
    {
      id: 'facial-mean',
      name: 'General facial intensity',
      detail: 'Mean over time',
      control: '0.51',
      asc: '0.47',
      correlation: '-0.22',
      pValue: '0.05',
    },
    {
      id: 'facial-variance',
      name: 'General facial intensity',
      detail: 'Variance over time',
      control: '0.12',
      asc: '0.19',
      correlation: '0.25',
      pValue: '0.04',
    },
  ],
  vocal: [
    {
      id: 'pitch-variance',
      name: 'Pitch',
      detail: 'Variance',
      control: '14.2',
      asc: '21.1',
      correlation: '0.38',
      pValue: '0.02',
    },
    {
      id: 'speed-mean',
      name: 'Speed',
      detail: 'Mean',
      control: '1.25',
      asc: '1.06',
      correlation: '-0.31',
      pValue: '0.03',
    },
    {
      id: 'speed-variance',
      name: 'Speed',
      detail: 'Variance',
      control: '0.09',
      asc: '0.16',
      correlation: '0.29',
      pValue: '0.04',
    },
    {
      id: 'loudness-variance',
      name: 'Loudness',
      detail: 'Variance',
      control: '5.9',
      asc: '7.4',
      correlation: '0.26',
      pValue: '0.04',
    },
  ],
};

const LEARNING_EXAMPLES = {
  gaze: {
    control: gazeWithoutAscExample,
    asc: gazeAscExample,
  },
  facial: {
    control: facialWithoutAscExample,
    asc: facialAscExample,
  },
  vocal: {
    control: vocalWithoutAscExample,
    asc: vocalAscExample,
  },
  head: {
    control: headWithoutAscExample,
    asc: headAscExample,
  },
  mimicry: {
    control: mimicryWithoutAscExample,
    asc: mimicryAscExample,
  },
} as const;



const FEATURE_IMPORTANCE = [
  {
    id: 'gaze-fixation-partner',
    featureKey: 'assessmentExplainability.features.gazeFixationPartner.feature',
    weight: 0.28,
    directionKey: 'assessmentExplainability.features.gazeFixationPartner.direction',
    rationaleKey: 'assessmentExplainability.features.gazeFixationPartner.rationale',
  },
  {
    id: 'facial-variance',
    featureKey: 'assessmentExplainability.features.facialVariance.feature',
    weight: 0.24,
    directionKey: 'assessmentExplainability.features.facialVariance.direction',
    rationaleKey: 'assessmentExplainability.features.facialVariance.rationale',
  },
  {
    id: 'pitch-variance',
    featureKey: 'assessmentExplainability.features.pitchVariance.feature',
    weight: 0.19,
    directionKey: 'assessmentExplainability.features.pitchVariance.direction',
    rationaleKey: 'assessmentExplainability.features.pitchVariance.rationale',
  },
  {
    id: 'head-horizontal',
    featureKey: 'assessmentExplainability.features.headHorizontal.feature',
    weight: 0.15,
    directionKey: 'assessmentExplainability.features.headHorizontal.direction',
    rationaleKey: 'assessmentExplainability.features.headHorizontal.rationale',
  },
  {
    id: 'mimicry-correlation',
    featureKey: 'assessmentExplainability.features.mimicryCorrelation.feature',
    weight: 0.14,
    directionKey: 'assessmentExplainability.features.mimicryCorrelation.direction',
    rationaleKey: 'assessmentExplainability.features.mimicryCorrelation.rationale',
  },
] as const;

const DATA_QUALITY_ITEMS = [
  { labelKey: 'quality.signalCompleteness', value: 96 },
  { labelKey: 'quality.faceTracking', value: 93 },
  { labelKey: 'quality.audioQuality', value: 91 },
  { labelKey: 'quality.gazeTracking', value: 88 },
] as const;

const REFERENCE_GROUP_LABEL_KEYS: Record<ReferenceGroup, string> = {
  control: 'referenceGroup.options.control',
  asc: 'referenceGroup.options.asc',
  adhd: 'referenceGroup.options.adhd',
  sad: 'referenceGroup.options.sad',
  depression: 'referenceGroup.options.depression',
};



const MODALITY_COMPUTATION_GUIDE_KEYS: Record<Modality, string> = {
  gaze: 'modalityComputation.gaze',
  facial: 'modalityComputation.facial',
  vocal: 'modalityComputation.vocal',
  head: 'modalityComputation.head',
  mimicry: 'modalityComputation.mimicry',
};

const parseMetric = (value: string): { numeric: number | null; unit: string; precision: number } => {
  const trimmed = value.trim();
  const match = trimmed.match(/^(-?\d+(?:\.\d+)?)(.*)$/);

  if (!match) {
    return { numeric: null, unit: '', precision: 0 };
  }

  const raw = match[1];
  const decimal = raw.split('.')[1];
  return {
    numeric: Number(raw),
    unit: match[2],
    precision: decimal ? decimal.length : 0,
  };
};

const formatMetric = (numeric: number, unit: string, precision: number): string => {
  return `${numeric.toFixed(precision)}${unit}`;
};

const deriveReferenceValue = (
  controlValue: string,
  ascValue: string,
  referenceGroup: ReferenceGroup,
  genderBaseline: GenderBaseline,
): string => {
  if (referenceGroup === 'control') {
    return controlValue;
  }

  if (referenceGroup === 'asc') {
    return ascValue;
  }

  const control = parseMetric(controlValue);
  const asc = parseMetric(ascValue);

  if (control.numeric === null || asc.numeric === null) {
    return controlValue;
  }

  const delta = asc.numeric - control.numeric;
  const groupFactor = referenceGroup === 'adhd' ? 0.45 : 0.25;
  let interpolated = control.numeric + delta * groupFactor;

  if (genderBaseline === 'male') {
    interpolated += delta * 0.08;
  }
  if (genderBaseline === 'female') {
    interpolated -= delta * 0.08;
  }

  return formatMetric(interpolated, control.unit, control.precision);
};

// --- Sub-components ---

const ModeButton = ({ active, onClick, icon: Icon, label, description }: {
  active: boolean,
  onClick: () => void,
  icon: any,
  label: string,
  description: string
}) => (
  <button
    onClick={onClick}
    className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${active
      ? 'border-teal-600 bg-teal-50/50 shadow-sm'
      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
      }`}
  >
    <div className={`p-2 rounded-lg ${active ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
      <Icon size={20} />
    </div>
    <div>
      <div className="font-semibold text-gray-900">{label}</div>
      <div className="text-xs text-gray-500 mt-0.5 leading-tight">{description}</div>
    </div>
  </button>
);

const ConfusionMatrix = ({ thresholdData }: { thresholdData: any }) => {
  const { t } = useTranslation();
  if (!thresholdData) return null;
  const sens = thresholdData.sensitivity;
  const spec = thresholdData.specificity;
  const nPos = thresholdData.n_positive_cases;
  const nNeg = thresholdData.n_negative_cases;
  const total = nPos + nNeg;

  const tp = Math.round(sens * nPos);
  const fn = nPos - tp;
  const tn = Math.round(spec * nNeg);
  const fp = nNeg - tn;

  const tpPct = ((tp / total) * 100).toFixed(1) + '%';
  const fnPct = ((fn / total) * 100).toFixed(1) + '%';
  const fpPct = ((fp / total) * 100).toFixed(1) + '%';
  const tnPct = ((tn / total) * 100).toFixed(1) + '%';

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-gray-500">
            <th className="p-4 text-left font-medium"></th>
            <th className="p-4 text-center font-medium">{t('confusionMatrix.withASC')} (n={nPos})</th>
            <th className="p-4 text-center font-medium">{t('confusionMatrix.withoutASC')} (n={nNeg})</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-teal-50/50">
            <td className="p-4 font-medium text-gray-700">{t('confusionMatrix.aiRecommendsASC')}</td>
            <td className="p-4 text-center text-gray-600">
              <div className="font-bold">{tpPct}</div>
              <div className="text-[10px] text-gray-400">({tp}/{nPos} True Positives)</div>
            </td>
            <td className="p-4 text-center text-gray-600">
              <div className="font-bold">{fpPct}</div>
              <div className="text-[10px] text-gray-400">({fp}/{nNeg} False Positives)</div>
            </td>
          </tr>
          <tr className="bg-white">
            <td className="p-4 font-medium text-gray-700">{t('confusionMatrix.aiRecommendsNoASC')}</td>
            <td className="p-4 text-center text-gray-600">
              <div className="font-bold">{fnPct}</div>
              <div className="text-[10px] text-gray-400">({fn}/{nPos} False Negatives)</div>
            </td>
            <td className="p-4 text-center text-gray-600">
              <div className="font-bold">{tnPct}</div>
              <div className="text-[10px] text-gray-400">({tn}/{nNeg} True Negatives)</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

// --- Mode Views ---

const WelcomeView = ({
  modes,
  activeMode,
  onSelectMode,
}: {
  modes: ModeOption[];
  activeMode?: ViewMode | null;
  onSelectMode: (mode: ViewMode) => void;
}) => {
  const { t } = useTranslation();
  const primaryModes = modes.filter((mode) => mode.id !== 'learning');
  const learningMode = modes.find((mode) => mode.id === 'learning');

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <section className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
        <div className="space-y-6 motion-safe:animate-[welcome-fade_0.6s_ease-out_0s_both]">
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
            {t('welcome.title')}
          </h1>
          <div className="space-y-5 text-sm text-gray-700 leading-relaxed">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t('welcome.whatTitle')}</h2>
              <p>{t('welcome.whatBody')}</p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">{t('welcome.howTitle')}</h2>
              <p>{t('welcome.howBody')}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-900">
            <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={16} />
            <p className="leading-relaxed">
              {t('welcome.scopeNoticePrefix')}{' '}
              <span className="font-semibold">{t('welcome.scopeNoticeEmphasis')}</span>{' '}
              {t('welcome.scopeNoticeSuffix')}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4 motion-safe:animate-[welcome-fade_0.6s_ease-out_0.2s_both]">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-gray-900">{t('welcome.chooseTitle')}</h3>
          <p className="text-sm text-gray-600">{t('welcome.chooseBody')}</p>
        </div>
        <h3 className="text-lg font-bold text-gray-900">{t('welcome.analyzeTitle')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {primaryModes.map((mode) => (
            <ModeButton
              key={mode.id}
              active={activeMode === mode.id}
              onClick={() => onSelectMode(mode.id)}
              icon={mode.icon}
              label={mode.label}
              description={mode.desc}
            />
          ))}
        </div>
      </section>

      <section className="space-y-4 motion-safe:animate-[welcome-fade_0.6s_ease-out_0.3s_both]">
        <h3 className="text-lg font-bold text-gray-900">{t('welcome.learnTitle')}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {learningMode ? (
            <ModeButton
              key={learningMode.id}
              active={activeMode === learningMode.id}
              onClick={() => onSelectMode(learningMode.id)}
              icon={learningMode.icon}
              label={learningMode.label}
              description={learningMode.desc}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
};

const ScreeningView = ({ patientData }: { patientData: PatientData }) => {
  const { screeningResult, modalityOutputs } = patientData;
  const { t } = useTranslation();
  const thresholdStrategy = 'high_sensitivity';

  const score = screeningResult.asc_screening_score;
  const selectedThresholdData = screeningResult.thresholds[thresholdStrategy];
  const thresholdVal = selectedThresholdData.selected_threshold;
  const isAboveThreshold = score >= thresholdVal;

  const formattedScore = (score * 100).toFixed(1) + '%';
  const formattedThreshold = (thresholdVal * 100).toFixed(0) + '%';

  const modalityLabelMap: Record<string, string> = {
    facial: t('screening.facialExpressionsScore'),
    mimicry: t('screening.mimicryScore'),
    gaze: t('screening.gazeScore'),
    head: t('screening.headMovementScore'),
    audio: t('screening.voiceScore'),
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('screening.title')}</h2>
        <p className="text-gray-600 leading-relaxed mb-6 text-sm">
          {t('screening.description')}
        </p>


        <div className="p-6 bg-white border border-gray-100 rounded-xl mb-6 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-900 uppercase tracking-tight">{t('screening.diagnosisProbability')}</span>
            {isAboveThreshold && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                {t('screening.highConfidence')}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-900 mb-2">
            <span className="font-semibold">{t('screening.recommendationLabel')}</span>{' '}
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${isAboveThreshold ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800 border border-gray-200'
              }`}>
              {isAboveThreshold ? t('screening.recommendationValue') : t('screening.recommendationNoFlagValue')}
            </span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed mb-4">
            {isAboveThreshold ? (
              <>
                {t('screening.recommendationNotePrefix')}{' '}
                <span className="font-semibold">{t('screening.recommendationNoteEmphasis')}</span>{' '}
                {t('screening.recommendationNoteSuffix')}
              </>
            ) : (
              <>
                {t('screening.recommendationNoFlagPrefix')}{' '}
                <span className="font-semibold">{t('screening.recommendationNoFlagEmphasis')}</span>{' '}
                {t('screening.recommendationNoFlagSuffix')}
              </>
            )}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg text-teal-700 font-semibold">{t('screening.likelihoodOfASC')}</span>
            <span className="text-4xl font-black text-teal-600">{formattedScore}</span>
          </div>

          {/* Progress Bar with Threshold Marker */}
          <div className="space-y-1">
            <div className="relative h-4 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
              {/* Threshold indicator line */}
              <div
                className={`absolute top-0 bottom-0 w-0.5 z-10 ${isAboveThreshold ? 'bg-red-300' : 'bg-red-500'}`}
                style={{ left: `${thresholdVal * 100}%` }}
              />
              {/* Progress fill */}
              <div
                className={`h-full transition-all duration-500 ${isAboveThreshold ? 'bg-red-500' : 'bg-teal-500'}`}
                style={{ width: `${score * 100}%` }}
              />
            </div>
            <div className="relative h-6 text-[11px] text-gray-400 font-bold mt-1">
              <span className="absolute left-0 top-0">0%</span>
              <span
                style={{ left: `${thresholdVal * 100}%`, transform: 'translateX(-50%)' }}
                className="absolute top-0 text-red-500 animate-fade-in"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="relative flex items-center hover:text-red-700 transition-colors text-[11px] font-bold leading-none">
                      <span>▲</span>
                      <span className={`absolute ${thresholdVal * 100 > 50 ? 'right-full mr-1' : 'left-full ml-1'} top-0 flex items-center gap-1 whitespace-nowrap leading-none`}>
                        <span>Threshold ({formattedThreshold})</span>
                        <Info size={11} className="shrink-0" />
                      </span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-black text-white border border-white/10 max-w-xs text-xs">
                    {/* Explains how the threshold was calculated */}
                  </TooltipContent>
                </Tooltip>
              </span>
              <span className="absolute right-0 top-0">100%</span>
            </div>
          </div>

          <p className="mt-4 text-xs text-teal-800 leading-relaxed">
            {t('screening.modelDescription')}
          </p>


        </div>

        <div className="mt-4 flex items-start gap-3 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
          <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-orange-900 leading-relaxed">
            <span className="font-bold">{t('screening.scopeTitle')}</span>{' '}
            {t('screening.scopeBodyPrefix')}{' '}
            <span className="font-semibold">{t('screening.scopeBodyEmphasis')}</span>{' '}
            {t('screening.scopeBodySuffix')}
          </p>
        </div>

        <details className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <summary className="cursor-pointer text-xs font-bold uppercase tracking-widest text-gray-500">
            {t('screening.modelPerformanceTitle')}
          </summary>
          <p className="mt-3 text-xs text-gray-700 leading-relaxed mb-4">
            {t('screening.modelPerformanceBody')}
          </p>
          <ConfusionMatrix thresholdData={selectedThresholdData} />

          {/* Detailed Threshold Metrics */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">AUPRC (OOF)</div>
              <div className="text-base font-black text-gray-900">{selectedThresholdData.auprc.toFixed(4)}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">AUROC (OOF)</div>
              <div className="text-base font-black text-gray-900">{selectedThresholdData.auroc.toFixed(4)}</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Sensitivity</div>
              <div className="text-base font-black text-gray-900">{(selectedThresholdData.sensitivity * 100).toFixed(1)}%</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200">
              <div className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Specificity</div>
              <div className="text-base font-black text-gray-900">{(selectedThresholdData.specificity * 100).toFixed(1)}%</div>
            </div>
          </div>
          <div className="mt-3 text-[10px] text-gray-400 leading-relaxed text-right">
            Model: {screeningResult.model_version} | N = {selectedThresholdData.n_positive_cases + selectedThresholdData.n_negative_cases} ({selectedThresholdData.estimated_from})
          </div>
        </details>
      </section>

      {/* Modality-Level Model Outputs */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-bold text-gray-900">{t('screening.modalityOutputsTitle')}</h3>
        </div>
        <div className="space-y-4 text-sm text-gray-700">
          {modalityOutputs.screening_modality_outputs.map((item) => {
            const label = modalityLabelMap[item.modality] || item.modality;
            const pctValue = Math.round(item.screening_score * 100);
            const pctThreshold = Math.round(item.threshold * 100);

            return (
              <div key={item.modality} className="space-y-1">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{label}</span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`font-semibold ${item.above_threshold ? 'text-red-500 font-bold' : 'text-gray-900'}`}>
                      {pctValue}%
                    </span>
                    {item.above_threshold && (
                      <span className="bg-red-100 text-red-800 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Crossed</span>
                    )}
                  </div>
                </div>
                <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <div
                    className={`absolute top-0 bottom-0 w-0.5 z-10 ${item.above_threshold ? 'bg-red-300' : 'bg-red-500'}`}
                    style={{ left: `${pctThreshold}%` }}
                  />
                  <div
                    className={`h-full ${item.above_threshold ? 'bg-red-500' : 'bg-teal-500'}`}
                    style={{ width: `${pctValue}%` }}
                  />
                </div>
                <div className="relative h-6 text-[11px] text-gray-400 font-bold mt-1">
                  <span className="absolute left-0 top-0">0%</span>
                  <span
                    style={{ left: `${pctThreshold}%`, transform: 'translateX(-50%)' }}
                    className="absolute top-0 text-red-500 text-[11px] font-bold animate-fade-in"
                  >
                    <span className="relative flex items-center leading-none">
                      <span>▲</span>
                      <span className={`absolute ${pctThreshold > 50 ? 'right-full mr-1' : 'left-full ml-1'} top-0 whitespace-nowrap leading-none`}>
                        Threshold ({pctThreshold}%)
                      </span>
                    </span>
                  </span>
                  <span className="absolute right-0 top-0">100%</span>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-gray-500 leading-relaxed">
          {t('screening.modalityOutputsNote')}
        </p>
      </section>

      {/* Disclaimer */}
      {screeningResult.disclaimer && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500 leading-relaxed">
          <span className="font-bold">Disclaimer:</span> {screeningResult.disclaimer}
        </div>
      )}
    </div>
  );
};


const LearningView = () => {
  const { t } = useTranslation();
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{t('learning.title')}</h2>
          <p className="text-sm text-gray-600 max-w-2xl">
            {t('learning.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BEHAVIORAL_TRAITS.map((trait) => (
              <div key={trait.trait} className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-teal-200 transition-colors group">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-800">{trait.trait}</span>
                  <Info size={16} className="text-gray-300 group-hover:text-teal-500 cursor-help" />
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-teal-500 transition-all duration-1000"
                    style={{ width: `${trait.patient}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{trait.educational}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-teal-900 text-white p-6 rounded-2xl">
            <GraduationCap className="mb-4 text-teal-300" size={32} />
            <h3 className="text-lg font-bold mb-2">{t('learning.trainingModule')}</h3>
            <p className="text-sm text-teal-100 leading-relaxed mb-4">
              {t('learning.trainingDescription')}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs bg-teal-800/50 p-2 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                {t('learning.identifyGaze')}
              </div>
              <div className="flex items-center gap-2 text-xs bg-teal-800/50 p-2 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-teal-400" />
                {t('learning.analyzeMicro')}
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Brain size={18} className="text-teal-600" />
              {t('learning.theoreticalFramework')}
            </h4>
            <div className="space-y-4">
              <div className="text-sm">
                <div className="font-semibold text-gray-700 mb-1">{t('learning.camouflaging')}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{t('learning.camouflaguingDesc')}</p>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-700 mb-1">{t('learning.digitalBiomarkers')}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{t('learning.digitalBiomarkersDesc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DataAssessmentView = ({ activeMode, patientData }: { activeMode?: ViewMode | null; patientData: PatientData }) => {
  const { multilabelConditionOutputs } = patientData;
  const { t } = useTranslation();

  const conditionLabelMap: Record<string, string> = {
    ASD: 'Autism (ASC)',
    ADHD: 'ADHD',
    MDD: 'Depression (MDD)',
    SAD: 'Social Anxiety (SAD)',
  };

  const chartData = multilabelConditionOutputs.conditions.map((c: any) => ({
    condition: conditionLabelMap[c.condition] || c.condition,
    score: Math.round(c.score * 100),
    threshold: Math.round(c.threshold * 100),
  }));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {activeMode === 'learning' && (
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('learningModeBox.title')}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('learningModeBox.body')}
          </p>
        </section>
      )}
      <section>
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('dataAssessment.overviewTitle')}</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          {t('dataAssessment.overviewBody')}
        </p>
      </section>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 leading-relaxed">
        <span className="font-semibold">{t('dataAssessment.interpretationNoteTitle')}:</span> {t('dataAssessment.interpretationNoteBody')}
      </div>
      <div className="grid grid-cols-1 gap-8">
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Layers size={18} className="text-teal-600" />
                {t('dataAssessment.multimodalFusion')}
              </h3>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label={t('dataAssessment.conditionInfoLabel')}
                >
                  <Info size={14} />
                </button>
              </TooltipTrigger>
              <TooltipContent sideOffset={8} className="bg-black text-white border border-white/10 max-w-xs">
                {t('dataAssessment.conditionInfoBody')}
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            {multilabelConditionOutputs.conditions.map((item) => {
              const pctScore = Math.round(item.score * 100);
              const pctThreshold = Math.round(item.threshold * 100);
              return (
                <div key={item.condition} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800 text-sm">{item.condition_display}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.crosses_threshold
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}>
                      {item.crosses_threshold ? 'Threshold Crossed' : 'Below Threshold'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Probability Score: <span className="font-semibold text-gray-900">{pctScore}%</span></span>
                  </div>
                  <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                    <div
                      className={`absolute top-0 bottom-0 w-0.5 z-10 ${item.crosses_threshold ? 'bg-red-300' : 'bg-red-500'}`}
                      style={{ left: `${pctThreshold}%` }}
                    />
                    <div
                      className={`h-full ${item.crosses_threshold ? 'bg-red-500' : 'bg-teal-500'}`}
                      style={{ width: `${pctScore}%` }}
                    />
                  </div>
                  <div className="relative h-6 text-[11px] text-gray-400 font-bold mt-1">
                    <span className="absolute left-0 top-0">0%</span>
                    <span
                      style={{ left: `${pctThreshold}%`, transform: 'translateX(-50%)' }}
                      className="absolute top-0 text-red-500 text-[11px] font-bold animate-fade-in"
                    >
                      <span className="relative flex items-center leading-none">
                        <span>▲</span>
                        <span className={`absolute ${pctThreshold > 50 ? 'right-full mr-1' : 'left-full ml-1'} top-0 whitespace-nowrap leading-none`}>
                          Threshold ({pctThreshold}%)
                        </span>
                      </span>
                    </span>
                    <span className="absolute right-0 top-0">100%</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-gray-500 leading-relaxed">
            Scores are independent model outputs and do not represent clinical diagnosis probabilities. Thresholds indicate decision cutoffs, not diagnostic criteria.
          </p>
        </section>
      </div>
    </div>
  );
};

const DataModalityView = ({
  modality,
  activeMode,
  referenceGroup,
  setReferenceGroup,
  gender,
  setGender,
  patientData,
}: {
  modality: Modality;
  activeMode: ViewMode;
  referenceGroup: ReferenceGroup;
  setReferenceGroup: (g: ReferenceGroup) => void;
  gender: GenderBaseline;
  setGender: (g: GenderBaseline) => void;
  patientData: PatientData;
}) => {
  const { caseId, patientDeviations } = patientData;
  const { t } = useTranslation();
  const label = t(`modalities.${modality}.label`);
  const description = t(`modalities.${modality}.description`);
  const data = modality === 'overview' ? null : modalityData[modality] as any;
  const [facialSignal, setFacialSignal] = useState<'smile' | 'disgust' | 'all'>('smile');
  const [pairwiseFeature, setPairwiseFeature] = useState<string>('');

  const getCaseImage = (
    modalityKey: Exclude<Modality, 'overview'>,
    refGroup: ReferenceGroup,
    genderContext: GenderBaseline,
    facialSignalValue?: 'smile' | 'disgust' | 'all'
  ): string => {
    const groupFolderMap: Record<ReferenceGroup, string> = {
      control: 'control',
      asc: 'asc',
      adhd: 'adhd',
      sad: 'sad',
      depression: 'mdd',
    };

    const modalityFolderMap: Record<Exclude<Modality, 'overview'>, string> = {
      gaze: 'gaze',
      facial: 'facial_expressivity',
      vocal: 'vocal_prosody',
      head: 'head_movement',
      mimicry: 'mimicry',
    };

    const folderGroup = groupFolderMap[refGroup] || 'control';
    const folderModality = modalityFolderMap[modalityKey];

    let fileName = '';
    if (modalityKey === 'gaze') {
      fileName = 'gaze_heatmap.svg';
    } else if (modalityKey === 'facial') {
      fileName = `facial_trace__signal-${facialSignalValue || 'smile'}.svg`;
    } else if (modalityKey === 'vocal') {
      fileName = 'voice_distribution.svg';
    } else if (modalityKey === 'head') {
      fileName = 'head_distribution.svg';
    } else if (modalityKey === 'mimicry') {
      fileName = 'mimicry_distribution.svg';
    }

    return `/assets/${caseId}/${folderGroup}/${genderContext}/${folderModality}/${fileName}`;
  };

  const getClosestGroupForFeature = (featureId: string, genderContext: string, patientValue: number | null): string => {
    if (patientValue === null || patientValue === undefined) return 'control';
    let closestGroup = 'control';
    let minDiff = Infinity;
    const targetRows = patientDeviations.deviations.filter((d: any) =>
      d.feature_id === featureId && d.gender_context === genderContext
    );
    for (const row of targetRows) {
      if (row.reference_mean !== null && row.reference_mean !== undefined) {
        const diff = Math.abs(row.reference_mean - patientValue);
        if (diff < minDiff) {
          minDiff = diff;
          closestGroup = row.reference_group;
        }
      }
    }
    return closestGroup;
  };

  const formatValue = (value: number | null, unit: string) => {
    if (value === null || value === undefined) return 'N/A';
    const unitLower = unit.toLowerCase();
    const isPercent = unit.includes('%') || unitLower.includes('percent') || unitLower.includes('proportion');
    if (isPercent) {
      const val = value <= 1.0 && value >= 0 ? value * 100 : value;
      return `${val.toFixed(0)}%`;
    }
    if (unit.includes('°') || unitLower.includes('degree')) {
      return `${value.toFixed(1)}°`;
    }
    return value.toFixed(3);
  };

  const renderFilters = () => {
    if (activeMode !== 'assessment') {
      return null;
    }
    return (
      <div className="sticky top-0 z-30 flex flex-wrap gap-4 items-center justify-between p-4 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-xs mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">{t('referenceGroup.title')}:</span>
            <Select value={referenceGroup} onValueChange={(value) => setReferenceGroup(value as ReferenceGroup)}>
              <SelectTrigger className="w-36 h-9 bg-gray-50 border-gray-200 text-gray-900 text-xs hover:bg-gray-100 transition-colors">
                <SelectValue placeholder={t('referenceGroup.selectReference')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="control">{t('referenceGroup.options.control')}</SelectItem>
                <SelectItem value="asc">{t('referenceGroup.options.asc')}</SelectItem>
                <SelectItem value="adhd">{t('referenceGroup.options.adhd')}</SelectItem>
                <SelectItem value="sad">{t('referenceGroup.options.sad')}</SelectItem>
                <SelectItem value="depression">{t('referenceGroup.options.depression')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">{t('referenceGroup.genderTitle')}:</span>
            <Select value={gender} onValueChange={(value) => setGender(value as GenderBaseline)}>
              <SelectTrigger className="w-28 h-9 bg-gray-50 border-gray-200 text-gray-900 text-xs hover:bg-gray-100 transition-colors">
                <SelectValue placeholder={t('referenceGroup.selectGender')} />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 text-gray-900">
                <SelectItem value="all">{t('referenceGroup.genderOptions.all')}</SelectItem>
                <SelectItem value="male">{t('referenceGroup.genderOptions.male')}</SelectItem>
                <SelectItem value="female">{t('referenceGroup.genderOptions.female')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>


      </div>
    );
  };

  const renderInterpretabilityFootnote = () => {
    const title = modality === 'facial'
      ? t('facialView.computationTitle')
      : modality === 'mimicry'
        ? t('mimicryView.computationTitle')
        : modality === 'gaze'
          ? t('gazeView.computationTitle')
          : modality === 'vocal'
            ? t('vocalView.computationTitle')
            : t('referenceGroup.howComputed');
    const body = modality === 'facial'
      ? t('facialView.computationBody')
      : modality === 'mimicry'
        ? t('mimicryView.computationBody')
        : modality === 'gaze'
          ? t('gazeView.computationBody')
          : modality === 'vocal'
            ? t('vocalView.computationBody')
            : t(MODALITY_COMPUTATION_GUIDE_KEYS[modality]);

    return (
      <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 leading-relaxed">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">{title}</div>
        {body}
      </div>
    );
  };

  const renderModalityContent = () => {
    const jsonModality = MODALITY_JSON_MAP[modality] || modality;
    const jsonRefGroup = GROUP_JSON_MAP[referenceGroup] || referenceGroup;

    // Filter deviations for the current modality, reference group, and gender
    const modalityDeviations = patientDeviations.deviations.filter((d: any) =>
      d.modality === jsonModality &&
      d.reference_group === jsonRefGroup &&
      d.gender_context === gender
    );

    // Sort by display_order
    const sortedDeviations = [...modalityDeviations].sort((a: any, b: any) => {
      const orderA = typeof a.display_order === 'number' ? a.display_order : 999;
      const orderB = typeof b.display_order === 'number' ? b.display_order : 999;
      return orderA - orderB;
    });

    if (sortedDeviations.length === 0) {
      return (
        <div className="p-6 text-sm text-gray-500 border border-dashed border-gray-200 rounded-xl">
          {t('assessment.noDataAvailable')}
        </div>
      );
    }

    // Dynamic feature options for the pairwise dropdown list
    const featureOptions = sortedDeviations.map((d: any) => ({
      value: d.feature_id,
      label: t("features." + d.feature_id + ".name", d.display_name),
    }));

    const activeFeature = featureOptions.some((option) => option.value === pairwiseFeature)
      ? pairwiseFeature
      : featureOptions[0]?.value || '';
    const activeFeatureLabel = featureOptions.find((option) => option.value === activeFeature)?.label || '';

    // Group labels for the pairwise matrix
    const groupLabels = [
      t('facialView.groupLabels.control'),
      t('facialView.groupLabels.asc'),
      t('facialView.groupLabels.adhd'),
      t('facialView.groupLabels.sad'),
      t('facialView.groupLabels.depression'),
    ];

    const groupKeys = ['control', 'asc', 'adhd', 'sad', 'mdd'] as const;

    // Retrieve pairwise comparisons data for this modality
    const compData = (pairwiseGroupComparisons as any)[jsonModality];
    const comparisons = compData?.comparisons || [];

    const getDynamicPairwiseValue = (featureId: string, rowKey: string, colKey: string) => {
      const comp = comparisons.find((c: any) =>
        c.feature_id === featureId &&
        ((c.left_group === rowKey && c.right_group === colKey) ||
          (c.left_group === colKey && c.right_group === rowKey))
      );
      if (!comp) return '-';
      const qVal = comp.q_value_fdr_bh;
      const qStr = qVal < 0.001 ? 'q < .001' : `q = ${qVal.toFixed(3)}`;
      const esStr = `d = ${comp.effect_size.toFixed(2)}`;
      return (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{qStr}</div>
          <div className="text-[10px] text-gray-500">{esStr}</div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        {renderFilters()}

        {/* Modality Alert Box (if Gaze) */}
        {modality === 'gaze' && (
          <div className="rounded-lg border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={16} />
            <p>{t('gazeView.alertText')}</p>
          </div>
        )}

        {/* Visual Plot Card */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{t(`${modality}View.title`)}</h2>
              <p className="text-xs text-gray-500">{t(`${modality}View.subtitle`)}</p>
            </div>
            <div className="flex items-center gap-3">
              {modality === 'facial' && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">{t('facialView.signalLabel')}:</span>
                  <Select value={facialSignal} onValueChange={(value) => setFacialSignal(value as 'smile' | 'disgust' | 'all')}>
                    <SelectTrigger className="data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex items-center justify-between gap-2 rounded-md border px-3 py-2 whitespace-nowrap outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 w-28 h-9 bg-gray-50 border-gray-200 text-gray-900 text-xs hover:bg-gray-100 transition-colors">
                      <SelectValue placeholder={t('facialView.signalLabel')} />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 text-gray-900">
                      <SelectItem value="smile">{t('facialView.signalOptions.smile')}</SelectItem>
                      <SelectItem value="disgust">{t('facialView.signalOptions.disgust')}</SelectItem>
                      <SelectItem value="all">{t('facialView.signalOptions.all')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors shrink-0"
                    aria-label={t(`${modality}View.infoLabel`)}
                  >
                    <Info size={14} />
                  </button>
                </TooltipTrigger>
                <TooltipContent sideOffset={8} className="bg-black text-white border border-white/10 max-w-xs text-xs">
                  {t(`${modality}View.infoBody`)}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>


          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <img
              src={getCaseImage(modality as Exclude<Modality, 'overview'>, referenceGroup, gender, modality === 'facial' ? facialSignal : undefined)}
              alt={`${label} visualization`}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{t('referenceGroup.featureComparisonTitle')}</h3>
          <div className="overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="p-4 text-left font-semibold">{t('assessment.table.feature')}</th>
                  <th className="p-4 text-center font-semibold">{t('assessment.table.patient')}</th>
                  <th className="p-4 text-center font-semibold">{t('referenceGroup.referenceGroupLabel')}</th>
                  <th className="p-4 text-center font-semibold">{t('referenceGroup.deviationLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedDeviations.map((row: any, index: number) => {
                  const isValNA = row.patient_value === null || row.patient_value === undefined;
                  const patientStr = isValNA ? 'N/A' : formatValue(row.patient_value, row.unit);
                  const refStr = `${formatValue(row.reference_mean, row.unit)} ± ${formatValue(row.reference_std, row.unit)}`;
                  const devStr = isValNA
                    ? 'N/A'
                    : `${row.deviation_z_score > 0 ? '+' : ''}${row.deviation_z_score.toFixed(2)} SD (${t('assessment.percentileLabel', { percentile: row.percentile.toFixed(1) })})`;

                  return (
                    <tr key={row.feature_id} className={index === 0 ? 'border-t border-gray-100' : ''}>
                      <td className="p-4 text-gray-700 align-top">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900">{t("features." + row.feature_id + ".name", row.display_name)}</span>
                          {row.tooltip && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="p-0.5 text-gray-400 hover:text-gray-600 transition-colors">
                                  <Info size={12} />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent className="bg-black text-white border border-white/10 max-w-xs text-xs">
                                {t("features." + row.feature_id + ".tooltip", row.tooltip)}
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{t("features." + row.feature_id + ".unit", row.unit)}</div>
                      </td>
                      <td className="p-4 text-center text-gray-700">{patientStr}</td>
                      <td className="p-4 text-center text-gray-700">{refStr}</td>
                      <td className="p-4 text-center text-gray-700">{devStr}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {renderInterpretabilityFootnote()}
        </div>

        {/* Accordion Context Details */}
        <details className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <summary className="cursor-pointer text-sm font-bold text-gray-900">
            {t('facialView.referenceContextTitle')}
          </summary>

          <h4 className="text-sm font-bold text-gray-900 mt-6 mb-2">{t('facialView.closestReferenceHeading')}</h4>
          <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 leading-relaxed">
            {t('facialView.closestReferenceNote')}
          </div>

          {/* Closest Reference Context Table */}
          <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="p-4 text-left font-semibold">{t('assessment.table.feature')}</th>
                  <th className="p-4 text-center font-semibold">{t('facialView.closestReferenceLabel')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedDeviations.map((row: any, index: number) => {
                  const closestGroupKey = getClosestGroupForFeature(row.feature_id, gender, row.patient_value);
                  const closestGroupDisplay = closestGroupKey === 'mdd'
                    ? t('referenceGroup.options.depression')
                    : t(`referenceGroup.options.${closestGroupKey}`);

                  return (
                    <tr key={row.feature_id} className={index === 0 ? 'border-t border-gray-100' : ''}>
                      <td className="p-4 text-gray-700">{t("features." + row.feature_id + ".name", row.display_name)}</td>
                      <td className="p-4 text-center text-gray-700 font-semibold">{closestGroupDisplay}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pairwise Comparison Matrix */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h4 className="text-sm font-bold text-gray-900 mb-2">{t('facialView.pairwiseHeading')}</h4>
            <div className="text-xs text-gray-500 mb-4">{t('facialView.pairwiseTitle')}</div>
            <div className="max-w-sm mb-4">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('facialView.pairwiseFeatureLabel')}</div>
              <Select value={activeFeature} onValueChange={(value) => setPairwiseFeature(value)}>
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder={t('facialView.pairwiseFeatureLabel')} />
                </SelectTrigger>
                <SelectContent>
                  {featureOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 leading-relaxed">
              {t('referenceGroup.referenceDatasetNote')}
            </div>

            <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-xs text-teal-900 mb-4 space-y-1 mt-4">
              <div>
                {t('facialView.pairwiseTestTypeLabel')}: <span className="font-semibold">{compData?.comparisons[0]?.test_name || 'Mann-Whitney U'}</span>
              </div>
              {compData?.correction_method && (
                <div>
                  {t('statisticalCorrection.correctionLabel')}: <span className="font-semibold">{compData.correction_method === 'benjamini_hochberg_fdr' ? t('statisticalCorrection.methods.benjamini_hochberg_fdr') : compData.correction_method}</span>
                </div>
              )}
              {compData?.correction_scope && (
                <div>
                  {t('statisticalCorrection.scopeLabel')}: <span className="font-semibold text-teal-800">{t('statisticalCorrection.scopes.' + compData.correction_scope, compData.correction_scope)}</span>
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-gray-100">
                <thead>
                  <tr className="bg-gray-50 text-gray-500">
                    <th className="p-3 text-left font-semibold">
                      {t('facialView.pairwiseFeaturePrefix')} {activeFeatureLabel}
                    </th>
                    <th className="p-3 text-center font-semibold">{t('facialView.pairwiseControlHeader')}</th>
                    <th className="p-3 text-center font-semibold">{t('facialView.pairwiseAscHeader')}</th>
                    <th className="p-3 text-center font-semibold">{t('facialView.pairwiseAdhdHeader')}</th>
                    <th className="p-3 text-center font-semibold">{t('facialView.pairwiseSadHeader')}</th>
                    <th className="p-3 text-center font-semibold">{t('facialView.pairwiseDepressionHeader')}</th>
                  </tr>
                </thead>
                <tbody>
                  {groupLabels.map((rowLabel, rowIndex) => (
                    <tr key={rowLabel} className={rowIndex === 0 ? 'border-t border-gray-100' : ''}>
                      <td className="p-3 text-gray-700 font-semibold">{rowLabel}</td>
                      {groupKeys.map((colKey, colIndex) => {
                        const rowKey = groupKeys[rowIndex];
                        return (
                          <td key={`${rowKey}-${colKey}`} className="p-3 text-center text-gray-700">
                            {rowIndex === colIndex ? '-' : getDynamicPairwiseValue(activeFeature, rowKey, colKey)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </details>
      </div>
    );
  };

  const renderLearningContent = (content: {
    goal: string;
    interpretation: string;
    alerts: string[];
    dataCollection: string;
    clinicalTitle: string;
    clinicalItems: { title: string; body: string }[];
  }) => {
    const getPrototypeSvgPath = (mod: string, refGroup: string, gen: string, extraOption?: string) => {
      const jsonMod = MODALITY_JSON_MAP[mod] || mod;
      const jsonRef = GROUP_JSON_MAP[refGroup] || refGroup;

      const proto = prototypicalCases.prototypes.find((p: any) =>
        p.modality === jsonMod &&
        p.reference_group === jsonRef &&
        p.gender_context === gen
      );
      if (!proto) return '';

      const assetsObj = proto.assets;
      if (!assetsObj) return '';

      const assetKeys = Object.keys(assetsObj);
      if (assetKeys.length === 0) return '';

      if (jsonMod === 'facial') {
        const sig = extraOption || 'all';
        const matchingKey = assetKeys.find(k => k.includes(`signal-${sig}`));
        if (matchingKey && assetsObj[matchingKey]) {
          return `/${assetsObj[matchingKey].svg_path}`;
        }
      }

      const firstKey = assetKeys[0];
      if (firstKey && assetsObj[firstKey]) {
        return `/${assetsObj[firstKey].svg_path}`;
      }

      return '';
    };

    const fallbackImages = LEARNING_EXAMPLES[modality as Exclude<Modality, 'overview'>] || { control: '', asc: '' };
    const leftImage = getPrototypeSvgPath(modality, 'asc', gender, modality === 'facial' ? facialSignal : undefined) || fallbackImages.asc;
    const rightImage = getPrototypeSvgPath(modality, referenceGroup, gender, modality === 'facial' ? facialSignal : undefined) ||
      (referenceGroup === 'asc' ? fallbackImages.asc : fallbackImages.control);

    const jsonModality = MODALITY_JSON_MAP[modality] || modality;
    const statsForModality = (learningStatistics as any)[jsonModality] || [];

    const featureOptions = statsForModality.map((feat: any) => ({
      value: feat.feature_id,
      label: t("features." + feat.feature_id + ".name", feat.display_name),
    }));

    const activeFeature = featureOptions.some((option) => option.value === pairwiseFeature)
      ? pairwiseFeature
      : featureOptions[0]?.value || '';
    const activeFeatureLabel = featureOptions.find((option) => option.value === activeFeature)?.label || '';

    const groupLabels = [
      t('facialView.groupLabels.control'),
      t('facialView.groupLabels.asc'),
      t('facialView.groupLabels.adhd'),
      t('facialView.groupLabels.sad'),
      t('facialView.groupLabels.depression'),
    ];

    const groupKeys = ['control', 'asc', 'adhd', 'sad', 'mdd'] as const;

    const compData = (pairwiseGroupComparisons as any)[jsonModality];
    const comparisons = compData?.comparisons || [];

    const getDynamicPairwiseValue = (featureId: string, rowKey: string, colKey: string) => {
      const comp = comparisons.find((c: any) =>
        c.feature_id === featureId &&
        ((c.left_group === rowKey && c.right_group === colKey) ||
          (c.left_group === colKey && c.right_group === rowKey))
      );
      if (!comp) return '-';
      const qVal = comp.q_value_fdr_bh;
      const qStr = qVal < 0.001 ? 'q < .001' : `q = ${qVal.toFixed(3)}`;
      const esStr = `d = ${comp.effect_size.toFixed(2)}`;
      return (
        <div className="text-center">
          <div className="font-semibold text-gray-900">{qStr}</div>
          <div className="text-[10px] text-gray-500">{esStr}</div>
        </div>
      );
    };

    const leftLabel = t('learning.prototypeAscLabel');
    const rightLabel = t('learning.prototypeRefLabel', {
      groupName: referenceGroup === 'depression'
        ? t('referenceGroup.options.depression')
        : t(`referenceGroup.options.${referenceGroup}`)
    });

    return (
      <div className="space-y-6">
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
            <h3 className="text-lg font-bold text-gray-900">{t('learning.exampleReferencePatternsTitle')}</h3>
            <div className="flex items-center gap-3">
              {/* Reference Group Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{t('referenceGroup.title')}:</span>
                <Select value={referenceGroup} onValueChange={(value) => setReferenceGroup(value as ReferenceGroup)}>
                  <SelectTrigger className="w-36 h-9 bg-gray-50 border-gray-200 text-gray-900 text-xs hover:bg-gray-100 transition-colors">
                    <SelectValue placeholder={t('referenceGroup.selectReference')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="control">{t('referenceGroup.options.control')}</SelectItem>
                    <SelectItem value="asc">{t('referenceGroup.options.asc')}</SelectItem>
                    <SelectItem value="adhd">{t('referenceGroup.options.adhd')}</SelectItem>
                    <SelectItem value="sad">{t('referenceGroup.options.sad')}</SelectItem>
                    <SelectItem value="depression">{t('referenceGroup.options.depression')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Gender Select */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-700">{t('referenceGroup.genderTitle')}:</span>
                <Select value={gender} onValueChange={(value) => setGender(value as GenderBaseline)}>
                  <SelectTrigger className="w-28 h-9 bg-gray-50 border-gray-200 text-gray-900 text-xs hover:bg-gray-100 transition-colors">
                    <SelectValue placeholder={t('referenceGroup.selectGender')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 text-gray-900">
                    <SelectItem value="all">{t('referenceGroup.genderOptions.all')}</SelectItem>
                    <SelectItem value="male">{t('referenceGroup.genderOptions.male')}</SelectItem>
                    <SelectItem value="female">{t('referenceGroup.genderOptions.female')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {t('learning.exampleReferencePatternsDesc')}
          </p>

          {/* Facial Signal Dropdown (if Facial) */}
          {modality === 'facial' && (
            <div className="mb-6 max-w-xs">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('facialView.signalLabel')}</div>
              <Select value={facialSignal} onValueChange={(value) => setFacialSignal(value as 'smile' | 'disgust' | 'all')}>
                <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                  <SelectValue placeholder={t('facialView.signalLabel')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smile">{t('facialView.signalOptions.smile')}</SelectItem>
                  <SelectItem value="disgust">{t('facialView.signalOptions.disgust')}</SelectItem>
                  <SelectItem value="all">{t('facialView.signalOptions.all')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900">{leftLabel}</div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <img src={leftImage} alt="ASC group pattern example" className="w-full h-auto" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm font-semibold text-gray-900">{rightLabel}</div>
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <img src={rightImage} alt="Reference group pattern example" className="w-full h-auto" />
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
            {t('learning.noteBox')}
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Visual Interpretation</h2>
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Goal</div>
              <p className="mt-2">{content.goal}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Interpretation</div>
              <p className="mt-2">{content.interpretation}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {content.alerts.map((alert) => (
              <div key={alert} className="flex items-start gap-3 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={18} />
                <p className="text-sm text-orange-800">{alert}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">{content.clinicalTitle}</h3>
          <div className="space-y-4 text-sm text-gray-700">
            {content.clinicalItems.map((item) => (
              <div key={item.title}>
                <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">{item.title}</div>
                <p className="mt-2">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{t('learning.dataCollectionTitle', 'Data Collection')}</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{content.dataCollection}</p>
        </section>

        {/* Group Statistics Summary */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-3">{t('learning.groupStatsTitle', 'Group Statistics Summary')}</h3>
          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-100">
                  <th className="p-3 font-semibold">{t('assessment.table.feature')}</th>
                  <th className="p-3 font-semibold text-center">{t('assessment.table.control')}</th>
                  <th className="p-3 font-semibold text-center">{t('assessment.table.asc')}</th>
                  <th className="p-3 font-semibold text-center">{t('assessment.table.adhd')}</th>
                  <th className="p-3 font-semibold text-center">{t('assessment.table.sad')}</th>
                  <th className="p-3 font-semibold text-center">{t('assessment.table.depression')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {statsForModality.map((feat: any) => {
                  const getGroupStatsCell = (groupKey: string) => {
                    const g = feat.groups[groupKey];
                    if (!g) return <td key={groupKey} className="p-3 text-center text-gray-400">-</td>;
                    return (
                      <td key={groupKey} className="p-3 text-center text-gray-700">
                        <div className="font-semibold">{g.mean.toFixed(2)} ± {g.std.toFixed(2)}</div>
                        <div className="text-[10px] text-gray-500">Med: {g.median.toFixed(2)} ({g.iqr.toFixed(2)})</div>
                        <div className="text-[9px] text-gray-400 font-medium">n = {g.valid_n}</div>
                      </td>
                    );
                  };
                  return (
                    <tr key={feat.feature_id} className="hover:bg-gray-50/55 transition-colors">
                      <td className="p-3 text-gray-900 font-medium max-w-xs">
                        <div className="font-semibold">{t("features." + feat.feature_id + ".name", feat.display_name)}</div>
                        <div className="text-[10px] text-gray-500">{t("features." + feat.feature_id + ".unit", feat.unit)}</div>
                      </td>
                      {getGroupStatsCell('control')}
                      {getGroupStatsCell('asc')}
                      {getGroupStatsCell('adhd')}
                      {getGroupStatsCell('sad')}
                      {getGroupStatsCell('mdd')}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pairwise Comparison Matrix */}
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="text-sm font-bold text-gray-900 mb-3">{t('facialView.pairwiseTitle')}</div>
          <div className="max-w-sm mb-4">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{t('facialView.pairwiseFeatureLabel')}</div>
            <Select value={activeFeature} onValueChange={(value) => setPairwiseFeature(value)}>
              <SelectTrigger className="w-full bg-gray-50 border-gray-200">
                <SelectValue placeholder={t('facialView.pairwiseFeatureLabel')} />
              </SelectTrigger>
              <SelectContent>
                {featureOptions.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700 leading-relaxed mb-4">
            {t('referenceGroup.referenceDatasetNote')}
          </div>

          <div className="rounded-lg border border-teal-100 bg-teal-50 p-3 text-xs text-teal-900 mb-4 space-y-1">
            <div>
              {t('facialView.pairwiseTestTypeLabel')}: <span className="font-semibold">{compData?.comparisons[0]?.test_name || 'Mann-Whitney U'}</span>
            </div>
            {compData?.correction_method && (
              <div>
                {t('statisticalCorrection.correctionLabel')}: <span className="font-semibold">{compData.correction_method === 'benjamini_hochberg_fdr' ? t('statisticalCorrection.methods.benjamini_hochberg_fdr') : compData.correction_method}</span>
              </div>
            )}
            {compData?.correction_scope && (
              <div>
                {t('statisticalCorrection.scopeLabel')}: <span className="font-semibold text-teal-800">{t('statisticalCorrection.scopes.' + compData.correction_scope, compData.correction_scope)}</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-gray-100">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="p-3 text-left font-semibold">
                    {t('facialView.pairwiseFeaturePrefix')} {activeFeatureLabel}
                  </th>
                  <th className="p-3 text-center font-semibold">{t('facialView.pairwiseControlHeader')}</th>
                  <th className="p-3 text-center font-semibold">{t('facialView.pairwiseAscHeader')}</th>
                  <th className="p-3 text-center font-semibold">{t('facialView.pairwiseAdhdHeader')}</th>
                  <th className="p-3 text-center font-semibold">{t('facialView.pairwiseSadHeader')}</th>
                  <th className="p-3 text-center font-semibold">{t('facialView.pairwiseDepressionHeader')}</th>
                </tr>
              </thead>
              <tbody>
                {groupLabels.map((rowLabel, rowIndex) => (
                  <tr key={rowLabel} className={rowIndex === 0 ? 'border-t border-gray-100' : ''}>
                    <td className="p-3 text-gray-700 font-semibold">{rowLabel}</td>
                    {groupKeys.map((colKey, colIndex) => {
                      const rowKey = groupKeys[rowIndex];
                      return (
                        <td key={`${rowKey}-${colKey}`} className="p-3 text-center text-gray-700">
                          {rowIndex === colIndex ? '-' : getDynamicPairwiseValue(activeFeature, rowKey, colKey)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  };

  if (activeMode === 'learning' && (modality === 'gaze' || modality === 'facial' || modality === 'vocal' || modality === 'head' || modality === 'mimicry')) {
    const content = {
      goal: t(`learningDetails.${modality}.goal`),
      interpretation: t(`learningDetails.${modality}.interpretation`),
      alerts: t(`learningDetails.${modality}.alerts`, { returnObjects: true }) as string[],
      clinicalTitle: t(`learningDetails.${modality}.clinicalTitle`),
      clinicalItems: t(`learningDetails.${modality}.clinicalItems`, { returnObjects: true }) as { title: string; body: string }[],
      dataCollection: t(`learningDetails.${modality}.dataCollection`),
    };

    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {renderLearningContent(content)}
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {modality !== 'overview' && data ? (
        renderModalityContent()
      ) : (
        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center">
              <Activity size={18} className="text-teal-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{label}</h2>
              <p className="text-xs text-gray-500">{description}</p>
            </div>
          </div>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-sm text-gray-500">
            {t('dataAssessment.modalityPlaceholder')}
          </div>
        </section>
      )}
    </div>
  );
};

const parsePath = (path: string) => {
  const parts = path.split('/').filter(Boolean);
  const token = parts[0];
  if (token && PATIENT_TOKENS[token]) {
    const caseId = PATIENT_TOKENS[token];
    const restPath = '/' + parts.slice(1).join('/');
    return { token, caseId, restPath };
  }
  return { token: null, caseId: null, restPath: path };
};

export default function App() {
  const getRouteForMode = (mode: ViewMode): RouteView => {
    if (mode === 'screening') return 'model';
    if (mode === 'learning') return 'learning';
    return 'data';
  };

  const getRouteStateFromPath = (path: string): { route: RouteView; modality: Modality | null } => {
    const { restPath } = parsePath(path);
    if (restPath === '/' || restPath.startsWith('/welcome')) {
      return { route: 'welcome', modality: null };
    }

    if (restPath.startsWith('/data-assessment')) {
      const parts = restPath.split('/').filter(Boolean);
      const maybeModality = parts[1];

      if (maybeModality && MODALITY_IDS.includes(maybeModality as Modality)) {
        return { route: 'data', modality: maybeModality as Modality };
      }

      return { route: 'data', modality: 'overview' };
    }

    if (restPath.startsWith('/learning')) {
      const parts = restPath.split('/').filter(Boolean);
      const maybeModality = parts[1];

      if (maybeModality && MODALITY_IDS.includes(maybeModality as Modality)) {
        return { route: 'learning', modality: maybeModality as Modality };
      }

      return { route: 'learning', modality: 'overview' };
    }

    if (restPath.startsWith('/model')) {
      return { route: 'model', modality: null };
    }

    return { route: 'welcome', modality: null };
  };

  const initialParse = typeof window === 'undefined'
    ? { token: null, caseId: null, restPath: '/' }
    : parsePath(window.location.pathname);

  const [activeToken, setActiveToken] = useState<string | null>(initialParse.token);
  const [tokenInput, setTokenInput] = useState('');
  const [loginError, setLoginError] = useState(false);

  const initialRouteState = typeof window === 'undefined'
    ? { route: 'welcome', modality: null }
    : getRouteStateFromPath(window.location.pathname);
  const [routeState, setRouteState] = useState(initialRouteState);
  const [activeMode, setActiveMode] = useState<ViewMode>('screening');
  const [referenceGroup, setReferenceGroup] = useState<ReferenceGroup>('control');
  const [gender, setGender] = useState<GenderBaseline>('all');
  const { t } = useTranslation();

  const setRoutePath = (nextRoute: RouteView, nextModality: Modality | null = null) => {
    const effectiveModality = (nextRoute === 'data' || nextRoute === 'learning') && !nextModality ? 'overview' : nextModality;
    const prefix = activeToken ? `/${activeToken}` : '';
    const nextPath = nextRoute === 'welcome'
      ? `${prefix}/welcome`
      : nextRoute === 'data'
        ? `${prefix}/data-assessment${nextModality ? `/${nextModality}` : ''}`
        : nextRoute === 'learning'
          ? `${prefix}/learning${nextModality ? `/${nextModality}` : ''}`
          : `${prefix}/model`;
    window.history.pushState({}, '', nextPath);
    setRouteState({ route: nextRoute, modality: effectiveModality });
  };

  React.useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePath(window.location.pathname);
      setActiveToken(parsed.token);
      setRouteState(getRouteStateFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  React.useEffect(() => {
    if (routeState.route === 'learning') {
      setActiveMode('learning');
    } else if (routeState.route === 'data') {
      setActiveMode('assessment');
    } else if (routeState.route === 'model') {
      setActiveMode('screening');
    }
  }, [routeState.route]);

  const patientCaseId = activeToken ? PATIENT_TOKENS[activeToken] : null;
  const patientData = patientCaseId ? PATIENTS[patientCaseId] : null;

  const modes: ModeOption[] = [
    {
      id: 'screening',
      label: t('modes.screening.label'),
      icon: Activity,
      desc: t('modes.screening.description')
    },
    {
      id: 'assessment',
      label: t('modes.assessment.label'),
      icon: Stethoscope,
      desc: t('modes.assessment.description')
    },
    {
      id: 'learning',
      label: t('modes.learning.label'),
      icon: GraduationCap,
      desc: t('modes.learning.description')
    },
  ];

  const isWelcomeRoute = routeState.route === 'welcome';
  const isDataRoute = routeState.route === 'data' || routeState.route === 'learning';
  const activeModality = routeState.modality;

  const modalities = [
    {
      id: 'overview',
      label: t('modalities.overview.label'),
      icon: Layers,
      desc: t('modalities.overview.description'),
    },
    {
      id: 'facial',
      label: t('modalities.facial.label'),
      icon: Smile,
      desc: t('modalities.facial.description'),
    },
    {
      id: 'mimicry',
      label: t('modalities.mimicry.label'),
      icon: Theater,
      desc: t('modalities.mimicry.description'),
    },
    {
      id: 'gaze',
      label: t('modalities.gaze.label'),
      icon: Eye,
      desc: t('modalities.gaze.description'),
    },
    {
      id: 'head',
      label: t('modalities.head.label'),
      icon: Move,
      desc: t('modalities.head.description'),
    },
    {
      id: 'vocal',
      label: t('modalities.vocal.label'),
      icon: Mic,
      desc: t('modalities.vocal.description'),
    },
  ] as const;

  const overviewItem = modalities.find((modality) => modality.id === 'overview');
  const modalityItems = modalities.filter((modality) => modality.id !== 'overview');
  const faceTrackingValue = DATA_QUALITY_ITEMS.find((item) => item.labelKey === 'quality.faceTracking')?.value ?? 0;
  const audioQualityValue = DATA_QUALITY_ITEMS.find((item) => item.labelKey === 'quality.audioQuality')?.value ?? 0;


  if (!activeToken) {
    const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const cleanToken = tokenInput.trim().replace(/^\//, '');
      if (PATIENT_TOKENS[cleanToken]) {
        setActiveToken(cleanToken);
        setLoginError(false);
        const nextPath = `/${cleanToken}/welcome`;
        window.history.pushState({}, '', nextPath);
        setRouteState({ route: 'welcome', modality: null });
      } else {
        setLoginError(true);
      }
    };

    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Background gradient decorative glow circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 relative z-10">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 mb-2">
              <Lock className="text-teal-400" size={28} />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">{t('portal.title')}</h1>
            <p className="text-sm text-gray-400">
              {t('portal.subtitle')}
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="token" className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                {t('portal.label')}
              </label>
              <input
                id="token"
                type="text"
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setLoginError(false);
                }}
                className={`w-full bg-white/[0.05] border ${loginError ? 'border-red-500' : 'border-white/10'
                  } rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors text-sm`}
                placeholder={t('portal.placeholder')}
                autoFocus
              />
              {loginError && (
                <p className="text-xs text-red-400 font-semibold flex items-center gap-1 mt-1">
                  <AlertTriangle size={12} />
                  {t('portal.error')}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 hover:bg-teal-500 text-white rounded-xl py-3 font-bold text-sm transition-colors shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 cursor-pointer border-0"
            >
              {t('portal.submit')}
              <ArrowRight size={16} />
            </button>
          </form>

          <div className="text-[11px] text-gray-500 text-center leading-relaxed">
            {t('portal.disclaimer')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-teal-100">
      {/* Header */}
      <header className="h-20 bg-[#121212] flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-gray-800 sticky top-0 z-50">
        <div className="flex items-center min-w-0">
          <button
            type="button"
            onClick={() => setRoutePath('welcome')}
            className="flex items-center gap-2 focus:outline-hidden hover:opacity-90 transition-opacity shrink-0"
            aria-label={t('welcome.title')}
          >
            <img
              src={appLogo}
              alt="SIT-Insight logo"
              className="w-10 h-10 rounded-lg object-contain bg-black"
            />
            <span className="text-white font-black text-xl tracking-tight hidden sm:inline">SIT-Insight</span>
          </button>


        </div>

        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 xl:gap-8 text-gray-400 min-w-0">
          {!isWelcomeRoute && (
            <>
              <div className="flex items-center gap-3">
                <div className="hidden 2xl:flex items-center gap-2 text-xs font-semibold text-gray-300 shrink-0">
                  {t('settings.analysisMode')}
                </div>
                <div className="flex items-center rounded-full bg-white/10 p-1 shrink-0">
                  {modes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => {
                        setActiveMode(mode.id);
                        setRoutePath(getRouteForMode(mode.id), activeModality);
                      }}
                      className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${activeMode === mode.id
                        ? 'bg-white text-gray-900'
                        : 'text-gray-200 hover:bg-white/20'
                        }`}
                      aria-pressed={activeMode === mode.id}
                    >
                      <mode.icon size={14} />
                      <span className={activeMode === mode.id ? "hidden lg:inline shrink-0" : "hidden 2xl:inline shrink-0"}>
                        {mode.label}
                      </span>
                    </button>
                  ))}
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                      aria-label={t('settings.analysisModeInfo')}
                    >
                      <Info size={14} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent sideOffset={8} className="bg-black text-white border border-white/10 max-w-xs">
                    {t('settings.analysisModeInfo')}
                  </TooltipContent>
                </Tooltip>
              </div>
            </>
          )}
          <LanguageSwitcher />
        </div>
      </header>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] overflow-hidden">
        {/* Sidebar */}
        {!isWelcomeRoute && (
          <aside className="w-80 bg-gray-50 border-r border-gray-100 flex flex-col p-6 overflow-y-auto hidden lg:flex">
            <div className="mb-8">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t('sidebar.currentPatient')}</label>
              <div className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm">
                {activeMode === 'learning' ? (
                  <div className="py-1">
                    <div className="font-bold text-gray-900 mb-1">{t('sidebar.trainingExample')}</div>
                    <div className="text-gray-500 text-sm">{t('sidebar.noActivePatientCase')}</div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-black text-xl text-gray-900 mb-1">
                          Patient #{patientData?.screeningResult.participant_id}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono tracking-wider">{activeToken}</div>
                      </div>
                      <button
                        onClick={() => {
                          setActiveToken(null);
                          setTokenInput('');
                          window.history.pushState({}, '', '/');
                          setRouteState({ route: 'welcome', modality: null });
                        }}
                        title={t('portal.lockSession')}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors border-0 bg-transparent cursor-pointer"
                        aria-label={t('portal.lockSession')}
                      >
                        <Lock size={16} />
                      </button>
                    </div>
                    <div className="text-[13px] text-gray-500">{t('sidebar.sitDate')}: {t('sidebar.sitDateValue')}</div>
                    <div className="mt-2 space-y-1.5 text-[12px] text-gray-500">
                      <div className="flex justify-between">
                        <span>{t('sidebar.analysisStatus')}</span>
                        <span className="font-semibold text-gray-700">{t('sidebar.statusComplete')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('sidebar.dataQuality')}</span>
                        <span className="font-semibold text-gray-700">{t('sidebar.qualityUsable')}</span>
                      </div>
                    </div>
                    <details className="mt-2 text-[12px] text-gray-500">
                      <summary className="cursor-pointer font-semibold text-gray-600 hover:text-gray-800">{t('sidebar.details')}</summary>
                      <div className="mt-2 flex justify-between">
                        <span>{t('quality.faceTracking')}</span>
                        <span className="font-semibold text-gray-700">{faceTrackingValue}%</span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span>{t('quality.audioQuality')}</span>
                        <span className="font-semibold text-gray-700">{t('sidebar.qualityUsable')}</span>
                      </div>
                    </details>
                  </>
                )}
              </div>
            </div>

            {isDataRoute && (
              <div className="mb-8">
                <div className="space-y-2">
                  {overviewItem ? (
                    <ModeButton
                      key={overviewItem.id}
                      active={activeModality === overviewItem.id}
                      onClick={() => setRoutePath(activeMode === 'learning' ? 'learning' : 'data', overviewItem.id)}
                      icon={overviewItem.icon}
                      label={overviewItem.label}
                      description={overviewItem.desc}
                    />
                  ) : null}
                </div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-5 mb-4 block">{t('sidebar.overviewMenu')}</label>
                <div className="space-y-2">
                  {modalityItems.map((modality) => (
                    <ModeButton
                      key={modality.id}
                      active={activeModality === modality.id}
                      onClick={() => setRoutePath(activeMode === 'learning' ? 'learning' : 'data', modality.id)}
                      icon={modality.icon}
                      label={modality.label}
                      description={modality.desc}
                    />
                  ))}
                </div>
              </div>
            )}


            <div className="mt-auto pt-6 border-t border-gray-200">
              <div className="p-4 bg-teal-900 rounded-xl text-white">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-300">{t('sidebar.aiStatusTitle')}</span>
                </div>
                <div className="mt-2 flex items-start text-xs text-teal-100">
                  <span className="w-20 shrink-0">{t('sidebar.modelLabel')}</span>
                  <span className="ml-2 text-right font-semibold text-white">{t('sidebar.modelName')}</span>
                </div>
                <details className="mt-3 text-xs text-teal-100">
                  <summary className="cursor-pointer font-semibold text-teal-200 hover:text-white">{t('sidebar.details')}</summary>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start">
                      <span className="w-20 shrink-0">{t('sidebar.datasetSize')}</span>
                      <span className="ml-2 flex-1 text-right font-semibold text-white">{t('sidebar.datasetValue')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-20 shrink-0">{t('sidebar.inputs')}</span>
                      <span className="ml-2 flex-1 text-right font-semibold text-white">{t('sidebar.inputsValue')}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="w-20 shrink-0">{t('sidebar.output')}</span>
                      <span className="ml-2 flex-1 text-right font-semibold text-white">{t('sidebar.outputValue')}</span>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </aside>
        )}

        {/* Mobile Mode Switcher (Tab-like) */}
        {!isWelcomeRoute && isDataRoute && (
          <div className="lg:hidden flex overflow-x-auto p-4 gap-2 bg-gray-50 border-b border-gray-100">
            {modalities.map((modality) => (
              <button
                key={modality.id}
                onClick={() => setRoutePath(activeMode === 'learning' ? 'learning' : 'data', modality.id)}
                className={`flex-none px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${activeModality === modality.id
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200'
                  }`}
              >
                <modality.icon size={16} />
                {modality.label}
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 bg-white overflow-y-auto relative">
          {isWelcomeRoute ? (
            <WelcomeView
              modes={modes}
              activeMode={isWelcomeRoute ? null : activeMode}
              onSelectMode={(mode) => {
                setActiveMode(mode);
                setRoutePath(getRouteForMode(mode));
              }}
            />
          ) : isDataRoute ? (
            activeModality && activeModality !== 'overview'
              ? <DataModalityView
                modality={activeModality}
                activeMode={activeMode}
                referenceGroup={referenceGroup}
                setReferenceGroup={setReferenceGroup}
                gender={gender}
                setGender={setGender}
                patientData={patientData!}
              />
              : <DataAssessmentView activeMode={activeMode} patientData={patientData!} />
          ) : (
            <>
              {activeMode === 'screening' && <ScreeningView patientData={patientData!} />}
              {activeMode === 'learning' && <LearningView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}