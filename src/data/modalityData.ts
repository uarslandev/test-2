import facialIntensity from './images/facial positive intensity.png';
import gazeHeatmap from './images/gaze__group-adhd__gender-all.png';
import headVisualization from './images/head vis.png';
import mimicVisualization from './images/mimicry__gender-all.png';
import vocalVisualization from './images/voice vis.png';

export const modalityData = {
  gaze: {
    image: gazeHeatmap,
    features: [
      {
        id: 'horizontal-gaze-angle',
        name: 'Horizontal gaze angle',
        detail: 'Variance',
        patient: '4.8 deg',
        control: '3.2 deg',
        asc: '5.1 deg',
      },
      {
        id: 'gaze-fixation-screen',
        name: 'Gaze fixation on the screen',
        detail: 'Time-wise %',
        patient: '62%',
        control: '71%',
        asc: '58%',
      },
      {
        id: 'gaze-fixation-partner',
        name: 'Gaze fixation on the interaction partner',
        detail: 'Time-wise %',
        patient: '21%',
        control: '18%',
        asc: '28%',
      },
    ],
  },
  facial: {
    image: facialIntensity,
    features: [
      {
        id: 'smile-intensity',
        name: 'Smile intensity of mouth and eye region',
        rows: [
          {
            id: 'smile-mean',
            label: 'Mean over time',
            patient: '0.62',
            control: '0.58',
            asc: '0.49',
          },
          {
            id: 'smile-variance',
            label: 'Variance over time',
            patient: '0.18',
            control: '0.14',
            asc: '0.22',
          },
        ],
      },
      {
        id: 'eyebrow-lowerer',
        name: 'Eye brown lowerer',
        rows: [
          {
            id: 'brow-mean',
            label: 'Mean over time',
            patient: '0.41',
            control: '0.37',
            asc: '0.52',
          },
          {
            id: 'brow-variance',
            label: 'Variance over time',
            patient: '0.12',
            control: '0.10',
            asc: '0.16',
          },
        ],
      },
      {
        id: 'general-facial-intensity',
        name: 'General facial intensity',
        rows: [
          {
            id: 'facial-mean',
            label: 'Mean over time',
            patient: '0.55',
            control: '0.51',
            asc: '0.47',
          },
          {
            id: 'facial-variance',
            label: 'Variance over time',
            patient: '0.15',
            control: '0.12',
            asc: '0.19',
          },
        ],
      },
    ],
  },
  vocal: {
    image: vocalVisualization,
    features: [
      {
        id: 'pitch-variance',
        name: 'Pitch',
        rows: [
          {
            id: 'pitch-variance-row',
            label: 'Variance',
            patient: '18.4',
            control: '14.2',
            asc: '21.1',
          },
        ],
      },
      {
        id: 'speed',
        name: 'Speed',
        rows: [
          {
            id: 'speed-mean',
            label: 'Mean',
            patient: '1.18',
            control: '1.25',
            asc: '1.06',
          },
          {
            id: 'speed-variance',
            label: 'Variance',
            patient: '0.12',
            control: '0.09',
            asc: '0.16',
          },
        ],
      },
      {
        id: 'loudness-variance',
        name: 'Loudness',
        rows: [
          {
            id: 'loudness-variance-row',
            label: 'Variance',
            patient: '6.8',
            control: '5.9',
            asc: '7.4',
          },
        ],
      },
    ],
  },
  head: {
    image: headVisualization,
    features: [
      {
        id: 'head-dynamics',
        name: 'Nodding and horizontal movement dynamics',
        rows: [
          {
            id: 'nodding-count',
            label: 'Nodding count',
            patient: '18.4 semitones',
            control: '14.2',
            asc: '16.5',
          },
          {
            id: 'horizontal-head-movement',
            label: 'Horizontal head movement',
            patient: '1.18 segments/s',
            control: '1.25',
            asc: '1.30',
          },
          {
            id: 'horizontal-movement-variability',
            label: 'Horizontal movement variability',
            patient: '1.18 segments/s',
            control: '1.25',
            asc: '1.30',
          },
        ],
      },
    ],
  },
  mimicry: {
    image: mimicVisualization,
    features: [
      {
        id: 'cross-correlation',
        name: 'Cross-correlation',
        rows: [
          {
            id: 'cross-correlation-row',
            label: 'Score',
            patient: '0.62',
            control: '0.70',
            asc: '0.54',
          },
        ],
      },
      {
        id: 'dtw',
        name: 'DTW',
        rows: [
          {
            id: 'dtw-row',
            label: 'Distance',
            patient: '1.24',
            control: '1.01',
            asc: '1.38',
          },
        ],
      },
    ],
  },
} as const;
