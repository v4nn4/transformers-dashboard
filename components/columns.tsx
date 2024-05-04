import "@/styles/globals.css";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Cross1Icon,
  CheckIcon,
  CaretSortIcon,
  InfoCircledIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const accessors = [
  "model",
  "release_date",
  "context_length",
  "vocabulary_size",
  "nb_tokens",
  "nb_parameters",
  "nb_layers",
  "nb_heads",
  "nb_dimensions",
  "nb_ffn_layers",
  "activation",
  "gqa",
  "hardware",
  "gpu_power",
  "gpu_hours",
  "tco2eq",
];

const hiddenColumns = [
  "releaase_date",
  "activation",
  "gqa",
  "hardware",
  "gpu_power",
  "gpu_hours",
  "tco2eq",
];

const getModelMetadata = (
  modelName: any,
  desc: ModelMetadata[]
): ModelMetadata => {
  return desc.filter((metadata) => modelName.startsWith(metadata.family))[0];
};

const getColumnMetadata = (
  accessor: string,
  desc: ColumnMetadata[]
): ColumnMetadata => {
  return desc.filter((metadata) => metadata.accessor === accessor)[0];
};

const getActivationFormula = (
  activation: string,
  desc: ActivationMetadata[]
): string => {
  const metadata = desc.filter((metadata) => activation === metadata.name);
  if (metadata === undefined) {
    return "-";
  } else {
    if (metadata.length == 1) {
      return metadata[0].formula;
    } else {
      return "-";
    }
  }
};

const getImage = (source: string) => {
  return (
    <>
      <Image
        src={`./images/logos/${source}.svg`}
        width={20}
        height={20}
        alt={source}
        className="block dark:hidden"
      />
      <Image
        src={`./images/logos/${source}_dark.svg`}
        width={20}
        height={20}
        alt={source}
        className="hidden dark:block"
      />{" "}
    </>
  );
};

const buildInitialVisibilityState = () => {
  const initialVisibilityState = Object.fromEntries(
    accessors.map((k) => [k, !hiddenColumns.includes(k)])
  );
  return initialVisibilityState;
};

const convertDateFormat = (dateStr: string): string => {
  const date = new Date(dateStr);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return formattedDate;
};

const convertText = (columnMetadata: ColumnMetadata) => {
  if (columnMetadata.isMath) {
    return <BlockMath>{columnMetadata.abbr}</BlockMath>;
  } else {
    return <>{columnMetadata.abbr}</>;
  }
};

const buildColumns = (metadata: Metadata): ColumnDef<Model>[] => {
  return accessors.map((k) => {
    const columnMetadata = getColumnMetadata(k, metadata.columns);
    return {
      accessorKey: k,
      id: k,
      meta: {
        accessor: columnMetadata.accessor,
        name: columnMetadata.name,
        abbr: columnMetadata.abbr,
        desc: columnMetadata.description,
      },
      enableSorting: true,
      enableHiding: k !== "model",
      header: ({ column }) => (
        <>
          {column.columnDef.meta?.desc !== undefined ? (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {convertText(columnMetadata)}
              <HoverCard>
                <HoverCardTrigger asChild>
                  <InfoCircledIcon className="ml-1" />
                </HoverCardTrigger>
                <HoverCardContent className="w-100">
                  <div className="flex justify-between space-x-4">
                    {column.columnDef.meta?.desc}
                  </div>
                </HoverCardContent>
              </HoverCard>
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {convertText(columnMetadata)}
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </>
      ),
      cell: ({ row, column }) => {
        const value = row.getValue(column.id) as string | undefined;
        if (value === undefined || value === null) return <></>;
        if (column.id === "model") {
          const modelDesc = getModelMetadata(value, metadata.models);
          return (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex align-left">
                  {getImage(modelDesc.company)}
                  <Button variant="link">
                    <a href={modelDesc.urlPaper} target="_blank">
                      {value}
                    </a>
                  </Button>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="flex justify-between space-x-4">
                  {getImage(modelDesc.source)}
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold">{value}</h4>
                    <p className="text-sm">{modelDesc.description}</p>
                    <div className="flex items-center pt-2">
                      <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                      <span className="text-xs text-muted-foreground">
                        Released {convertDateFormat(modelDesc.releaseDate)}
                      </span>
                    </div>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
          );
        }
        if (
          value === undefined ||
          value === null ||
          value.toString() === "-1"
        ) {
          return <>-</>;
        }
        if (column.id === "nb_parameters") {
          return <>{value}B</>;
        }
        if (column.id === "nb_tokens") {
          return <>{value}T</>;
        }
        if (column.id === "activation") {
          return (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex align-left">{value}</div>
              </HoverCardTrigger>
              <HoverCardContent className="w-100">
                <BlockMath
                  math={getActivationFormula(value, metadata.activations)}
                />
              </HoverCardContent>
            </HoverCard>
          );
        }
        const isBoolean =
          value.toString() === "true" || value.toString() === "false";
        return isBoolean ? (
          value.toString() === "true" ? (
            <CheckIcon color="black" />
          ) : (
            <Cross1Icon color="black" />
          )
        ) : (
          <>{value}</>
        );
      },
    };
  });
};

export { buildColumns, getImage, buildInitialVisibilityState };
