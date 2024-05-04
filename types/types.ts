type Model = {
  model: string;
  release_date: string;
  context_length: number;
  vocabulary_size: number;
  nb_parameters: number;
  nb_layers: number;
  nb_dimensions: number;
  nb_heads: number;
  nb_ffn_layers: number;
  nb_tokens: number;
  gqa: boolean;
  activation: string;
  hardware: string;
  gpu_hours: number;
  gpu_power: number;
  tco2eq: number;
};

type ColumnMetadata = {
  accessor: string;
  name: string;
  abbr: string;
  description: string;
  isMath: string;
};

type ModelMetadata = {
  family: string;
  description: string;
  urlPaper: string;
  source: string;
  company: string;
  releaseDate: string;
};

type ActivationMetadata = {
  name: string;
  formula: string;
};

type Metadata = {
  columns: ColumnMetadata[];
  models: ModelMetadata[];
  activations: ActivationMetadata[];
};
