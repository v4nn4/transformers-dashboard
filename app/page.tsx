"use client";
import { useEffect, useState } from "react";
import { Model, buildColumns } from "./models/columns";
import { DataTable } from "./models/data-table";
import { Github } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";

const HomePage: React.FC = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState<ColumnDef<Model>[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataResponse = await fetch("/api/models", {
        method: "GET",
      });
      let data = await dataResponse.json();
      setData(data);
      const metadataResponse = await fetch("/api/metadata", {
        method: "GET",
      });
      let metadata = await metadataResponse.json();
      setColumns(buildColumns(metadata));
    };
    fetchData();
  }, []);
  return (
    <div style={{ width: "90%", margin: "0 auto", paddingTop: "20px" }}>
      <div className="mb-4">
        <h1 className="scroll-m-20 tracking-tight font-semibold lg:text-3xl mb-2">
          Transformers Dashboard
        </h1>
        <p className="text-sm font-medium leading-none text-muted-foreground">
          Last updated 2024-05-02
        </p>
      </div>
      <DataTable columns={columns} initialVisibilityState={{}} data={data} />
      <div className="flex justify-between text-center md:mt-6 mb-10">
        <p className=" text-sm text-slate-400">
          Built by{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="text-slate-800"
            href="https://github.com/v4nn4"
          >
            v4nn4
          </a>{" "}
          using{" "}
          <a
            target="_blank"
            rel="noreferrer"
            className="text-slate-800"
            href="https://ui.shadcn.com/"
          >
            shadcn/ui
          </a>
          .
        </p>

        <div className="flex items-center gap-4">
          <a
            target="_blank"
            rel="noreferrer"
            className="text-slate-800"
            href="https://github.com/v4nn4/llm-dashboard"
          >
            <Github />
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
