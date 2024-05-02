type Model = {
  model: string;
  context_length: number;
  vocabulary_size: number;
  nb_parameters: number;
  nb_layers: number;
  nb_dimensions: number;
  nb_heads: number;
  nb_ffn_layers: number;
  nb_tokens: number;
  gqa: boolean;
};

type ColumnMetadata = {
  accessor: string;
  name: string;
  abbr: string;
  description: string;
};

type ModelMetadata = {
  family: string;
  description: string;
  urlPaper: string;
  source: string;
  firm: string;
  releaseDate: string;
};

type Metadata = {
  columns: ColumnMetadata[];
  models: ModelMetadata[];
};
