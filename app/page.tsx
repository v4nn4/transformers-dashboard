"use client";
import { useEffect, useState } from "react";
import { buildColumns } from "./models/columns";
import { DataTable } from "./models/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { getImage } from "./models/columns";
import { ModeToggle } from "@/components/ModeToggle";

const HomePage: React.FC = () => {
  const [data, setData] = useState<Model[]>([]);
  const [columns, setColumns] = useState<ColumnDef<Model>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataResponse = await fetch("/api/models", {
        method: "GET",
      });
      let data: Model[] = await dataResponse.json();
      setData(data);
      const metadataResponse = await fetch("/api/metadata", {
        method: "GET",
      });
      let metadata: Metadata = await metadataResponse.json();
      setColumns(buildColumns(metadata));
    };
    fetchData();
  }, []);
  return (
    <div style={{ width: "90%", margin: "0 auto", paddingTop: "20px" }}>
      <div className="flex mb-4 justify-between">
        <div>
          <h1 className="scroll-m-20 tracking-tight font-semibold lg:text-2xl mb-2">
            Transformers Dashboard
          </h1>
          <p className="text-sm font-medium leading-none text-muted-foreground">
            A curated list of transformer models and their parameters.
          </p>
        </div>
        <div className="min-w-10">
          <ModeToggle />
        </div>
      </div>
      <DataTable columns={columns} data={data} />
      <div className="flex justify-between mt-6 mb-10">
        <p className="text-sm leading-loose text-muted-foreground">
          Built by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
            href="https://github.com/v4nn4"
          >
            v4nn4
          </a>{" "}
          using{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
            href="https://ui.shadcn.com/"
          >
            shadcn/ui
          </a>
          . Last updated on 2024-05-02.
        </p>
        <div className="min-w-10">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/v4nn4/transformers-dashboard"
          >
            {getImage("github")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
